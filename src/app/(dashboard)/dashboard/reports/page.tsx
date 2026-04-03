import Link from "next/link";

import { DataTableCard } from "@/components/app/data-table-card";
import { StatusBadge } from "@/components/app/status-badge";
import { getCitizenReports } from "@/lib/queries";
import { requireSessionForPage } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export default async function CitizenReportsPage() {
  const session = await requireSessionForPage();
  const reportRows = await getCitizenReports(session.user.id);

  return (
    <DataTableCard
      title="Mes signalements"
      description="Historique des dossiers avec accusé de réception et statut."
      columns={["Objet", "Entité", "Statut", "Accusé", "Mise à jour"]}
      rows={reportRows.map((row) => [
        <Link key={`${row.id}-link`} href={`/dashboard/reports/${row.id}`} className="font-semibold hover:underline">
          {row.subject}
        </Link>,
        row.entity,
        <StatusBadge key={`${row.id}-status`} value={row.status} />,
        row.acknowledgement,
        formatDate(row.updatedAt),
      ])}
    />
  );
}
