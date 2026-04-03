import { ok } from "@/lib/http";
import { repository } from "@/lib/repository";
import { requireCurrentUserId } from "@/lib/session";

export async function GET() {
  const userId = await requireCurrentUserId();
  return ok({
    items: await repository.listNotifications(userId),
  });
}
