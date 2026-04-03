import ar from "@/locales/ar.json";
import fr from "@/locales/fr.json";

export const locales = ["fr", "ar"] as const;

export type Locale = (typeof locales)[number];

export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_STORAGE_KEY = "cdc-locale";
export const LOCALE_COOKIE_KEY = "cdc-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "fr" || value === "ar";
}

export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getIntlLocale(locale: Locale) {
  return locale === "ar" ? "ar-DZ" : "fr-FR";
}

export const translations = {
  fr,
  ar,
} as const;

export type TranslationTree = (typeof translations)[typeof DEFAULT_LOCALE];

export function getTranslations(locale: Locale): TranslationTree {
  return translations[locale];
}

export function getOverviewStatTranslationKey(labelOrKey: string) {
  const normalized = labelOrKey.toLowerCase();

  if (normalized === "proposals_received" || normalized.includes("proposition")) {
    return "proposals_received" as const;
  }

  if (normalized === "reports_received" || normalized.includes("signalement")) {
    return "reports_received" as const;
  }

  if (normalized === "accepted_themes" || normalized.includes("theme")) {
    return "accepted_themes" as const;
  }

  return "published_reports" as const;
}

export function formatMessage(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
