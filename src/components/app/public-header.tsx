import { resolveDashboard } from "@/lib/auth-demo";
import { getSession } from "@/lib/session";

import { PublicHeaderClient } from "@/components/app/public-header-client";

export async function PublicHeader() {
  const session = await getSession();
  const role = session?.user?.role;

  const dashboardHref =
    role === "ADMIN"
      ? resolveDashboard("ADMIN")
      : role === "PRESIDENT"
        ? resolveDashboard("PRESIDENT")
        : role === "RAPPORTEUR_GENERAL"
          ? resolveDashboard("RAPPORTEUR_GENERAL")
          : role === "ORG"
            ? resolveDashboard("ORG")
            : resolveDashboard("CITIZEN");

  return <PublicHeaderClient isAuthenticated={Boolean(session?.user?.id)} dashboardHref={dashboardHref} />;
}
