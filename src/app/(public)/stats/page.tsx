import { PublicStatsContent } from "@/components/app/public-stats-content";
import { getDashboardOverview, getStatsSeries } from "@/lib/queries";

export default async function PublicStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; status?: string }>;
}) {
  const filters = await searchParams;
  const query = new URLSearchParams(
    Object.entries(filters).filter(([, value]) => Boolean(value)) as Array<[string, string]>,
  ).toString();
  const exportHref = query ? `/api/stats/export?${query}` : "/api/stats/export";
  const [overview, series] = await Promise.all([getDashboardOverview(filters), getStatsSeries(filters)]);

  return <PublicStatsContent overview={overview} series={series} filters={filters} exportHref={exportHref} />;
}
