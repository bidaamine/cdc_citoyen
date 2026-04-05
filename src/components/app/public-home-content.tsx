"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, MessageSquareWarning } from "lucide-react";

import { BulletList, InfoCard, LinkList } from "@/components/app/blocks";
import { useLocale, useTranslations } from "@/components/app/locale-provider";
import { PageShell } from "@/components/app/page-shell";
import { StatCard } from "@/components/app/stat-card";
import { Button } from "@/components/ui/button";
import { getIntlLocale, getOverviewStatTranslationKey } from "@/lib/i18n";
import type { OverviewResponse, ProposalListItem, PublishedReportItem } from "@/lib/api-types";

export function PublicHomeContent({
  overview,
  themes,
  reports,
}: {
  overview: OverviewResponse;
  themes: ProposalListItem[];
  reports: PublishedReportItem[];
}) {
  const { locale } = useLocale();
  const t = useTranslations();
  const numberLocale = getIntlLocale(locale);

  return (
    <PageShell
      eyebrow={t.home.eyebrow}
      title={t.home.title}
      description={t.home.description}
      aside={
        <>
          <InfoCard title={t.home.howItWorksTitle} description={t.home.howItWorksDescription}>
            <BulletList items={[...t.home.howItWorksItems]} />
          </InfoCard>
          <LinkList
            items={[
              { href: "/participation", label: t.home.links[0] },
              { href: "/signalement", label: t.home.links[1] },
              { href: "/themes", label: t.home.links[2] },
            ]}
          />
        </>
      }
    >
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--sidebar)] p-8 text-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">{t.home.moduleOne}</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">{t.home.participationTitle}</h2>
          <p className="mt-4 max-w-xl text-slate-300">{t.home.participationBody}</p>
          <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white" asChild>
            <Link href="/participation">
              {t.home.participationCta}
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-8 text-[var(--foreground)] shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.home.moduleTwo}</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">{t.home.reportingTitle}</h2>
          <p className="mt-4 max-w-xl text-slate-600">{t.home.reportingBody}</p>
          <Button variant="outline" className="mt-6 border-slate-300 text-slate-700 hover:bg-slate-50" asChild>
            <Link href="/signalement">
              {t.home.reportingCta}
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {overview.publicStats.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
            label={t.overviewStats[getOverviewStatTranslationKey(stat.key ?? stat.label)]}
          />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <InfoCard title={t.home.publicJourneyTitle} description={t.home.publicJourneyDescription}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-[var(--muted)] p-5">
              <BookOpen className="size-5 text-[var(--primary)]" />
              <p className="mt-3 font-semibold">{t.home.themesCardTitle}</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {`${themes.length.toLocaleString(numberLocale)} ${t.home.themesCardBody}`}
              </p>
            </div>
            <div className="rounded-3xl bg-[var(--muted)] p-5">
              <MessageSquareWarning className="size-5 text-[var(--secondary)]" />
              <p className="mt-3 font-semibold">{t.home.reportsCardTitle}</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {`${reports.length.toLocaleString(numberLocale)} ${t.home.reportsCardBody}`}
              </p>
            </div>
          </div>
        </InfoCard>
        <InfoCard title={t.home.quickAccessTitle} description={t.home.quickAccessDescription}>
          <LinkList
            items={[
              { href: "/auth/register/participation", label: t.home.quickLinks[0] },
              { href: "/auth/register/reporting", label: t.home.quickLinks[1] },
              { href: "/themes", label: t.home.quickLinks[2] },
              { href: "/reports", label: t.home.quickLinks[3] },
            ]}
          />
        </InfoCard>
      </section>
    </PageShell>
  );
}
