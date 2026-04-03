import { Prisma } from "@prisma/client";

type AuditEntry = {
  action: string;
  resourceType: string;
  resourceId: string;
  actorUserId?: string;
  metadata?: Record<string, unknown>;
};

export async function recordAuditLog(entry: AuditEntry) {
  if (!process.env.DATABASE_URL) {
    console.info("[audit]", JSON.stringify(entry));
    return;
  }

  try {
    const { db } = await import("@/lib/db");

    await db.auditLog.create({
      data: {
        actorUserId: entry.actorUserId,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        metadataJson: entry.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.warn("Audit log persistence failed, falling back to console.", error);
    console.info("[audit]", JSON.stringify(entry));
  }
}
