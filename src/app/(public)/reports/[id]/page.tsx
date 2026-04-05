import { notFound } from "next/navigation";

import { BulletList, InfoCard } from "@/components/app/blocks";
import { PageShell } from "@/components/app/page-shell";
import { SuggestionEngagement } from "@/components/app/suggestion-engagement";
import { StatusBadge } from "@/components/app/status-badge";
import { getReportSubject } from "@/lib/queries";
import { getCurrentUserId } from "@/lib/session";

export default async function ReportSubjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  const subject = await getReportSubject(id, userId);

  if (!subject) {
    notFound();
  }

  return (
    <PageShell
      eyebrow="Detail sujet de rapport"
      title={subject.title}
      description="Fiche publique de suggestion de sujet de rapport avec soutien citoyen."
      aside={
        <InfoCard title="Metadonnees" description="Donnees alimentees par la base.">
          <div className="space-y-3 text-sm">
            <p>Categorie: {subject.category}</p>
            <p>Exercice: {subject.exercise}</p>
            <p>Actualise le: {subject.updatedAt}</p>
            <p>{`${subject.likes} likes · ${subject.comments} commentaires`}</p>
            <StatusBadge value={subject.status} />
          </div>
        </InfoCard>
      }
    >
      <InfoCard title="Description FR" description="Version francaise en base.">
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">{subject.descriptionFr}</p>
      </InfoCard>
      <InfoCard title="Description AR" description="Version arabe en base.">
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">{subject.descriptionAr}</p>
      </InfoCard>
      <InfoCard title="Interactions" description="Etat public de la suggestion sur la plateforme.">
        <BulletList items={[`Likes recenses: ${subject.likes}`, `Commentaires recenses: ${subject.comments}`, `Statut courant: ${subject.status}`]} />
      </InfoCard>
      <InfoCard title="Discussion citoyenne" description="Les citoyens peuvent soutenir et commenter publiquement ce sujet.">
        <SuggestionEngagement
          endpointBase={`/api/report-subjects/${subject.id}`}
          initialLikes={subject.likes}
          initialComments={subject.comments}
          initialViewerHasLiked={subject.viewerHasLiked}
          initialDiscussion={subject.discussion}
        />
      </InfoCard>
    </PageShell>
  );
}
