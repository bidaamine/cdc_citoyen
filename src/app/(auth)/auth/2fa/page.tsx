import { Field, FormSection } from "@/components/app/forms";

export default function TwoFactorPage() {
  return (
    <>
      <div className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">2FA</p>
        <h1 className="text-4xl font-semibold tracking-tight">Deuxième facteur pour les comptes sensibles.</h1>
      </div>
      <FormSection title="Code temporaire" description="Écran de vérification 2FA prévu par le CDC." cta="Vérifier">
        <Field label="Code" placeholder="000000" />
      </FormSection>
    </>
  );
}
