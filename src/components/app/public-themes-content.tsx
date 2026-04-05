"use client";

import Link from "next/link";

import { DataTableCard } from "@/components/app/data-table-card";
import { useLocale, useTranslations } from "@/components/app/locale-provider";
import { PageShell } from "@/components/app/page-shell";
import { PublicThemeSuggestionForm } from "@/components/app/public-theme-suggestion-form";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMessage, getIntlLocale } from "@/lib/i18n";
import type { ProposalListItem } from "@/lib/api-types";
import { nextExerciseYear } from "@/lib/utils";

export function PublicThemesContent({
  themes,
  filters,
  categoryOptions,
  exerciseOptions,
}: {
  themes: ProposalListItem[];
  filters: { q?: string; status?: string; category?: string; exercise?: string };
  categoryOptions: string[];
  exerciseOptions: string[];
}) {
  const t = useTranslations();
  const { locale } = useLocale();
  const numberLocale = getIntlLocale(locale);

  return (
    <PageShell eyebrow={t.themesPage.eyebrow} title={t.themesPage.title} description={t.themesPage.description}>
      <PublicThemeSuggestionForm categoryOptions={categoryOptions} exerciseYear={nextExerciseYear()} />
      <DataTableCard
        title={t.themesPage.cardTitle}
        description={t.themesPage.cardDescription}
        columns={[
          t.themesPage.columns.title,
          t.themesPage.columns.category,
          t.themesPage.columns.exercise,
          t.themesPage.columns.status,
          t.themesPage.columns.engagement,
        ]}
        toolbar={
          <form className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_220px_180px_auto]">
            <Input name="q" defaultValue={filters.q} placeholder={t.themesPage.searchPlaceholder} />
            <select
              name="status"
              defaultValue={filters.status ?? ""}
              className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <option value="">{t.themesPage.allStatuses}</option>
              <option value="RECU">{t.statuses.RECU}</option>
              <option value="EN_COURS_ANALYSE">{t.statuses.EN_COURS_ANALYSE}</option>
              <option value="ACCEPTEE">{t.statuses.ACCEPTEE}</option>
              <option value="REJETEE">{t.statuses.REJETEE}</option>
              <option value="NON_ACTUALISEE">{t.statuses.NON_ACTUALISEE}</option>
            </select>
            <select
              name="category"
              defaultValue={filters.category ?? ""}
              className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <option value="">{t.themesPage.allCategories}</option>
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
              <option value="">{t.themesPage.allExercises}</option>
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
        emptyMessage={t.themesPage.empty}
        rows={themes.map((row) => [
          <Link key={`${row.id}-title`} href={`/themes/${row.id}`} className="font-semibold hover:underline">
            {row.title}
          </Link>,
          row.category,
          String(row.exercise),
          <StatusBadge key={`${row.id}-status`} value={row.status} />,
          formatMessage(t.themesPage.engagementFormat, {
            likes: row.likes.toLocaleString(numberLocale),
            comments: row.comments.toLocaleString(numberLocale),
          }),
        ])}
      />
    </PageShell>
  );
}
