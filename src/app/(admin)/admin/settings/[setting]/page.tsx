import { notFound } from "next/navigation";

import { SettingManager } from "@/components/app/setting-manager";
import { settingsCatalog } from "@/lib/content";
import { getSettingGroup } from "@/lib/queries";

export default async function SettingPage({
  params,
}: {
  params: Promise<{ setting: keyof typeof settingsCatalog }>;
}) {
  const { setting } = await params;
  const config = await getSettingGroup(setting);
  if (!config) notFound();

  return <SettingManager setting={setting} initialData={config} />;
}
