import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageShell({
  eyebrow,
  title,
  description,
  children,
  aside,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8",
        aside ? "grid lg:grid-cols-[minmax(0,1fr)_320px]" : "space-y-8",
      )}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
              {eyebrow}
            </p>
          ) : null}
          <div className="space-y-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-3xl text-lg text-[var(--muted-foreground)]">{description}</p>
          </div>
        </div>
        {children}
      </div>
      {aside ? <div className="space-y-6">{aside}</div> : null}
    </section>
  );
}
