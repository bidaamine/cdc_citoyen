"use client";

import { useEffect } from "react";

import { useLocale } from "@/components/app/locale-provider";
import { getDirection } from "@/lib/i18n";

export function LocaleScript() {
  const { locale } = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = getDirection(locale);
    document.body.classList.toggle("font-ar", locale === "ar");
  }, [locale]);

  return null;
}
