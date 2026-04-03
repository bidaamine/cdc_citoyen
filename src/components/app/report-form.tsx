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
import { uploadPolicy } from "@/lib/uploads";
import { reportSchema } from "@/lib/validators";

type ReportFormValues = z.infer<typeof reportSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-rose-700">{message}</p>;
}

export function ReportForm() {
  const [submittedInfo, setSubmittedInfo] = useState<{
    id: string;
    acknowledgement: string;
  } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      subject: "",
      targetEntityName: "",
      targetEntityType: "CENTRAL",
      address: "",
      relationToEntity: "",
      circumstance: "",
      factsLocation: "",
      factsPeriodicity: "",
      irregularityDescription: "",
      reportCategoryId: "",
    },
  });

  async function onSubmit(values: ReportFormValues) {
    setServerError(null);
    setSubmittedInfo(null);

    const response = await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = await response.json();

    if (!response.ok) {
      setServerError(payload.error ?? "Impossible d'enregistrer le signalement.");
      return;
    }

    setSubmittedInfo({
      id: payload.id,
      acknowledgement: payload.acknowledgement,
    });
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouveau signalement</CardTitle>
        <CardDescription>
          Dépôt détaillé avec validation, accusé de réception et contraintes d&apos;upload.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-3xl bg-[var(--muted)]/70 px-4 py-3 text-sm text-[var(--muted-foreground)]">
          Limites de pièces jointes prévues: {uploadPolicy.reportMaxFileSizeMb} Mo par fichier,{" "}
          {uploadPolicy.reportMaxTotalSizeMb} Mo au total.
        </div>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <GridFields>
            <div className="space-y-2">
              <Label htmlFor="subject">Objet</Label>
              <Input id="subject" placeholder="Objet du signalement" {...form.register("subject")} />
              <FieldError message={form.formState.errors.subject?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetEntityName">Entité concernée</Label>
              <Input id="targetEntityName" placeholder="Nom de l&apos;entité" {...form.register("targetEntityName")} />
              <FieldError message={form.formState.errors.targetEntityName?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetEntityType">Nature de l&apos;entité</Label>
              <Input id="targetEntityType" placeholder="CENTRAL ou LOCAL" {...form.register("targetEntityType")} />
              <FieldError message={form.formState.errors.targetEntityType?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" placeholder="Adresse" {...form.register("address")} />
              <FieldError message={form.formState.errors.address?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationToEntity">Poste / relation</Label>
              <Input
                id="relationToEntity"
                placeholder="Votre relation avec l'entité"
                {...form.register("relationToEntity")}
              />
              <FieldError message={form.formState.errors.relationToEntity?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="circumstance">Circonstance</Label>
              <Input id="circumstance" placeholder="Circonstance" {...form.register("circumstance")} />
              <FieldError message={form.formState.errors.circumstance?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="factsLocation">Localisation</Label>
              <Input id="factsLocation" placeholder="Lieu des faits" {...form.register("factsLocation")} />
              <FieldError message={form.formState.errors.factsLocation?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="factsPeriodicity">Périodicité</Label>
              <Input id="factsPeriodicity" placeholder="Périodicité" {...form.register("factsPeriodicity")} />
              <FieldError message={form.formState.errors.factsPeriodicity?.message} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="irregularityDescription">Description détaillée</Label>
              <Textarea
                id="irregularityDescription"
                placeholder="Décrire l'irrégularité"
                {...form.register("irregularityDescription")}
              />
              <FieldError message={form.formState.errors.irregularityDescription?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportCategoryId">Catégorie</Label>
              <Input id="reportCategoryId" placeholder="Ex: Financier" {...form.register("reportCategoryId")} />
              <FieldError message={form.formState.errors.reportCategoryId?.message} />
            </div>
          </GridFields>

          {serverError ? <p className="text-sm text-rose-700">{serverError}</p> : null}
          {submittedInfo ? (
            <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Signalement enregistré. Dossier: {submittedInfo.id} · Accusé: {submittedInfo.acknowledgement}
            </div>
          ) : null}

          <Button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Dépôt..." : "Déposer le signalement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
