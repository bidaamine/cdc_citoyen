import { badRequest, notFound, ok } from "@/lib/http";
import { repository } from "@/lib/repository";
import { requireCurrentUserId } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await requireCurrentUserId();
  const { id } = await params;
  const body = await request.json();
  const result = await repository.addReportSubjectComment(id, body.body, userId);

  if (!result) {
    return notFound("Report subject not found");
  }

  if ("error" in result) {
    return badRequest("Invalid comment payload", result.error);
  }

  return ok(result.data);
}
