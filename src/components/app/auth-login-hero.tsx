"use client";

import { BulletList, InfoCard } from "@/components/app/blocks";
import { useTranslations } from "@/components/app/locale-provider";

export function AuthLoginHero() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
        {t.auth.loginPage.eyebrow}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">{t.auth.loginPage.title}</h1>
      <p className="text-lg text-[var(--muted-foreground)]">{t.auth.loginPage.description}</p>
      <InfoCard title={t.auth.loginPage.demoTitle} description={t.auth.loginPage.demoDescription}>
        <BulletList items={[...t.auth.loginPage.demoAccounts]} />
      </InfoCard>
    </div>
  );
}
