import Link from "next/link";
import Image from "next/image";

export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const overlineClass =
    tone === "dark"
      ? "text-[color:rgba(247,242,234,0.72)]"
      : "text-[var(--muted-foreground)]";
  const titleClass =
    tone === "dark"
      ? "text-[var(--sidebar-foreground)]"
      : "text-[var(--foreground)]";

  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex size-16 items-center justify-center">
        <Image
          src="/logo.png"
          alt="Cour des comptes"
          width={64}
          height={64}
          className="h-16 w-16 object-contain"
          priority
        />
      </div>
      <div>
        <p
          className={`text-sm font-semibold uppercase tracking-[0.2em] ${overlineClass}`}
        >
          Cour des comptes
        </p>
        <p className={`text-base font-semibold ${titleClass}`}>
          Espace citoyen
        </p>
      </div>
    </Link>
  );
}
