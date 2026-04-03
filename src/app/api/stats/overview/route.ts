import { ok } from "@/lib/http";
import { repository } from "@/lib/repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return ok(
    await repository.getOverview({
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    }),
  );
}
