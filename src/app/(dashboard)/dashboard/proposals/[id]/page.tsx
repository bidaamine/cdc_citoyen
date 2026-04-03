import { notFound } from "next/navigation";

import { BulletList, InfoCard } from "@/components/app/blocks";
import { StatusBadge } from "@/components/app/status-badge";
import { getUserNotifications } from "@/lib/queries";
import { repository } from "@/lib/repository";
import { requireSessionForPage } from "@/lib/session";

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSessionForPage();
  const { id } = await params;
  const proposal = await repository.getProposal(id, session.user.id);
  const notifications = await getUserNotifications(session.user.id);

  if (!proposal) notFound();

  return (
    <div className="space-y-6">
      <InfoCard title={proposal.title} description={`Catégorie ${proposal.category} · Exercice ${proposal.exercise}`}>
        <StatusBadge value={proposal.status} />
      </InfoCard>
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Journal de statut" description="Historique métier prévu pour la traçabilité.">
          <BulletList items={["RECU", "EN_COURS_ANALYSE", "Transmission au rapporteur général", "Décision finale"]} />
        </InfoCard>
        <InfoCard title="Notifications reçues" description="Dernières notifications liées à ce dossier.">
          <BulletList items={notifications.map((item) => item.title)} />
        </InfoCard>
      </div>
    </div>
  );
}
