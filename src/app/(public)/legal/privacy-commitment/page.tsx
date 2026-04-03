import { BulletList, InfoCard } from "@/components/app/blocks";
import { PageShell } from "@/components/app/page-shell";
import { getDashboardOverview, getAuditLogs } from "@/lib/queries";

export default async function PrivacyCommitmentPage() {
  const [overview, auditLogs] = await Promise.all([getDashboardOverview(), getAuditLogs()]);

  return (
    <PageShell
      eyebrow="Confidentialite"
      title="Engagement de confidentialite de la Cour des comptes."
      description="Le document pourra etre affiche, telecharge et rappele depuis le preambule du parcours signalement."
    >
      <InfoCard title="Garanties annoncees" description="Les engagements sont relies aux mecanismes reels du systeme.">
        <BulletList
          items={[
            "Conservation securisee des identites et pieces jointes.",
            `Centre de notifications actif: ${overview.notificationsCount} notifications enregistrees.`,
            `Trace d'audit disponible: ${auditLogs.length} evenements recents consultables.`,
            "Acces reserve aux profils habilites et journalises.",
          ]}
        />
      </InfoCard>
    </PageShell>
  );
}
