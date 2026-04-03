import { Field, FormSection, GridFields } from "@/components/app/forms";

export default function ResetPasswordPage() {
  return (
    <>
      <div className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">Réinitialisation</p>
        <h1 className="text-4xl font-semibold tracking-tight">Choisir un nouveau mot de passe.</h1>
      </div>
      <FormSection title="Nouveau mot de passe" description="Cette page finalisera le reset via jeton sécurisé." cta="Mettre à jour">
        <GridFields>
          <Field label="Nouveau mot de passe" placeholder="Mot de passe" />
          <Field label="Confirmation" placeholder="Confirmation" />
        </GridFields>
      </FormSection>
    </>
  );
}
