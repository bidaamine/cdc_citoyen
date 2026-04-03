import Link from "next/link";
import { notFound } from "next/navigation";

import { BulletList, InfoCard } from "@/components/app/blocks";
import { StatusActionForm } from "@/components/app/status-action-form";
import { repository } from "@/lib/repository";
import { requireRole } from "@/lib/session";

export default async function PresidentReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole("PRESIDENT");
  const { id } = await params;
  const report = await repository.getReportForPresident(id, session.user.id);
  if (!report) notFound();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <InfoCard title={report.subject} description="Traitement president pour signalement.">
        <BulletList
          items={[
            "Prendre en charge le dossier de signalement",
            "Rejeter avec motif trace",
            "Convertir en theme lorsque le dossier releve d'un axe de suivi",
            report.linkedProposalId ? `Theme genere: ${report.linkedProposalId}` : "Aucun theme converti pour le moment",
          ]}
        />
        {report.linkedProposalId ? (
          <div className="mt-4">
            <Link
              href={`/backoffice/president/proposals/${report.linkedProposalId}`}
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              {`Ouvrir le theme cree: ${report.linkedProposalId}`}
            </Link>
          </div>
        ) : null}
      </InfoCard>
      <InfoCard title="Decision" description="Workflow de traitement du signalement.">
        <div className="space-y-6">
          <StatusActionForm
            endpoint={`/api/reports/${report.id}`}
            label="Prise en charge"
            initialStatus="NON_TRAITE"
            options={[{ label: "NON_TRAITE", value: "NON_TRAITE" }]}
            submitLabel="Marquer en traitement"
            noteLabel="Note interne"
            notePlaceholder="Ex: dossier ouvert pour analyse president"
          />
          <StatusActionForm
            endpoint={`/api/reports/${report.id}`}
            label="Rejet du signalement"
            initialStatus="REJETE"
            options={[{ label: "REJETE", value: "REJETE" }]}
            submitLabel="Rejeter"
            noteLabel="Motif du rejet"
            notePlaceholder="Ex: elements insuffisants pour instruire le dossier"
          />
          <StatusActionForm
            endpoint={`/api/reports/${report.id}`}
            label="Conversion en theme"
            initialStatus="CONVERTI_EN_THEME"
            options={[{ label: "CONVERTI_EN_THEME", value: "CONVERTI_EN_THEME" }]}
            payload={{ workflowAction: "CONVERT_TO_THEME" }}
            submitLabel="Convertir en theme"
            noteLabel="Justification"
            notePlaceholder="Ex: signalement rattache a un theme de controle recurrent"
          />
        </div>
      </InfoCard>
    </div>
  );
}
