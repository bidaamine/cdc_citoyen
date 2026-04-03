"use client";

import Link from "next/link";

import { BulletList, InfoCard } from "@/components/app/blocks";
import { useLocale, useTranslations } from "@/components/app/locale-provider";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { getIntlLocale } from "@/lib/i18n";

export function PublicParticipationContent({
  proposalsCount,
  categoryCount,
}: {
  proposalsCount: number;
  categoryCount: number;
}) {
  const { locale } = useLocale();
  const t = useTranslations();
  const numberLocale = getIntlLocale(locale);

  return (
    <PageShell
      eyebrow={t.participationPage.eyebrow}
      title={t.participationPage.title}
      description={t.participationPage.description}
      aside={
        <InfoCard title={t.participationPage.asideTitle} description={t.participationPage.asideDescription}>
          <BulletList
            items={[
              `${t.participationPage.receivedProposals}: ${proposalsCount.toLocaleString(numberLocale)}`,
              `${t.participationPage.activeCategories}: ${categoryCount.toLocaleString(numberLocale)}`,
              t.participationPage.statuses,
            ]}
          />
        </InfoCard>
      }
    >
      <InfoCard title={t.participationPage.rulesTitle} description={t.participationPage.rulesDescription}>
        <BulletList
          items={[
            t.participationPage.nextExercise,
            `${t.participationPage.assignment} (${categoryCount.toLocaleString(numberLocale)}).`,
            t.participationPage.notifications,
          ]}
        />
      </InfoCard>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/auth/register/participation">{t.participationPage.createAccount}</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/themes">{t.participationPage.browseThemes}</Link>
        </Button>
      </div>
    </PageShell>
  );
}
