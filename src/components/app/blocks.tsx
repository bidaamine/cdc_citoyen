import Link from "next/link";
import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function InfoCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
    </Card>
  );
}

export function LinkList({ items }: { items: { href: string; label: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium hover:bg-[var(--muted)]"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
      {items.map((item) => (
        <li key={item} className="rounded-2xl bg-[var(--muted)]/65 px-4 py-3">
          {item}
        </li>
      ))}
    </ul>
  );
}
