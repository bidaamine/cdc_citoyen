import Link from "next/link";

import { DataTableCard } from "@/components/app/data-table-card";
import { StatusBadge } from "@/components/app/status-badge";
import { getCitizenProposals } from "@/lib/queries";
import { requireSessionForPage } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export default async function ProposalsPage() {
  const session = await requireSessionForPage();
  const proposalRows = await getCitizenProposals(session.user.id);

  return (
    <DataTableCard
      title="Mes propositions"
      description="Historique complet des propositions déposées avec exercice, statut et dernière mise à jour."
      columns={["Titre", "Catégorie", "Exercice", "Statut", "Dernière mise à jour"]}
      rows={proposalRows.map((row) => [
        <Link key={`${row.id}-link`} href={`/dashboard/proposals/${row.id}`} className="font-semibold hover:underline">
          {row.title}
        </Link>,
        row.category,
        String(row.exercise),
        <StatusBadge key={`${row.id}-status`} value={row.status} />,
        formatDate(row.updatedAt),
      ])}
    />
  );
}
