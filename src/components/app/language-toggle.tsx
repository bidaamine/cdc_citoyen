"use client";

import { Languages } from "lucide-react";

import { useLocale, useTranslations } from "@/components/app/locale-provider";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const t = useTranslations();

  function toggleLocale() {
    const nextLocale: Locale = locale === "fr" ? "ar" : "fr";
    setLocale(nextLocale);
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleLocale}>
      <Languages className="size-4" />
      {t.language.switchTo}
    </Button>
  );
}
