import { notFound } from "next/navigation";

import { BulletList, InfoCard } from "@/components/app/blocks";
import { StatusActionForm } from "@/components/app/status-action-form";
import { repository } from "@/lib/repository";
import { requireRole } from "@/lib/session";

export default async function PresidentProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole("PRESIDENT");
  const { id } = await params;
  const proposal = await repository.getProposalForPresident(id, session.user.id);
  if (!proposal) notFound();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <InfoCard title={proposal.title} description="Traitement president de chambre.">
        <BulletList
          items={[
            "Prendre en charge le dossier avec EN_COURS_ANALYSE",
            "Transmettre explicitement au rapporteur general",
            "Conserver une trace des notes de workflow",
            "Limiter la decision finale au rapporteur general",
          ]}
        />
      </InfoCard>
      <InfoCard title="Workflow" description="Affectation, analyse et transmission tracables.">
        <div className="space-y-6">
          <StatusActionForm
            endpoint={`/api/proposals/${proposal.id}`}
            label="Passage en analyse"
            initialStatus="EN_COURS_ANALYSE"
            options={[{ label: "EN_COURS_ANALYSE", value: "EN_COURS_ANALYSE" }]}
            submitLabel="Prendre en charge"
            noteLabel="Note interne"
            notePlaceholder="Ex: dossier affecte pour analyse initiale"
          />
          <StatusActionForm
            endpoint={`/api/proposals/${proposal.id}`}
            label="Transmission au rapporteur"
            initialStatus="EN_COURS_ANALYSE"
            options={[{ label: "Transmettre au rapporteur general", value: "EN_COURS_ANALYSE" }]}
            payload={{ workflowAction: "TRANSMIT_TO_RAPPORTEUR" }}
            submitLabel="Transmettre"
            noteLabel="Motif de transmission"
            notePlaceholder="Ex: dossier pret pour arbitrage final"
          />
        </div>
      </InfoCard>
    </div>
  );
}
