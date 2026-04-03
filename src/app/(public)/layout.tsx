import type { ReactNode } from "react";

import { Footer } from "@/components/app/footer";
import { PublicHeader } from "@/components/app/public-header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
