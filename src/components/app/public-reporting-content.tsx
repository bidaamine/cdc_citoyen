"use client";

import Link from "next/link";

import { BulletList, InfoCard } from "@/components/app/blocks";
import { useLocale, useTranslations } from "@/components/app/locale-provider";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { getIntlLocale } from "@/lib/i18n";

export function PublicReportingContent({
  reportsCount,
  categoryCount,
}: {
  reportsCount: number;
  categoryCount: number;
}) {
  const { locale } = useLocale();
  const t = useTranslations();
  const numberLocale = getIntlLocale(locale);

  return (
    <PageShell
      eyebrow={t.reportingPage.eyebrow}
      title={t.reportingPage.title}
      description={t.reportingPage.description}
      aside={
        <InfoCard title={t.reportingPage.warningTitle} description={t.reportingPage.warningDescription}>
          <BulletList
            items={[
              t.reportingPage.legalFramework,
              t.reportingPage.confidentiality,
              `${t.reportingPage.reportsCount}: ${reportsCount.toLocaleString(numberLocale)}.`,
            ]}
          />
        </InfoCard>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title={t.reportingPage.statusesTitle} description={t.reportingPage.statusesDescription}>
          <BulletList
            items={[
              t.reportingPage.nonProcessed,
              t.reportingPage.rejected,
              t.reportingPage.converted,
              `${t.reportingPage.activeCategories}: ${categoryCount.toLocaleString(numberLocale)}`,
            ]}
          />
        </InfoCard>
        <InfoCard title={t.reportingPage.preambleTitle} description={t.reportingPage.preambleDescription}>
          <BulletList
            items={[
              t.reportingPage.legalNotice,
              t.reportingPage.explicitAcceptance,
              t.reportingPage.legalLinks,
            ]}
          />
        </InfoCard>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/auth/register/reporting">{t.reportingPage.createAccount}</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/legal/reporting-framework">{t.reportingPage.seeFramework}</Link>
        </Button>
      </div>
    </PageShell>
  );
}
