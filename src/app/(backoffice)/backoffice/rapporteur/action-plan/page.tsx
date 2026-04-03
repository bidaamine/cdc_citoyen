import { DataTableCard } from "@/components/app/data-table-card";
import { getActionPlan } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function ActionPlanPage() {
  const session = await requireRole("RAPPORTEUR_GENERAL");
  const rows = await getActionPlan(session.user.id);

  return (
    <DataTableCard
      title="Plan d'action annuel"
      description="Gestion de la liste finale des thèmes retenus."
      columns={["Thème", "Exercice", "Source", "État"]}
      rows={rows.map((row) => [row.theme, row.exercise, row.source, row.state])}
    />
  );
}
