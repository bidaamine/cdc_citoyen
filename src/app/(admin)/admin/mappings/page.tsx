import { DataTableCard } from "@/components/app/data-table-card";
import { getMappings } from "@/lib/queries";

export default async function MappingsPage() {
  const rows = await getMappings();

  return (
    <DataTableCard
      title="Matrices d'affectation"
      description="Catégories, administrations centrales et collectivités locales vers chambres."
      columns={["Référentiel", "Valeur", "Chambre affectée"]}
      rows={rows.map((row) => [row.source, row.value, row.chamber])}
    />
  );
}
