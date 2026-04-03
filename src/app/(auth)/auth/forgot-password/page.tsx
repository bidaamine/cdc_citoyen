import { Field, FormSection } from "@/components/app/forms";

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">Mot de passe oublié</p>
        <h1 className="text-4xl font-semibold tracking-tight">Envoyer un lien de réinitialisation.</h1>
      </div>
      <FormSection title="Demande de réinitialisation" description="Flux préparé pour e-mail transactionnel." cta="Envoyer le lien">
        <Field label="Email" placeholder="email@exemple.dz" />
      </FormSection>
    </>
  );
}
