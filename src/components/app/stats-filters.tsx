"use client";

import Link from "next/link";

import { useTranslations } from "@/components/app/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StatsFilters({
  from,
  to,
  status,
  exportHref,
}: {
  from?: string;
  to?: string;
  status?: string;
  exportHref?: string;
}) {
  const t = useTranslations();

  return (
    <form className="grid gap-3 md:grid-cols-[180px_180px_220px_auto]">
      <Input type="date" name="from" defaultValue={from} />
      <Input type="date" name="to" defaultValue={to} />
      <select
        name="status"
        defaultValue={status ?? ""}
        className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        <option value="">{t.statsPage.allStatuses}</option>
        <option value="RECU">{t.statsPage.statusOptions.RECU}</option>
        <option value="EN_COURS_ANALYSE">{t.statsPage.statusOptions.EN_COURS_ANALYSE}</option>
        <option value="ACCEPTEE">{t.statsPage.statusOptions.ACCEPTEE}</option>
        <option value="REJETEE">{t.statsPage.statusOptions.REJETEE}</option>
        <option value="NON_ACTUALISEE">{t.statsPage.statusOptions.NON_ACTUALISEE}</option>
        <option value="NON_TRAITE">{t.statsPage.statusOptions.NON_TRAITE}</option>
        <option value="REJETE">{t.statsPage.statusOptions.REJETE}</option>
        <option value="CONVERTI_EN_THEME">{t.statsPage.statusOptions.CONVERTI_EN_THEME}</option>
      </select>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">{t.common.filter}</Button>
        <Button type="submit" formAction="?" variant="outline">
          {t.common.reset}
        </Button>
        {exportHref ? (
          <Button asChild variant="secondary">
            <Link href={exportHref}>{t.common.exportCsv}</Link>
          </Button>
        ) : null}
      </div>
    </form>
  );
}
