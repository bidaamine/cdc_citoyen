"use client";

import { BulletList, InfoCard } from "@/components/app/blocks";
import { useTranslations } from "@/components/app/locale-provider";

export function AuthRegisterReportingHero() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--secondary)]">
        {t.auth.registerReportingPage.eyebrow}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">{t.auth.registerReportingPage.title}</h1>
      <InfoCard
        title={t.auth.registerReportingPage.identityTitle}
        description={t.auth.registerReportingPage.identityDescription}
      >
        <BulletList items={[...t.auth.registerReportingPage.identityItems]} />
      </InfoCard>
    </div>
  );
}
