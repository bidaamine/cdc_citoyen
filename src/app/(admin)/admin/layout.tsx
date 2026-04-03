import type { ReactNode } from "react";

import { AreaLayout } from "@/components/app/area-layout";
import { adminNav } from "@/lib/content";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AreaLayout
      title="Administration"
      subtitle="Référentiels, comptes, mappings, modération, audit et statistiques."
      nav={adminNav}
    >
      {children}
    </AreaLayout>
  );
}
