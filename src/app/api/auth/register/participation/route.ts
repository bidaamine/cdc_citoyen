import { badRequest, created } from "@/lib/http";
import { repository } from "@/lib/repository";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await repository.registerParticipationUser(body);

  if ("error" in result) {
    return badRequest("Invalid registration payload", result.error);
  }

  return created(result.data);
}
