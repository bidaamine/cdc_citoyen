import { created, ok, badRequest } from "@/lib/http";
import { repository } from "@/lib/repository";
import { requireCurrentUserId } from "@/lib/session";

export async function GET() {
  return ok({
    items: await repository.listReports(),
  });
}

export async function POST(request: Request) {
  const userId = await requireCurrentUserId();
  const body = await request.json();
  const result = await repository.createReport({
    subject: body.subject,
    targetEntityName: body.targetEntityName,
    targetEntityType: body.targetEntityType,
    address: body.address,
    relationToEntity: body.relationToEntity,
    circumstance: body.circumstance,
    factsLocation: body.factsLocation,
    factsPeriodicity: body.factsPeriodicity,
    irregularityDescription: body.irregularityDescription,
    reportCategoryId: body.reportCategoryId,
  }, userId);

  if ("error" in result) {
    return badRequest("Invalid report payload", result.error);
  }

  return created(result.data);
}
