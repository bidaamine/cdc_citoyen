import { notFound } from "next/navigation";

import { BulletList, InfoCard } from "@/components/app/blocks";
import { StatusActionForm } from "@/components/app/status-action-form";
import { repository } from "@/lib/repository";
import { requireRole } from "@/lib/session";

export default async function RapporteurProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole("RAPPORTEUR_GENERAL");
  const { id } = await params;
  const proposal = await repository.getProposalForRapporteur(id, session.user.id);

  if (!proposal) notFound();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <InfoCard title={proposal.title} description="Arbitrage final du rapporteur general.">
        <BulletList
          items={[
            "Valider la proposition pour integration au plan d'action",
            "Rejeter le dossier avec tracabilite",
            "Marquer NON_ACTUALISEE pour les sujets depasses",
            "Horodater et attribuer chaque decision finale",
          ]}
        />
      </InfoCard>
      <InfoCard title="Decision finale" description="Mise a jour du statut apres revue du rapporteur general.">
        <StatusActionForm
          endpoint={`/api/proposals/${proposal.id}`}
          label="Statut final"
          initialStatus={proposal.status}
          options={[
            { label: "ACCEPTEE", value: "ACCEPTEE" },
            { label: "REJETEE", value: "REJETEE" },
            { label: "NON_ACTUALISEE", value: "NON_ACTUALISEE" },
          ]}
          submitLabel="Enregistrer la decision"
          noteLabel="Motif"
          notePlaceholder="Ex: retenue pour le plan d'action 2027"
        />
      </InfoCard>
    </div>
  );
}
