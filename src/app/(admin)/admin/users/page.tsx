import Link from "next/link";

import { DataTableCard } from "@/components/app/data-table-card";
import { StatusBadge } from "@/components/app/status-badge";
import { TableFilters } from "@/components/app/table-filters";
import { getAdminUsers } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireRole("ADMIN");
  const filters = await searchParams;
  const rows = await getAdminUsers(filters);

  return (
    <DataTableCard
      title="Comptes citoyens"
      description="Recherche, validation, blocage, activation et historique."
      columns={["Compte", "Type", "Statut", "Action"]}
      toolbar={
        <TableFilters
          q={filters.q}
          status={filters.status}
          qPlaceholder="Rechercher un compte, un email ou un pseudonyme..."
          statusOptions={[
            { label: "Pending", value: "PENDING" },
            { label: "Active", value: "ACTIVE" },
            { label: "Refused", value: "REFUSED" },
            { label: "Blocked", value: "BLOCKED" },
            { label: "Suspended", value: "SUSPENDED" },
          ]}
        />
      }
      emptyMessage="Aucun compte ne correspond aux filtres."
      rows={rows.map((row) => [
        row.name,
        row.userType,
        <StatusBadge key={`${row.id}-status`} value={row.status} />,
        <Link key={`${row.id}-action`} href={`/admin/users/${row.id}`} className="font-semibold hover:underline">
          Consulter
        </Link>,
      ])}
    />
  );
}
