"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useTranslations } from "@/components/app/locale-provider";
import { resolveDashboard } from "@/lib/auth-demo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const t = useTranslations();
  const [email, setEmail] = useState("citizen@cdc.dz");
  const [password, setPassword] = useState("demo12345");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (!result || result.error) {
      setError(t.auth.loginForm.invalidCredentials);
      return;
    }

    const role =
      email === "admin@cdc.dz"
        ? "ADMIN"
        : email === "president@cdc.dz"
          ? "PRESIDENT"
          : email === "rapporteur@cdc.dz"
            ? "RAPPORTEUR_GENERAL"
            : email === "org@cdc.dz"
              ? "ORG"
              : "CITIZEN";

    router.push(resolveDashboard(role));
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.auth.loginForm.title}</CardTitle>
        <CardDescription>{t.auth.loginForm.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>{t.auth.loginForm.email}</Label>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t.auth.loginForm.password}</Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          <Button className="w-full" disabled={loading}>
            {loading ? t.auth.loginForm.submitting : t.auth.loginForm.submit}
          </Button>
          <div className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
            <Link href="/auth/register/participation" className="hover:underline">
              {t.auth.loginForm.registerParticipation}
            </Link>
            <Link href="/auth/register/reporting" className="hover:underline">
              {t.auth.loginForm.registerReporting}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
