import { BulletList, InfoCard } from "@/components/app/blocks";
import { PageShell } from "@/components/app/page-shell";
import { getAuditLogs, getDashboardOverview } from "@/lib/queries";

export default async function MaintenancePage() {
  const [overview, auditLogs] = await Promise.all([getDashboardOverview(), getAuditLogs()]);

  return (
    <PageShell
      eyebrow="Maintenance"
      title="Plateforme temporairement indisponible."
      description="Une fenetre de maintenance est en cours. Merci de reessayer plus tard."
      aside={
        <InfoCard title="Etat connu" description="Indicateurs utiles pour le support et l'exploitation.">
          <BulletList
            items={[
              `${overview.proposalsCount} propositions restent enregistrees dans la base.`,
              `${overview.reportsCount} signalements restent traces pendant l'interruption.`,
              `${overview.notificationsCount} notifications sont historisees.`,
              `${auditLogs.length} evenements d'audit recents restent consultables cote administration.`,
            ]}
          />
        </InfoCard>
      }
    >
      <InfoCard title="Pendant l'interruption" description="Les donnees restent preservees et les traitements reprendront apres la fenetre technique.">
        <BulletList
          items={[
            "Aucune action supplementaire n'est requise de votre part.",
            "Les dossiers deja enregistres restent conserves en base.",
            "Le support peut verifier l'etat de la connexion via l'endpoint de sante de la base.",
          ]}
        />
      </InfoCard>
    </PageShell>
  );
}
