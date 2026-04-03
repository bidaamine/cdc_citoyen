import { BulletList, InfoCard } from "@/components/app/blocks";
import { PageShell } from "@/components/app/page-shell";
import { getAuditLogs, getDashboardOverview } from "@/lib/queries";

export default async function AccountBlockedPage() {
  const [overview, auditLogs] = await Promise.all([getDashboardOverview(), getAuditLogs()]);

  return (
    <PageShell
      eyebrow="Compte bloque"
      title="Votre compte est actuellement suspendu."
      description="Cette page peut desormais s'appuyer sur le contexte reel de la plateforme en attendant le branchement du motif individuel."
      aside={
        <InfoCard title="Rappels utiles" description="Le blocage s'inscrit dans un dispositif trace et journalise.">
          <BulletList
            items={[
              `${overview.notificationsCount} notifications ont deja ete envoyees sur la plateforme.`,
              `${auditLogs.length} evenements d'audit recents alimentent la tracabilite des actions sensibles.`,
              "Les comptes peuvent etre reactives par les profils internes habilites.",
            ]}
          />
        </InfoCard>
      }
    >
      <InfoCard title="Etapes suivantes" description="Le motif individuel reste a brancher, mais le parcours utilisateur est deja pret.">
        <BulletList
          items={[
            "Contacter l'administration ou le support habilite.",
            "Verifier vos notifications et l'e-mail associe au compte.",
            "Patienter jusqu'a la levee du blocage si un controle est en cours.",
          ]}
        />
      </InfoCard>
    </PageShell>
  );
}
