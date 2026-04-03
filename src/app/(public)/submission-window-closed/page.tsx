import { BulletList, InfoCard } from "@/components/app/blocks";
import { PageShell } from "@/components/app/page-shell";
import { getDashboardOverview, getPublicThemes } from "@/lib/queries";

export default async function SubmissionWindowClosedPage() {
  const [overview, themes] = await Promise.all([getDashboardOverview(), getPublicThemes()]);

  return (
    <PageShell
      eyebrow="Participation"
      title="La fenetre de depot est fermee."
      description="Le depot des themes est ouvert uniquement du 1er janvier au 31 mars de chaque annee."
      aside={
        <InfoCard title="Contexte de la plateforme" description="Quelques reperes utiles pendant la fermeture de la campagne.">
          <BulletList
            items={[
              `${overview.proposalsCount} propositions sont deja suivies dans la plateforme.`,
              `${themes.length} themes publics restent consultables pendant l'intercampagne.`,
              "Les espaces de consultation, statistiques et rapports publics restent accessibles.",
            ]}
          />
        </InfoCard>
      }
    >
      <InfoCard title="Que faire en attendant ?" description="La fermeture du depot n'empeche pas la consultation des travaux deja publies.">
        <BulletList
          items={[
            "Consulter les themes deja ouverts a participation.",
            "Parcourir les rapports publics et les statistiques de la plateforme.",
            "Preparer vos contributions pour la prochaine fenetre annuelle de depot.",
          ]}
        />
      </InfoCard>
    </PageShell>
  );
}
