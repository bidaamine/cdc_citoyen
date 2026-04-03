import { BulletList, InfoCard, LinkList } from "@/components/app/blocks";
import { PageShell } from "@/components/app/page-shell";
import { getDashboardOverview } from "@/lib/queries";

export default async function ForbiddenPage() {
  const overview = await getDashboardOverview();

  return (
    <PageShell
      eyebrow="403"
      title="Acces refuse."
      description="Vous n'avez pas l'autorisation d'acceder a cette ressource ou votre role actuel ne couvre pas cette zone."
      aside={
        <InfoCard title="Repere plateforme" description="Les restrictions d'acces s'appuient sur les roles et le middleware.">
          <BulletList
            items={[
              `${overview.proposalsCount} propositions sont suivies dans l'application.`,
              `${overview.reportsCount} signalements restent traces dans le circuit interne.`,
              "Les espaces citoyen, president, rapporteur et admin sont distincts.",
            ]}
          />
        </InfoCard>
      }
    >
      <InfoCard title="Ou aller ensuite ?" description="Les sections publiques restent accessibles sans habilitation particuliere.">
        <LinkList
          items={[
            { href: "/", label: "Retourner a l'accueil" },
            { href: "/themes", label: "Consulter les themes publics" },
            { href: "/reports", label: "Consulter les rapports publies" },
            { href: "/auth/login", label: "Se reconnecter avec un autre compte" },
          ]}
        />
      </InfoCard>
    </PageShell>
  );
}
