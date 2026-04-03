import { badRequest, notFound, ok } from "@/lib/http";
import { repository } from "@/lib/repository";
import { requireCurrentUserId } from "@/lib/session";

export async function GET() {
  const userId = await requireCurrentUserId();
  const profile = await repository.getProfile(userId);

  if (!profile) {
    return notFound("Profile not found");
  }

  return ok(profile);
}

export async function PATCH(request: Request) {
  const userId = await requireCurrentUserId();
  const body = await request.json();
  const result = await repository.updateProfile(body, userId);

  if ("error" in result) {
    return badRequest("Invalid profile payload", result.error);
  }

  return ok(result.data);
}
