"use client";

import dynamic from "next/dynamic";
import type { StatsSeriesItem } from "@/lib/api-types";

const DynamicStatsChart = dynamic(
  () => import("@/components/app/stats-chart-client").then((mod) => mod.StatsChartClient),
  {
    ssr: false,
    loading: () => <div className="h-[320px] rounded-3xl bg-[var(--muted)]/70" />,
  },
);

export function StatsChart({ data }: { data: StatsSeriesItem[] }) {
  return <DynamicStatsChart data={data} />;
}
