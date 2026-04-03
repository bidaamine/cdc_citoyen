"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { GridFields } from "@/components/app/forms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { proposalSchema } from "@/lib/validators";

type ProposalFormValues = z.infer<typeof proposalSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-rose-700">{message}</p>;
}

export function ProposalForm({ exerciseYear }: { exerciseYear: number }) {
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      titleFr: "",
      titleAr: "",
      descriptionFr: "",
      descriptionAr: "",
      categoryId: "",
      exerciseYear,
    },
  });

  async function onSubmit(values: ProposalFormValues) {
    setServerError(null);
    setSubmittedId(null);

    const response = await fetch("/api/proposals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = await response.json();

    if (!response.ok) {
      setServerError(payload.error ?? "Impossible d'enregistrer la proposition.");
      return;
    }

    setSubmittedId(payload.id);
    form.reset({
      titleFr: "",
      titleAr: "",
      descriptionFr: "",
      descriptionAr: "",
      categoryId: "",
      exerciseYear,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle proposition</CardTitle>
        <CardDescription>
          Formulaire bilingue FR/AR avec exercice n+1, validation Zod et dépôt via API.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <GridFields>
            <div className="space-y-2">
              <Label htmlFor="titleFr">Titre FR</Label>
              <Input id="titleFr" placeholder="Titre en français" {...form.register("titleFr")} />
              <FieldError message={form.formState.errors.titleFr?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleAr">Titre AR</Label>
              <Input id="titleAr" className="font-ar" placeholder="العنوان بالعربية" {...form.register("titleAr")} />
              <FieldError message={form.formState.errors.titleAr?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionFr">Description FR</Label>
              <Textarea id="descriptionFr" placeholder="Description détaillée" {...form.register("descriptionFr")} />
              <FieldError message={form.formState.errors.descriptionFr?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionAr">Description AR</Label>
              <Textarea
                id="descriptionAr"
                className="font-ar"
                placeholder="الوصف التفصيلي"
                {...form.register("descriptionAr")}
              />
              <FieldError message={form.formState.errors.descriptionAr?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Catégorie</Label>
              <Input id="categoryId" placeholder="Ex: Santé publique" {...form.register("categoryId")} />
              <FieldError message={form.formState.errors.categoryId?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exerciseYear">Exercice</Label>
              <Input id="exerciseYear" readOnly {...form.register("exerciseYear", { valueAsNumber: true })} />
              <FieldError message={form.formState.errors.exerciseYear?.message} />
            </div>
          </GridFields>

          {serverError ? <p className="text-sm text-rose-700">{serverError}</p> : null}
          {submittedId ? (
            <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Proposition enregistrée avec succès. Dossier créé: {submittedId}
            </div>
          ) : null}

          <Button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Soumission..." : "Soumettre la proposition"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
