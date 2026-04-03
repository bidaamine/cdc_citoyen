import { notFound, ok, badRequest, unauthorized } from "@/lib/http";
import { repository } from "@/lib/repository";
import { recordAuditLog } from "@/lib/audit";
import { getSession, requireRole } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  const { id } = await params;
  const role = session?.user?.role;

  if (!session?.user?.id || !role) {
    return unauthorized("Authentication required");
  }

  const proposal =
    role === "PRESIDENT"
      ? await repository.getProposalForPresident(id, session.user.id)
      : role === "RAPPORTEUR_GENERAL"
        ? await repository.getProposalForRapporteur(id, session.user.id)
        : await repository.getProposal(id, session.user.id);

  if (!proposal) {
    return notFound("Proposal not found");
  }

  return ok(proposal);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireRole("PRESIDENT", "RAPPORTEUR_GENERAL");
  const { id } = await params;
  const body = await request.json();
  const workflowAction = typeof body.workflowAction === "string" ? body.workflowAction : undefined;
  const note = typeof body.note === "string" ? body.note : undefined;

  if (!body.status || typeof body.status !== "string") {
    return badRequest("Missing proposal status");
  }

  if (session.user.role === "PRESIDENT") {
    const proposalInScope = await repository.getProposalForPresident(id, session.user.id);
    if (!proposalInScope) {
      return notFound("Proposal not found");
    }

    const isValidPresidentTransition =
      body.status === "EN_COURS_ANALYSE" &&
      (!workflowAction || workflowAction === "TRANSMIT_TO_RAPPORTEUR");

    if (!isValidPresidentTransition) {
      return badRequest("President can only move a proposal to EN_COURS_ANALYSE or transmit it to the rapporteur");
    }
  }

  if (session.user.role === "RAPPORTEUR_GENERAL") {
    const proposalInScope = await repository.getProposalForRapporteur(id, session.user.id);
    if (!proposalInScope) {
      return notFound("Proposal not found");
    }

    if (!["ACCEPTEE", "REJETEE", "NON_ACTUALISEE"].includes(body.status)) {
      return badRequest("Rapporteur can only record a final decision");
    }
  }

  const proposal = await repository.updateProposalStatus({
    id,
    status: body.status,
    actorUserId: session.user.id,
    actorRole: session.user.role,
    workflowAction,
    note,
  });

  if (!proposal) {
    return notFound("Proposal not found");
  }

  await recordAuditLog({
    action: "UPDATE_PROPOSAL_STATUS",
    resourceType: "proposal",
    resourceId: id,
    actorUserId: session.user.id,
    metadata: { status: body.status, workflowAction, note },
  });

  return ok(proposal);
}
