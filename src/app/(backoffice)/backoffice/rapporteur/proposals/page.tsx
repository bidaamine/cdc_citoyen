import Link from "next/link";

import { DataTableCard } from "@/components/app/data-table-card";
import { StatusBadge } from "@/components/app/status-badge";
import { TableFilters } from "@/components/app/table-filters";
import { getRapporteurProposals } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function RapporteurProposalsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await requireRole("RAPPORTEUR_GENERAL");
  const filters = await searchParams;
  const proposals = await getRapporteurProposals(session.user.id, filters);

  return (
    <DataTableCard
      title="Propositions transmises"
      description="Decisions finales du rapporteur general et alimentation du plan d'action."
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
      rows={proposals.map((row) => [
        row.title,
        row.category,
        <StatusBadge key={`${row.id}-status`} value={row.status} />,
        <Link key={`${row.id}-link`} href={`/backoffice/rapporteur/proposals/${row.id}`} className="font-semibold hover:underline">
          Ouvrir
        </Link>,
      ])}
    />
  );
}
