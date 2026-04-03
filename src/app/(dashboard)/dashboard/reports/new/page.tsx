import { BulletList, InfoCard } from "@/components/app/blocks";
import { ReportForm } from "@/components/app/report-form";

export default function NewReportPage() {
  return (
    <div className="space-y-6">
      <InfoCard title="Préambule juridique" description="Étape obligatoire avant dépôt du signalement.">
        <BulletList
          items={[
            "Lecture et acceptation de l'avertissement juridique.",
            "Lien vers le cadre légal et l'engagement de confidentialité.",
            "Pièces jointes obligatoires et journalisées.",
          ]}
        />
      </InfoCard>
      <ReportForm />
    </div>
  );
}
