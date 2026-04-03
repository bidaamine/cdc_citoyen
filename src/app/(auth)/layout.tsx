import type { ReactNode } from "react";

import { Footer } from "@/components/app/footer";
import { PublicHeader } from "@/components/app/public-header";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 items-start px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">{children}</div>
      </main>
      <Footer />
    </>
  );
}
