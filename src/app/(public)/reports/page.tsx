import { PublicReportsContent } from "@/components/app/public-reports-content";
import { getPublishedReports } from "@/lib/queries";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; exercise?: string }>;
}) {
  const filters = await searchParams;
  const [reports, allReports] = await Promise.all([getPublishedReports(filters), getPublishedReports()]);
  const categoryOptions = [...new Set(allReports.map((row) => row.category))].sort();
  const exerciseOptions = [...new Set(allReports.map((row) => row.exercise))].sort();

  return (
    <PublicReportsContent
      reports={reports}
      filters={filters}
      categoryOptions={categoryOptions}
      exerciseOptions={exerciseOptions}
    />
  );
}
