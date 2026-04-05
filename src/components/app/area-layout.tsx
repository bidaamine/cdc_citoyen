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
        <aside className="rounded-[28px] border border-[color:rgba(247,242,234,0.1)] bg-[var(--sidebar)] p-6 text-[var(--sidebar-foreground)] shadow-[0_24px_70px_rgba(24,17,19,0.32)]">
          <Logo tone="dark" />
          <div className="mt-8 rounded-[24px] border border-[color:rgba(247,242,234,0.12)] bg-[color:rgba(247,242,234,0.05)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[color:rgba(247,242,234,0.56)]">{title}</p>
            <p className="mt-1 text-sm font-medium text-[color:rgba(247,242,234,0.88)]">{subtitle}</p>
          </div>
          <nav className="mt-8 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[color:rgba(247,242,234,0.72)] transition hover:bg-[color:rgba(247,242,234,0.08)] hover:text-white"
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="space-y-6">
          <header className="flex flex-col gap-4 rounded-[28px] border border-[var(--border)] bg-[color:rgba(252,250,246,0.88)] px-6 py-4 shadow-[0_16px_50px_rgba(35,26,28,0.08)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">{title}</p>
              <h1 className="mt-2 text-2xl font-semibold">{subtitle}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" asChild>
                <Link href="/">Retour au site public</Link>
              </Button>
              <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--muted)] px-4 py-2">
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
