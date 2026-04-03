"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import { LanguageToggle } from "@/components/app/language-toggle";
import { Logo } from "@/components/app/logo";
import { useTranslations } from "@/components/app/locale-provider";
import { Button } from "@/components/ui/button";

type PublicHeaderClientProps = {
  isAuthenticated: boolean;
  dashboardHref?: string;
};

export function PublicHeaderClient({
  isAuthenticated,
  dashboardHref = "/dashboard",
}: PublicHeaderClientProps) {
  const t = useTranslations();

  const publicNav = [
    { href: "/", label: t.nav.home },
    { href: "/participation", label: t.nav.participation },
    { href: "/signalement", label: t.nav.reporting },
    { href: "/themes", label: t.nav.themes },
    { href: "/reports", label: t.nav.reports },
    { href: "/stats", label: t.nav.stats },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-[var(--background)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          {isAuthenticated ? (
            <>
              <Button variant="secondary" size="sm" asChild>
                <Link href={dashboardHref}>{t.nav.dashboard}</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                {t.nav.logout}
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/auth/login">{t.nav.login}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register/participation">{t.nav.register}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
