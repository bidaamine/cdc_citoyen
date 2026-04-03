"use client";

import Link from "next/link";

import { useTranslations } from "@/components/app/locale-provider";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-[var(--border)] bg-white/80">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-[var(--muted-foreground)] sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-semibold text-[var(--foreground)]">{t.footer.platformTitle}</p>
          <p className="mt-2">{t.footer.platformBody}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--foreground)]">{t.footer.frameworkTitle}</p>
          <div className="mt-2 flex flex-col gap-2">
            <Link href="/legal/reporting-framework">{t.footer.legal}</Link>
            <Link href="/legal/privacy-commitment">{t.footer.privacy}</Link>
            <Link href="/stats">{t.footer.publicStats}</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-[var(--foreground)]">{t.footer.accessTitle}</p>
          <div className="mt-2 flex flex-col gap-2">
            <Link href="/auth/register/participation">{t.footer.registerParticipation}</Link>
            <Link href="/auth/register/reporting">{t.footer.registerReporting}</Link>
            <Link href="/dashboard">{t.footer.dashboard}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
