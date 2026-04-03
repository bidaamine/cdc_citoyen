import { PublicReportingContent } from "@/components/app/public-reporting-content";
import { getDashboardOverview, getSettingGroup } from "@/lib/queries";

export default async function ReportingPage() {
  const [overview, reportCategories] = await Promise.all([
    getDashboardOverview(),
    getSettingGroup("report-categories"),
  ]);

  return (
    <PublicReportingContent
      reportsCount={overview.reportsCount}
      categoryCount={reportCategories?.rows.length ?? 0}
    />
  );
}
