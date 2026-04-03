import { BulletList, InfoCard, LinkList } from "@/components/app/blocks";
import { PageShell } from "@/components/app/page-shell";
import { getPublishedReports, getPublicThemes } from "@/lib/queries";

export default async function NotFoundScreen() {
  const [themes, reports] = await Promise.all([getPublicThemes(), getPublishedReports()]);

  return (
    <PageShell
      eyebrow="404"
      title="Page introuvable."
      description="La ressource demandee n'existe pas ou a ete deplacee."
      aside={
        <InfoCard title="Contenu disponible" description="Le reste du portail public continue de fonctionner.">
          <BulletList
            items={[
              `${themes.length} themes publics peuvent encore etre consultes.`,
              `${reports.length} rapports publies restent disponibles.`,
              "Les parcours d'inscription et de consultation restent accessibles depuis l'accueil.",
            ]}
          />
        </InfoCard>
      }
    >
      <InfoCard title="Suggestions rapides" description="Quelques destinations utiles pour reprendre la navigation.">
        <LinkList
          items={[
            { href: "/", label: "Retourner a l'accueil" },
            { href: "/participation", label: "Voir le module participation" },
            { href: "/signalement", label: "Voir le module signalement" },
            { href: "/stats", label: "Consulter les statistiques publiques" },
          ]}
        />
      </InfoCard>
    </PageShell>
  );
}
