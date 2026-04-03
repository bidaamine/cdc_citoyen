import { StatCard } from "@/components/app/stat-card";
import { getPresidentSummary } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function PresidentDashboardPage() {
  const session = await requireRole("PRESIDENT");
  const summary = await getPresidentSummary(session.user.id);

  return (
    <section className="grid gap-4 md:grid-cols-4">
      <StatCard label={`Propositions a traiter - ${summary.chamberName}`} value={String(summary.proposalsToReview)} />
      <StatCard label="Signalements a traiter" value={String(summary.reportsToReview)} />
      <StatCard label="Portefeuille couvert" value={`${summary.portfolioCoverage} categories`} />
      <StatCard label="Delai moyen" value={`${summary.averageProcessingDays} j`} />
    </section>
  );
}
