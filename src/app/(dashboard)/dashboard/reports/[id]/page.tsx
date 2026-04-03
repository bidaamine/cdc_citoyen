import Link from "next/link";
import { notFound } from "next/navigation";

import { BulletList, InfoCard } from "@/components/app/blocks";
import { StatusBadge } from "@/components/app/status-badge";
import { repository } from "@/lib/repository";
import { requireSessionForPage } from "@/lib/session";

export default async function CitizenReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSessionForPage();
  const { id } = await params;
  const report = await repository.getReport(id, session.user.id);

  if (!report) notFound();

  return (
    <div className="space-y-6">
      <InfoCard title={report.subject} description={report.entity}>
        <div className="flex items-center gap-3">
          <StatusBadge value={report.status} />
          <p className="text-sm text-[var(--muted-foreground)]">Accuse: {report.acknowledgement}</p>
        </div>
        {report.linkedProposalId ? (
          <div className="mt-4">
            <Link
              href={`/dashboard/proposals/${report.linkedProposalId}`}
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              {`Voir le theme cree: ${report.linkedProposalId}`}
            </Link>
          </div>
        ) : null}
      </InfoCard>
      <InfoCard title="Contenu du dossier" description="Resume, preuves deposees et historique des notifications.">
        <BulletList
          items={[
            "Resume du dossier",
            "Liste des pieces jointes",
            report.linkedProposalId ? "Lien vers le theme converti" : "Historique des notifications",
          ]}
        />
      </InfoCard>
    </div>
  );
}
