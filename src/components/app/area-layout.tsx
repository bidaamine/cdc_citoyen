import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Logo } from "@/components/app/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function AreaLayout({
  title,
  subtitle,
  nav,
  children,
}: {
  title: string;
  subtitle: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--muted)]/40">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-[32px] border border-[var(--border)] bg-[var(--sidebar)] p-6 text-[var(--sidebar-foreground)] shadow-[0_30px_60px_rgba(12,22,55,0.22)]">
          <Logo />
          <div className="mt-8 rounded-3xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">{title}</p>
            <p className="mt-2 text-sm text-white/80">{subtitle}</p>
          </div>
          <nav className="mt-8 space-y-2">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/78 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="space-y-6">
          <header className="flex flex-col gap-4 rounded-[28px] border border-[var(--border)] bg-white px-6 py-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">{title}</p>
              <h1 className="mt-2 text-2xl font-semibold">{subtitle}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" asChild>
                <Link href="/">Retour au site public</Link>
              </Button>
              <div className="flex items-center gap-3 rounded-full bg-[var(--muted)] px-4 py-2">
                <Avatar>
                  <AvatarFallback>CD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">Compte démo</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Session de démonstration</p>
                </div>
              </div>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
