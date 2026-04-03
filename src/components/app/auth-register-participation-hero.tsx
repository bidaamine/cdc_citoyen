"use client";

import { BulletList, InfoCard } from "@/components/app/blocks";
import { useTranslations } from "@/components/app/locale-provider";

export function AuthRegisterParticipationHero() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
        {t.auth.registerParticipationPage.eyebrow}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">{t.auth.registerParticipationPage.title}</h1>
      <InfoCard
        title={t.auth.registerParticipationPage.validationTitle}
        description={t.auth.registerParticipationPage.validationDescription}
      >
        <BulletList items={[...t.auth.registerParticipationPage.validationItems]} />
      </InfoCard>
    </div>
  );
}
