import Link from "next/link";

import { DataTableCard } from "@/components/app/data-table-card";
import { StatusBadge } from "@/components/app/status-badge";
import { TableFilters } from "@/components/app/table-filters";
import { getPresidentProposals } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function PresidentProposalsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await requireRole("PRESIDENT");
  const filters = await searchParams;
  const proposalRows = await getPresidentProposals(session.user.id, filters);

  return (
    <DataTableCard
      title="Gestion des propositions"
      description="Recherche, filtrage, reformulation, validation et publication de synthese."
      columns={["Dossier", "Categorie", "Statut", "Action"]}
      toolbar={
        <TableFilters
          q={filters.q}
          status={filters.status}
          qPlaceholder="Rechercher un dossier ou une categorie..."
          statusOptions={[
            { label: "Recu", value: "RECU" },
            { label: "En cours d'analyse", value: "EN_COURS_ANALYSE" },
            { label: "Acceptee", value: "ACCEPTEE" },
            { label: "Rejetee", value: "REJETEE" },
            { label: "Non actualisee", value: "NON_ACTUALISEE" },
          ]}
        />
      }
      emptyMessage="Aucune proposition ne correspond aux filtres."
      rows={proposalRows.map((row) => [
        row.title,
        row.category,
        <StatusBadge key={`${row.id}-status`} value={row.status} />,
        <Link key={`${row.id}-action`} href={`/backoffice/president/proposals/${row.id}`} className="font-semibold hover:underline">
          Ouvrir
        </Link>,
      ])}
    />
  );
}
