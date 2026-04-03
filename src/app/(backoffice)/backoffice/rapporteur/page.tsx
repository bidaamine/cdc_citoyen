import { StatCard } from "@/components/app/stat-card";
import { getRapporteurSummary } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function RapporteurDashboardPage() {
  const session = await requireRole("RAPPORTEUR_GENERAL");
  const summary = await getRapporteurSummary(session.user.id);

  return (
    <section className="grid gap-4 md:grid-cols-5">
      <StatCard label="Propositions transmises" value={String(summary.transmitted)} />
      <StatCard label="En attente d'arbitrage" value={String(summary.pendingDecision)} />
      <StatCard label="Acceptees" value={String(summary.accepted)} />
      <StatCard label="Rejetees" value={String(summary.rejected)} />
      <StatCard label="Plan d'action" value={`${summary.actionPlanCount} themes`} trend={`${summary.averageDecisionDays} j`} />
    </section>
  );
}
