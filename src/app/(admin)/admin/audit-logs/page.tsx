import { DataTableCard } from "@/components/app/data-table-card";
import { TableFilters } from "@/components/app/table-filters";
import { getAuditLogs } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; action?: string }>;
}) {
  await requireRole("ADMIN");
  const filters = await searchParams;
  const rows = await getAuditLogs(filters);

  return (
    <DataTableCard
      title="Journaux d'audit"
      description="Filtrage par acteur, date, action et ressource."
      columns={["Date", "Acteur", "Action", "Ressource"]}
      toolbar={
        <TableFilters
          q={filters.q}
          action={filters.action}
          qPlaceholder="Rechercher un acteur, une action ou une ressource..."
          actionOptions={[
            { label: "Block account", value: "BLOCK_ACCOUNT" },
            { label: "Read report", value: "READ_REPORT" },
            { label: "Update report status", value: "UPDATE_REPORT_STATUS" },
            { label: "Update proposal status", value: "UPDATE_PROPOSAL_STATUS" },
          ]}
        />
      }
      emptyMessage="Aucun evenement d'audit ne correspond aux filtres."
      rows={rows.map((row) => [row.date, row.actor, row.action, row.resource])}
    />
  );
}
