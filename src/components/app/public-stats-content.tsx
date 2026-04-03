"use client";

import { InfoCard } from "@/components/app/blocks";
import { useTranslations } from "@/components/app/locale-provider";
import { PageShell } from "@/components/app/page-shell";
import { StatCard } from "@/components/app/stat-card";
import { StatsChart } from "@/components/app/stats-chart";
import { StatsFilters } from "@/components/app/stats-filters";
import { getOverviewStatTranslationKey } from "@/lib/i18n";
import type { OverviewResponse, StatsSeriesItem } from "@/lib/api-types";

export function PublicStatsContent({
  overview,
  series,
  filters,
  exportHref,
}: {
  overview: OverviewResponse;
  series: StatsSeriesItem[];
  filters: { from?: string; to?: string; status?: string };
  exportHref: string;
}) {
  const t = useTranslations();

  return (
    <PageShell eyebrow={t.statsPage.eyebrow} title={t.statsPage.title} description={t.statsPage.description}>
      <section className="grid gap-4 md:grid-cols-4">
        {overview.publicStats.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
            label={t.overviewStats[getOverviewStatTranslationKey(stat.key ?? stat.label)]}
          />
        ))}
      </section>
      <InfoCard title={t.statsPage.chartTitle} description={t.statsPage.chartDescription}>
        <div className="space-y-4">
          <StatsFilters from={filters.from} to={filters.to} status={filters.status} exportHref={exportHref} />
          <StatsChart data={series} />
        </div>
      </InfoCard>
    </PageShell>
  );
}
