import { AuthRegisterReportingHero } from "@/components/app/auth-register-reporting-hero";
import { RegisterReportingForm } from "@/components/app/register-reporting-form";
import { getSettingGroup } from "@/lib/queries";

export default async function RegisterReportingPage() {
  const [wilayas, professionalStatuses] = await Promise.all([
    getSettingGroup("wilayas"),
    getSettingGroup("professional-statuses"),
  ]);

  return (
    <>
      <AuthRegisterReportingHero />
      <RegisterReportingForm
        wilayaOptions={(wilayas?.rows ?? []).map((row) => ({ value: row.id, label: row.label }))}
        professionalStatusOptions={(professionalStatuses?.rows ?? []).map((row) => ({
          value: row.id,
          label: row.label,
        }))}
      />
    </>
  );
}
