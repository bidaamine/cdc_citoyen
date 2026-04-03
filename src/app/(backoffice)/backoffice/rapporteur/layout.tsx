import type { ReactNode } from "react";

import { AreaLayout } from "@/components/app/area-layout";
import { rapporteurNav } from "@/lib/content";

export default function RapporteurLayout({ children }: { children: ReactNode }) {
  return (
    <AreaLayout
      title="Rapporteur général"
      subtitle="Décisions finales, priorisation et plan d'action annuel."
      nav={rapporteurNav}
    >
      {children}
    </AreaLayout>
  );
}
