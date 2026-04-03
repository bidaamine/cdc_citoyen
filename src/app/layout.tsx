import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Cairo, IBM_Plex_Mono, Manrope } from "next/font/google";

import { LocaleProvider } from "@/components/app/locale-provider";
import { LocaleScript } from "@/components/app/locale-script";
import { getDirection, resolveLocale } from "@/lib/i18n";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Espace citoyen | Cour des comptes",
  description:
    "Plateforme institutionnelle de participation citoyenne, signalement, gestion des dossiers et statistiques.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLocale = resolveLocale(cookieStore.get("cdc-locale")?.value);

  return (
    <html
      lang={initialLocale}
      dir={getDirection(initialLocale)}
      className={`${manrope.variable} ${cairo.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider initialLocale={initialLocale}>
          <LocaleScript />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
