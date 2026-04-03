import { InfoCard } from "@/components/app/blocks";
import { ProposalForm } from "@/components/app/proposal-form";
import { nextExerciseYear, submissionWindowOpen } from "@/lib/utils";

export default function NewProposalPage() {
  const windowOpen = submissionWindowOpen(new Date("2026-03-30"));

  return (
    <div className="space-y-6">
      <InfoCard
        title={windowOpen ? "Fenêtre ouverte" : "Fenêtre fermée"}
        description={`L'exercice cible est automatiquement fixé à ${nextExerciseYear(new Date("2026-03-30"))}.`}
      />
      <ProposalForm exerciseYear={nextExerciseYear(new Date("2026-03-30"))} />
    </div>
  );
}
