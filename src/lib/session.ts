import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { unauthorized } from "next/navigation";

import { authOptions } from "@/lib/auth";

export function getSession() {
  return getServerSession(authOptions);
}

export async function getCurrentUserId() {
  const session = await getSession();
  return session?.user?.id ?? null;
}

export async function requireCurrentUserId() {
  const userId = await getCurrentUserId();

  if (!userId) {
    unauthorized();
  }

  return userId;
}

export async function requireSessionForPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return session;
}

export async function requireRole(...roles: string[]) {
  const session = await getSession();

  if (!session?.user?.id || !session.user.role || !roles.includes(session.user.role)) {
    unauthorized();
  }

  return session;
}
