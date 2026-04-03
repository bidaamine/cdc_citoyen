import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--primary)] text-sm font-bold text-white">
        CDC
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Cour des comptes
        </p>
        <p className="text-base font-semibold text-[var(--foreground)]">Espace citoyen</p>
      </div>
    </Link>
  );
}
