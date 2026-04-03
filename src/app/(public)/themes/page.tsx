import { PublicThemesContent } from "@/components/app/public-themes-content";
import { getPublicThemes } from "@/lib/queries";

export default async function ThemesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; category?: string; exercise?: string }>;
}) {
  const filters = await searchParams;
  const [themes, allThemes] = await Promise.all([getPublicThemes(filters), getPublicThemes()]);
  const categoryOptions = [...new Set(allThemes.map((row) => row.category))].sort();
  const exerciseOptions = [...new Set(allThemes.map((row) => String(row.exercise)))].sort();

  return (
    <PublicThemesContent
      themes={themes}
      filters={filters}
      categoryOptions={categoryOptions}
      exerciseOptions={exerciseOptions}
    />
  );
}
