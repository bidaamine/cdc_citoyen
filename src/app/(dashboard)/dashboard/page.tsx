import Link from "next/link";

import { InfoCard } from "@/components/app/blocks";
import { StatCard } from "@/components/app/stat-card";
import { getDashboardOverview } from "@/lib/queries";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const overview = await getDashboardOverview();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Compte" value="ACTIF" />
        <StatCard label="Mes propositions" value={String(overview.proposalsCount)} />
        <StatCard label="Mes signalements" value={String(overview.reportsCount)} />
        <StatCard label="Notifications" value={String(overview.notificationsCount)} />
      </section>
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <InfoCard title="Raccourcis" description="Actions principales du citoyen connecté.">
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/proposals/new">Nouvelle proposition</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/dashboard/reports/new">Nouveau signalement</Link>
            </Button>
          </div>
        </InfoCard>
        <InfoCard title="Compte" description="État de validation et vérification.">
          <p className="text-sm text-[var(--muted-foreground)]">
            Actif, email confirmé, profil prêt pour participation et signalement.
          </p>
        </InfoCard>
      </section>
    </div>
  );
}
