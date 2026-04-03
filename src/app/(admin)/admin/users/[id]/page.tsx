import { BulletList, InfoCard } from "@/components/app/blocks";
import { StatusActionForm } from "@/components/app/status-action-form";
import { getAdminUser } from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAdminUser(id);
  if (!user) notFound();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <InfoCard title={`Fiche compte ${user.name}`} description="Identité réelle, pseudonyme, statut et historique de validation.">
        <BulletList items={["Approuver / refuser", "Bloquer / débloquer", "Consigner le motif", "Consulter les documents"]} />
      </InfoCard>
      <InfoCard title="Traçabilité" description="Chaque action d'administration est destinée à être auditée.">
        <div className="space-y-4">
          <div className="rounded-2xl bg-[var(--muted)]/70 px-4 py-3 text-sm text-[var(--muted-foreground)]">
            {user.email} · {user.pseudonym}
          </div>
          <StatusActionForm
            endpoint={`/api/users/${user.id}`}
            label="Statut du compte"
            initialStatus={user.status}
          />
        </div>
      </InfoCard>
    </div>
  );
}
