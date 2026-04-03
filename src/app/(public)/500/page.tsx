import { BulletList, InfoCard, LinkList } from "@/components/app/blocks";
import { PageShell } from "@/components/app/page-shell";
import { getAuditLogs, getDashboardOverview } from "@/lib/queries";

export default async function ServerErrorPage() {
  const [overview, auditLogs] = await Promise.all([getDashboardOverview(), getAuditLogs()]);

  return (
    <PageShell
      eyebrow="500"
      title="Erreur applicative."
      description="Une erreur inattendue s'est produite cote serveur."
      aside={
        <InfoCard title="Contexte utile" description="La plateforme conserve ses traces et ses indicateurs meme en cas d'erreur.">
          <BulletList
            items={[
              `${overview.notificationsCount} notifications restent historisees en base.`,
              `${auditLogs.length} evenements d'audit recents peuvent aider au diagnostic.`,
              "Le point de sante base de donnees reste disponible pour la supervision.",
            ]}
          />
        </InfoCard>
      }
    >
      <InfoCard title="Actions conseillees" description="Vous pouvez reprendre votre navigation par une section stable du portail.">
        <LinkList
          items={[
            { href: "/", label: "Retourner a l'accueil" },
            { href: "/maintenance", label: "Voir la page maintenance" },
            { href: "/stats", label: "Verifier les statistiques publiques" },
            { href: "/auth/login", label: "Revenir a la connexion" },
          ]}
        />
      </InfoCard>
    </PageShell>
  );
}
