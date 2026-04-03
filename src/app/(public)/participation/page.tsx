import { PublicParticipationContent } from "@/components/app/public-participation-content";
import { getDashboardOverview, getSettingGroup } from "@/lib/queries";

export default async function ParticipationPage() {
  const [overview, themeCategories] = await Promise.all([
    getDashboardOverview(),
    getSettingGroup("theme-categories"),
  ]);

  return (
    <PublicParticipationContent
      proposalsCount={overview.proposalsCount}
      categoryCount={themeCategories?.rows.length ?? 0}
    />
  );
}
