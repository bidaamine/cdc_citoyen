import { created, ok, badRequest } from "@/lib/http";
import { repository } from "@/lib/repository";
import { requireCurrentUserId } from "@/lib/session";
import { nextExerciseYear } from "@/lib/utils";

export async function GET() {
  return ok({
    items: await repository.listProposals(),
  });
}

export async function POST(request: Request) {
  const userId = await requireCurrentUserId();
  const body = await request.json();
  const result = await repository.createProposal({
    titleFr: body.titleFr,
    titleAr: body.titleAr,
    descriptionFr: body.descriptionFr,
    descriptionAr: body.descriptionAr,
    categoryId: body.categoryId,
    exerciseYear: body.exerciseYear ?? nextExerciseYear(),
  }, userId);

  if ("error" in result) {
    return badRequest("Invalid proposal payload", result.error);
  }

  return created(result.data);
}
