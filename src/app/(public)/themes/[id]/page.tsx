import { notFound } from "next/navigation";

import { BulletList, InfoCard } from "@/components/app/blocks";
import { PageShell } from "@/components/app/page-shell";
import { StatusBadge } from "@/components/app/status-badge";
import { getPublicTheme } from "@/lib/queries";

export default async function ThemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proposal = await getPublicTheme(id);

  if (!proposal) {
    notFound();
  }

  return (
    <PageShell
      eyebrow="Detail theme"
      title={proposal.title}
      description="Fiche publique bilingue avec metadonnees, contenu et engagement citoyen."
      aside={
        <InfoCard title="Metadonnees" description="Donnees alimentees par la base.">
          <div className="space-y-3 text-sm">
            <p>Categorie: {proposal.category}</p>
            <p>Exercice: {proposal.exercise}</p>
            <p>Actualise le: {proposal.updatedAt}</p>
            <p>{`${proposal.likes} likes · ${proposal.comments} commentaires`}</p>
            <StatusBadge value={proposal.status} />
          </div>
        </InfoCard>
      }
    >
      <InfoCard title="Description FR" description="Version francaise en base.">
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">{proposal.descriptionFr}</p>
      </InfoCard>
      <InfoCard title="Description AR" description="Version arabe en base.">
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">{proposal.descriptionAr}</p>
      </InfoCard>
      <InfoCard title="Interactions" description="Etat public du theme sur la plateforme.">
        <BulletList
          items={[
            `Likes recenses: ${proposal.likes}`,
            `Commentaires recenses: ${proposal.comments}`,
            `Statut courant: ${proposal.status}`,
          ]}
        />
      </InfoCard>
    </PageShell>
  );
}
