"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { ProfileItem } from "@/lib/api-types";
import { GridFields } from "@/components/app/forms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileUpdateSchema } from "@/lib/validators";

type Values = z.infer<typeof profileUpdateSchema>;

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-rose-700">{message}</p>;
}

export function ProfileForm({ profile }: { profile: ProfileItem }) {
  const [message, setMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      phone: profile.phone,
      pseudonym: profile.pseudonym,
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: Values) {
    setServerError(null);
    setMessage(null);

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = await response.json();
    if (!response.ok) {
      setServerError(payload.error ?? "Mise à jour impossible.");
      return;
    }

    setMessage(`Profil mis à jour pour ${payload.email}.`);
    form.reset({
      phone: payload.phone,
      pseudonym: payload.pseudonym,
      password: "",
      confirmPassword: "",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mon profil</CardTitle>
        <CardDescription>
          {profile.email} · statut {profile.accountStatus}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <GridFields>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input {...form.register("phone")} placeholder="+213 ..." />
              <ErrorText message={form.formState.errors.phone?.message} />
            </div>
            <div className="space-y-2">
              <Label>Pseudonyme</Label>
              <Input {...form.register("pseudonym")} placeholder="Pseudo public" />
              <ErrorText message={form.formState.errors.pseudonym?.message} />
            </div>
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input type="password" {...form.register("password")} placeholder="Nouveau mot de passe" />
              <ErrorText message={form.formState.errors.password?.message} />
            </div>
            <div className="space-y-2">
              <Label>Confirmation</Label>
              <Input type="password" {...form.register("confirmPassword")} placeholder="Confirmation" />
              <ErrorText message={form.formState.errors.confirmPassword?.message} />
            </div>
          </GridFields>
          {serverError ? <p className="text-sm text-rose-700">{serverError}</p> : null}
          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          <Button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
