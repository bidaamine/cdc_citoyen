import { AuthRegisterParticipationHero } from "@/components/app/auth-register-participation-hero";
import { RegisterParticipationForm } from "@/components/app/register-participation-form";
import { getSettingGroup } from "@/lib/queries";

export default async function RegisterParticipationPage() {
  const [wilayas, professionalStatuses] = await Promise.all([
    getSettingGroup("wilayas"),
    getSettingGroup("professional-statuses"),
  ]);

  return (
    <>
      <AuthRegisterParticipationHero />
      <RegisterParticipationForm
        wilayaOptions={(wilayas?.rows ?? []).map((row) => ({ value: row.id, label: row.label }))}
        professionalStatusOptions={(professionalStatuses?.rows ?? []).map((row) => ({
          value: row.id,
          label: row.label,
        }))}
      />
    </>
  );
}
