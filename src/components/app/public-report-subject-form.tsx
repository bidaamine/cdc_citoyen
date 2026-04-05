"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PublicReportSubjectForm({
  categoryOptions,
  exerciseYear,
}: {
  categoryOptions: string[];
  exerciseYear: number;
}) {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setStatusMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      titleFr: String(formData.get("titleFr") ?? ""),
      titleAr: String(formData.get("titleAr") ?? ""),
      descriptionFr: String(formData.get("descriptionFr") ?? ""),
      descriptionAr: String(formData.get("descriptionAr") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
      exerciseYear,
    };

    try {
      const response = await fetch("/api/report-subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.status === 401) {
        setStatusMessage("Connectez-vous pour proposer un sujet de rapport.");
        return;
      }

      if (!response.ok) {
        setStatusMessage(result.error ?? "Impossible d'enregistrer le sujet.");
        return;
      }

      event.currentTarget.reset();
      setStatusMessage(`Sujet de rapport propose avec succes: ${result.id}`);
      router.refresh();
    } catch {
      setStatusMessage("Une erreur est survenue pendant la soumission.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposer un sujet de rapport</CardTitle>
        <CardDescription>Les citoyens peuvent suggérer des sujets d'investigation distincts du module confidentiel de signalement.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="report-subject-title-fr">Titre FR</Label>
            <Input id="report-subject-title-fr" name="titleFr" required minLength={5} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-subject-title-ar">Titre AR</Label>
            <Input id="report-subject-title-ar" name="titleAr" required minLength={5} className="font-ar" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="report-subject-description-fr">Description FR</Label>
            <Textarea id="report-subject-description-fr" name="descriptionFr" required minLength={40} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="report-subject-description-ar">Description AR</Label>
            <Textarea
              id="report-subject-description-ar"
              name="descriptionAr"
              required
              minLength={40}
              className="font-ar"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-subject-category">Categorie</Label>
            <select
              id="report-subject-category"
              name="categoryId"
              required
              className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <option value="">Choisir une categorie</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-subject-exercise">Exercice</Label>
            <Input id="report-subject-exercise" value={exerciseYear} readOnly />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Soumission..." : "Soumettre le sujet"}
            </Button>
            {statusMessage ? <p className="text-sm text-[var(--muted-foreground)]">{statusMessage}</p> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
