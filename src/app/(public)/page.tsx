import { PublicHomeContent } from "@/components/app/public-home-content";
import { getDashboardOverview, getPublishedReports, getPublicThemes } from "@/lib/queries";

export default async function HomePage() {
  const [overview, themes, reports] = await Promise.all([
    getDashboardOverview(),
    getPublicThemes(),
    getPublishedReports(),
  ]);

  return <PublicHomeContent overview={overview} themes={themes} reports={reports} />;
}
