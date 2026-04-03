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

  const report =
    role === "PRESIDENT"
      ? await repository.getReportForPresident(id, session.user.id)
      : await repository.getReport(id, session.user.id);

  if (!report) {
    return notFound("Report not found");
  }

  return ok(report);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireRole("PRESIDENT");
  const { id } = await params;
  const body = await request.json();
  const workflowAction = typeof body.workflowAction === "string" ? body.workflowAction : undefined;
  const note = typeof body.note === "string" ? body.note : undefined;

  if (!body.status || typeof body.status !== "string") {
    return badRequest("Missing report status");
  }

  const reportInScope = await repository.getReportForPresident(id, session.user.id);
  if (!reportInScope) {
    return notFound("Report not found");
  }

  if (!["NON_TRAITE", "REJETE", "CONVERTI_EN_THEME"].includes(body.status)) {
    return badRequest("President can only process, reject, or convert a report");
  }

  if (body.status === "CONVERTI_EN_THEME" && workflowAction !== "CONVERT_TO_THEME") {
    return badRequest("Theme conversion requires workflowAction=CONVERT_TO_THEME");
  }

  const report = await repository.updateReportStatus({
    id,
    status: body.status,
    actorUserId: session.user.id,
    actorRole: session.user.role,
    workflowAction,
    note,
  });

  if (!report) {
    return notFound("Report not found");
  }

  await recordAuditLog({
    action: "UPDATE_REPORT_STATUS",
    resourceType: "report",
    resourceId: id,
    actorUserId: session.user.id,
    metadata: { status: body.status, workflowAction, note },
  });

  return ok(report);
}
