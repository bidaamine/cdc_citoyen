"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { StatsSeriesItem } from "@/lib/api-types";

export function StatsChartClient({ data }: { data: StatsSeriesItem[] }) {
  return (
    <div className="h-[320px] min-h-[320px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={320} minHeight={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d6d3d1" />
          <XAxis dataKey="name" stroke="#57534e" />
          <YAxis stroke="#57534e" />
          <Tooltip />
          <Bar dataKey="propositions" fill="#0f766e" radius={[10, 10, 0, 0]} />
          <Bar dataKey="signalements" fill="#ea580c" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
