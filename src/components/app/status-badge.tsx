"use client";

import { useTranslations } from "@/components/app/locale-provider";
import { Badge } from "@/components/ui/badge";

const variants: Record<string, "secondary" | "warning" | "success" | "danger"> = {
  RECU: "secondary",
  EN_COURS_ANALYSE: "warning",
  ACCEPTEE: "success",
  REJETEE: "danger",
  NON_ACTUALISEE: "secondary",
  NON_TRAITE: "warning",
  REJETE: "danger",
  CONVERTI_EN_THEME: "success",
  ACTIVE: "success",
  PENDING: "warning",
  BLOCKED: "danger",
};

export function StatusBadge({ value }: { value: string }) {
  const t = useTranslations();

  return <Badge variant={variants[value] ?? "secondary"}>{t.statuses[value as keyof typeof t.statuses] ?? value.replaceAll("_", " ")}</Badge>;
}
