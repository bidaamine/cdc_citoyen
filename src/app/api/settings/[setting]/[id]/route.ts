import { badRequest, ok } from "@/lib/http";
import { repository } from "@/lib/repository";
import { settingsCatalog } from "@/lib/content";
import { requireRole } from "@/lib/session";

type SettingKey = keyof typeof settingsCatalog;

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ setting: string; id: string }> },
) {
  await requireRole("ADMIN");
  const { setting, id } = await params;
  const success = await repository.deactivateSettingValue(setting as SettingKey, id);

  if (!success) {
    return badRequest("Unable to deactivate setting value");
  }

  return ok({ success: true });
}
