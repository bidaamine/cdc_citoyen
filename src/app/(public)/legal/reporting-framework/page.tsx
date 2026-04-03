import { BulletList, InfoCard } from "@/components/app/blocks";
import { PageShell } from "@/components/app/page-shell";
import { getDashboardOverview, getSettingGroup } from "@/lib/queries";

export default async function ReportingFrameworkPage() {
  const [overview, reportCategories] = await Promise.all([
    getDashboardOverview(),
    getSettingGroup("report-categories"),
  ]);

  return (
    <PageShell
      eyebrow="Cadre legal"
      title="Textes de reference pour le module signalement."
      description="La page centralise les references reglementaires, les obligations des declarants et les garanties de confidentialite."
    >
      <InfoCard title="Contenu attendu" description="Page documentaire enrichie par le contexte reel de la plateforme.">
        <BulletList
          items={[
            "Textes regissant la procedure de signalement.",
            `Signalements actuellement enregistres: ${overview.reportsCount}.`,
            `Categories de signalement actives: ${reportCategories?.rows.length ?? 0}.`,
            "Mentions relatives a la responsabilite en cas de fausse declaration.",
          ]}
        />
      </InfoCard>
    </PageShell>
  );
}
