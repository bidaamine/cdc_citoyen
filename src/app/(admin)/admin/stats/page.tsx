import { InfoCard } from "@/components/app/blocks";
import { StatCard } from "@/components/app/stat-card";
import { StatsChart } from "@/components/app/stats-chart";
import { StatsFilters } from "@/components/app/stats-filters";
import { getDashboardOverview, getStatsSeries } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function AdminStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; status?: string }>;
}) {
  await requireRole("ADMIN");
  const filters = await searchParams;
  const query = new URLSearchParams(
    Object.entries(filters).filter(([, value]) => Boolean(value)) as Array<[string, string]>,
  ).toString();
  const exportHref = query ? `/api/stats/export?${query}` : "/api/stats/export";
  const [overview, series] = await Promise.all([
    getDashboardOverview(filters),
    getStatsSeries(filters),
  ]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        {overview.publicStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
      <InfoCard title="Statistiques avancees" description="Filtres temporels, graphiques interactifs et export synchronise.">
        <div className="space-y-4">
          <StatsFilters from={filters.from} to={filters.to} status={filters.status} exportHref={exportHref} />
          <StatsChart data={series} />
        </div>
      </InfoCard>
    </div>
  );
}
