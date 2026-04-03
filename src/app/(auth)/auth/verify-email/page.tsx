import { InfoCard } from "@/components/app/blocks";

export default function VerifyEmailPage() {
  return (
    <>
      <div className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">Validation e-mail</p>
        <h1 className="text-4xl font-semibold tracking-tight">Confirmer l&apos;adresse avant activation.</h1>
      </div>
      <InfoCard title="Email de vérification" description="Cette étape sera branchée à l'envoi transactionnel et au statut du compte." />
    </>
  );
}
