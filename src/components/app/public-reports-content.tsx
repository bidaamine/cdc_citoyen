"use client";

import Link from "next/link";

import { DataTableCard } from "@/components/app/data-table-card";
import { useTranslations } from "@/components/app/locale-provider";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PublishedReportItem } from "@/lib/api-types";

export function PublicReportsContent({
  reports,
  filters,
  categoryOptions,
  exerciseOptions,
}: {
  reports: PublishedReportItem[];
  filters: { q?: string; category?: string; exercise?: string };
  categoryOptions: string[];
  exerciseOptions: string[];
}) {
  const t = useTranslations();

  return (
    <PageShell eyebrow={t.reportsPage.eyebrow} title={t.reportsPage.title} description={t.reportsPage.description}>
      <DataTableCard
        title={t.reportsPage.cardTitle}
        description={t.reportsPage.cardDescription}
        columns={[
          t.reportsPage.columns.report,
          t.reportsPage.columns.exercise,
          t.reportsPage.columns.category,
          t.reportsPage.columns.publishedAt,
        ]}
        toolbar={
          <form className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_180px_auto]">
            <Input name="q" defaultValue={filters.q} placeholder={t.reportsPage.searchPlaceholder} />
            <select
              name="category"
              defaultValue={filters.category ?? ""}
              className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <option value="">{t.reportsPage.allCategories}</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              name="exercise"
              defaultValue={filters.exercise ?? ""}
              className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <option value="">{t.reportsPage.allExercises}</option>
              {exerciseOptions.map((exercise) => (
                <option key={exercise} value={exercise}>
                  {exercise}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button type="submit">{t.common.filter}</Button>
              <Button type="submit" formAction="?" variant="outline">
                {t.common.reset}
              </Button>
            </div>
          </form>
        }
        emptyMessage={t.reportsPage.empty}
        rows={reports.map((row) => [
          <Link key={row.id} href={`/themes/${row.proposalId}`} className="font-semibold hover:underline">
            {row.title}
          </Link>,
          row.exercise,
          row.category,
          row.publishedAt,
        ])}
      />
    </PageShell>
  );
}
