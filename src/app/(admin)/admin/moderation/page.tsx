import { BulletList, InfoCard } from "@/components/app/blocks";
import { StatCard } from "@/components/app/stat-card";
import { getModerationSummary } from "@/lib/queries";

export default async function ModerationPage() {
  const summary = await getModerationSummary();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Comptes bloqués" value={String(summary.blockedAccounts)} />
        <StatCard label="Comptes en attente" value={String(summary.pendingAccounts)} />
        <StatCard label="Signalements suspects" value={String(summary.suspiciousSignals)} />
      </section>
      <InfoCard title="Modération et sécurité" description="Comptes suspects, abus, événements de sécurité et blocages.">
        <BulletList items={summary.recentActions} />
      </InfoCard>
    </div>
  );
}
