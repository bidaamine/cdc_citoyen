import { DataTableCard } from "@/components/app/data-table-card";
import { TableFilters } from "@/components/app/table-filters";
import { getInternalUsers } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function InternalUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireRole("ADMIN");
  const filters = await searchParams;
  const rows = await getInternalUsers(filters);

  return (
    <DataTableCard
      title="Profils internes"
      description="Creation des profils institutionnels, affectation aux roles et aux chambres."
      columns={["Profil", "Role", "Chambre", "Etat"]}
      toolbar={
        <TableFilters
          q={filters.q}
          status={filters.status}
          qPlaceholder="Rechercher un profil, un role ou une chambre..."
          statusOptions={[
            { label: "Pending", value: "PENDING" },
            { label: "Active", value: "ACTIVE" },
            { label: "Refused", value: "REFUSED" },
            { label: "Blocked", value: "BLOCKED" },
            { label: "Suspended", value: "SUSPENDED" },
          ]}
        />
      }
      emptyMessage="Aucun profil interne ne correspond aux filtres."
      rows={rows.map((row) => [row.name, row.role, row.chamber, row.status])}
    />
  );
}
