import Link from "next/link";

import { InfoCard } from "@/components/app/blocks";
import { StatCard } from "@/components/app/stat-card";
import { getAdminSummary, getModerationSummary } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function AdminDashboardPage() {
  await requireRole("ADMIN");
  const [summary, moderation] = await Promise.all([getAdminSummary(), getModerationSummary()]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Utilisateurs" value={summary.totalUsers.toLocaleString("fr-FR")} />
        <StatCard label="Validations en attente" value={String(summary.pendingAccounts)} />
        <StatCard label="Comptes bloques" value={String(summary.blockedAccounts)} />
        <StatCard label="Audit 24h" value={String(summary.auditEvents24h)} />
      </section>
      <InfoCard title="Pilotage V1" description="Comptes, referentiels, mappings, moderation, audit et export.">
        <div className="space-y-3 text-sm text-[var(--muted-foreground)]">
          <p>{`Blocages actifs: ${moderation.blockedAccounts} · Signalements suspects: ${moderation.suspiciousSignals}`}</p>
          <p>
            Verification DB:{" "}
            <Link href="/api/health/db" className="font-semibold text-[var(--primary)] hover:underline">
              /api/health/db
            </Link>
          </p>
        </div>
      </InfoCard>
    </div>
  );
}
