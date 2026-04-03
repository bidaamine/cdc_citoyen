import { ok } from "@/lib/http";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return ok({
      connected: false,
      driver: "mysql",
      mode: "fallback",
      message: "DATABASE_URL is not configured.",
    });
  }

  try {
    const { db } = await import("@/lib/db");
    await db.$queryRaw`SELECT 1`;

    return ok({
      connected: true,
      driver: "mysql",
      mode: "prisma",
      message: "Database connection is healthy.",
    });
  } catch (error) {
    return ok({
      connected: false,
      driver: "mysql",
      mode: "error",
      message: "Database connection failed.",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
