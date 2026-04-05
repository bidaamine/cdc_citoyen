import { notFound, ok } from "@/lib/http";
import { repository } from "@/lib/repository";
import { requireCurrentUserId } from "@/lib/session";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await requireCurrentUserId();
  const { id } = await params;
  const result = await repository.toggleProposalLike(id, userId);

  if (!result) {
    return notFound("Proposal not found");
  }

  return ok(result);
}
