import type { ReactNode } from "react";

import { AreaLayout } from "@/components/app/area-layout";
import { presidentNav } from "@/lib/content";

export default function PresidentLayout({ children }: { children: ReactNode }) {
  return (
    <AreaLayout
      title="Président de chambre"
      subtitle="File de traitement des propositions et signalements affectés."
      nav={presidentNav}
    >
      {children}
    </AreaLayout>
  );
}
