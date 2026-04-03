import type { ReactNode } from "react";

import { AreaLayout } from "@/components/app/area-layout";
import { citizenNav } from "@/lib/content";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AreaLayout
      title="Espace citoyen"
      subtitle="Suivi des propositions, signalements, notifications et profil."
      nav={citizenNav}
    >
      {children}
    </AreaLayout>
  );
}
