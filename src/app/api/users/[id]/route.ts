import { badRequest, notFound, ok } from "@/lib/http";
import { repository } from "@/lib/repository";
import { recordAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await repository.getUser(id);

  if (!user) {
    return notFound("User not found");
  }

  return ok(user);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireRole("ADMIN");
  const { id } = await params;
  const body = await request.json();

  if (!body.status || typeof body.status !== "string") {
    return badRequest("Missing user status");
  }

  const user = await repository.updateUserStatus(id, body.status);

  if (!user) {
    return notFound("User not found");
  }

  await recordAuditLog({
    action: "UPDATE_USER_STATUS",
    resourceType: "user",
    resourceId: id,
    actorUserId: session.user.id,
    metadata: { status: body.status },
  });

  return ok(user);
}
