import Link from "next/link";

import { DataTableCard } from "@/components/app/data-table-card";
import { StatusBadge } from "@/components/app/status-badge";
import { TableFilters } from "@/components/app/table-filters";
import { getPresidentReports } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function PresidentReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await requireRole("PRESIDENT");
  const filters = await searchParams;
  const reportRows = await getPresidentReports(session.user.id, filters);

  return (
    <DataTableCard
      title="Gestion des signalements"
      description="Lecture, validation, rejet, conversion en theme et suppression."
      columns={["Dossier", "Entite", "Statut", "Action"]}
      toolbar={
        <TableFilters
          q={filters.q}
          status={filters.status}
          qPlaceholder="Rechercher un signalement, une entite ou un accuse..."
          statusOptions={[
            { label: "Non traite", value: "NON_TRAITE" },
            { label: "Rejete", value: "REJETE" },
            { label: "Converti en theme", value: "CONVERTI_EN_THEME" },
          ]}
        />
      }
      emptyMessage="Aucun signalement ne correspond aux filtres."
      rows={reportRows.map((row) => [
        row.subject,
        row.entity,
        <StatusBadge key={`${row.id}-status`} value={row.status} />,
        <Link key={`${row.id}-action`} href={`/backoffice/president/reports/${row.id}`} className="font-semibold hover:underline">
          Ouvrir
        </Link>,
      ])}
    />
  );
}
