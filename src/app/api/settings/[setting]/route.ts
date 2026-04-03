import { badRequest, created, notFound, ok } from "@/lib/http";
import { repository } from "@/lib/repository";
import { settingsCatalog } from "@/lib/content";
import { requireRole } from "@/lib/session";

type SettingKey = keyof typeof settingsCatalog;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ setting: string }> },
) {
  const { setting } = await params;
  const settingKey = setting as SettingKey;
  const settingData = await repository.getSetting(settingKey);

  if (!settingData) {
    return notFound("Setting not found");
  }

  return ok(settingData);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ setting: string }> },
) {
  await requireRole("ADMIN");
  const { setting } = await params;
  const { label } = await request.json();

  if (!label || typeof label !== "string") {
    return badRequest("Missing setting label");
  }

  const settingKey = setting as SettingKey;
  const row = await repository.createSettingValue(settingKey, label);

  if (!row) {
    return badRequest("Unable to create setting value");
  }

  return created(row);
}
