import { ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">{label}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-4">
        <p className="text-3xl font-semibold">{value}</p>
        {trend ? (
          <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <ArrowUpRight className="size-3.5" />
            {trend}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
