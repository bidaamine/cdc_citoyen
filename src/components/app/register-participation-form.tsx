"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { GridFields } from "@/components/app/forms";
import { useTranslations } from "@/components/app/locale-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMessage } from "@/lib/i18n";
import { participationRegistrationSchema } from "@/lib/validators";

type Values = z.infer<typeof participationRegistrationSchema>;
type Option = { value: string; label: string };

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-rose-700">{message}</p>;
}

function extractServerError(details: unknown) {
  if (!details || typeof details !== "object") return null;

  const typedDetails = details as {
    formErrors?: string[];
    fieldErrors?: Record<string, string[] | undefined>;
  };

  return (
    typedDetails.formErrors?.[0] ??
    Object.values(typedDetails.fieldErrors ?? {}).find((messages) => messages && messages.length > 0)?.[0] ??
    null
  );
}

export function RegisterParticipationForm({
  wilayaOptions,
  professionalStatusOptions,
}: {
  wilayaOptions: Option[];
  professionalStatusOptions: Option[];
}) {
  const t = useTranslations();
  const accountTypeOptions: Option[] = [
    { value: "CITIZEN", label: t.auth.registerParticipationForm.accountCitizen },
    { value: "CIVIL_SOCIETY_ORG", label: t.auth.registerParticipationForm.accountOrg },
  ];
  const ageRangeOptions: Option[] = [
    { value: "UNDER_25", label: t.auth.registerParticipationForm.under25 },
    { value: "FROM_25_TO_34", label: t.auth.registerParticipationForm.from25to34 },
    { value: "FROM_35_TO_44", label: t.auth.registerParticipationForm.from35to44 },
    { value: "FROM_45_TO_59", label: t.auth.registerParticipationForm.from45to59 },
    { value: "ABOVE_60", label: t.auth.registerParticipationForm.above60 },
  ];
  const sexOptions: Option[] = [
    { value: "FEMALE", label: t.auth.registerParticipationForm.female },
    { value: "MALE", label: t.auth.registerParticipationForm.male },
  ];

  const [success, setSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(participationRegistrationSchema),
    defaultValues: {
      accountType: "CITIZEN",
      organizationName: "",
      firstName: "",
      lastName: "",
      email: "",
      pseudonym: "",
      wilayaId: wilayaOptions[0]?.value ?? "",
      professionalStatusId: professionalStatusOptions[0]?.value ?? "",
      ageRange: "FROM_25_TO_34",
      sex: "FEMALE",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: Values) {
    setServerError(null);
    setSuccess(null);

    const response = await fetch("/api/auth/register/participation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = await response.json();

    if (!response.ok) {
      setServerError(extractServerError(payload.details) ?? payload.error ?? t.auth.registerParticipationForm.genericError);
      return;
    }

    setSuccess(
      formatMessage(t.auth.registerParticipationForm.success, {
        email: payload.email,
        status: payload.accountStatus,
      }),
    );
    form.reset({
      ...form.getValues(),
      firstName: "",
      lastName: "",
      email: "",
      pseudonym: "",
      organizationName: "",
      password: "",
      confirmPassword: "",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.auth.registerParticipationForm.title}</CardTitle>
        <CardDescription>{t.auth.registerParticipationForm.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <GridFields>
            <div className="space-y-2">
              <Label>{t.auth.registerParticipationForm.accountType}</Label>
              <select {...form.register("accountType")} className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
                {accountTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorText message={form.formState.errors.accountType?.message} />
            </div>
            <div className="space-y-2">
              <Label>{t.auth.registerParticipationForm.organization}</Label>
              <Input {...form.register("organizationName")} placeholder={t.auth.registerParticipationForm.organizationPlaceholder} />
            </div>
            <div className="space-y-2">
              <Label>{t.auth.registerParticipationForm.lastName}</Label>
              <Input {...form.register("lastName")} placeholder={t.auth.registerParticipationForm.lastNamePlaceholder} />
              <ErrorText message={form.formState.errors.lastName?.message} />
            </div>
            <div className="space-y-2">
              <Label>{t.auth.registerParticipationForm.firstName}</Label>
              <Input {...form.register("firstName")} placeholder={t.auth.registerParticipationForm.firstNamePlaceholder} />
              <ErrorText message={form.formState.errors.firstName?.message} />
            </div>
            <div className="space-y-2">
              <Label>{t.auth.registerParticipationForm.email}</Label>
              <Input {...form.register("email")} placeholder={t.auth.registerParticipationForm.emailPlaceholder} />
              <ErrorText message={form.formState.errors.email?.message} />
            </div>
            <div className="space-y-2">
              <Label>{t.auth.registerParticipationForm.pseudonym}</Label>
              <Input {...form.register("pseudonym")} placeholder={t.auth.registerParticipationForm.pseudonymPlaceholder} />
              <ErrorText message={form.formState.errors.pseudonym?.message} />
            </div>
            <div className="space-y-2">
              <Label>{t.auth.registerParticipationForm.wilaya}</Label>
              <select {...form.register("wilayaId")} className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
                {wilayaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorText message={form.formState.errors.wilayaId?.message} />
            </div>
            <div className="space-y-2">
              <Label>{t.auth.registerParticipationForm.professionalStatus}</Label>
              <select {...form.register("professionalStatusId")} className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
                {professionalStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorText message={form.formState.errors.professionalStatusId?.message} />
            </div>
            <div className="space-y-2">
              <Label>{t.auth.registerParticipationForm.ageRange}</Label>
              <select {...form.register("ageRange")} className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
                {ageRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorText message={form.formState.errors.ageRange?.message} />
            </div>
            <div className="space-y-2">
              <Label>{t.auth.registerParticipationForm.sex}</Label>
              <select {...form.register("sex")} className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
                {sexOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorText message={form.formState.errors.sex?.message} />
            </div>
            <div className="space-y-2">
              <Label>{t.auth.registerParticipationForm.password}</Label>
              <Input type="password" {...form.register("password")} placeholder={t.auth.registerParticipationForm.passwordPlaceholder} />
              <ErrorText message={form.formState.errors.password?.message} />
            </div>
            <div className="space-y-2">
              <Label>{t.auth.registerParticipationForm.confirmPassword}</Label>
              <Input type="password" {...form.register("confirmPassword")} placeholder={t.auth.registerParticipationForm.confirmPasswordPlaceholder} />
              <ErrorText message={form.formState.errors.confirmPassword?.message} />
            </div>
          </GridFields>
          {serverError ? <p className="text-sm text-rose-700">{serverError}</p> : null}
          {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t.auth.registerParticipationForm.submitting : t.auth.registerParticipationForm.submit}
            </Button>
            <Link href="/auth/login" className="text-sm text-[var(--muted-foreground)] hover:underline">
              {t.auth.registerParticipationForm.loginLink}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
