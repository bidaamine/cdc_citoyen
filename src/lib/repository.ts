import { AccountStatus, ProposalStatus, ReportStatus, RoleCode, UserType } from "@prisma/client";
import { hashSync } from "bcryptjs";

import { db } from "@/lib/db";
import { notifications, proposalRows, reportRows, settingsCatalog } from "@/lib/content";
import type {
  ActionPlanItem,
  AdminSummary,
  InternalUserItem,
  AuditLogItem,
  MappingItem,
  ModerationSummary,
  NotificationItem,
  OverviewResponse,
  PublicThemeDetail,
  PublishedReportItem,
  ProposalListItem,
  RapporteurSummary,
  PresidentSummary,
  ReportListItem,
  ProfileItem,
  SettingGroup,
  SettingRecord,
  StatsSeriesItem,
  TableQuery,
  UserAccountItem,
} from "@/lib/api-types";
import { nextExerciseYear } from "@/lib/utils";
import {
  participationRegistrationSchema,
  profileUpdateSchema,
  proposalSchema,
  reportSchema,
  reportingRegistrationSchema,
} from "@/lib/validators";

type ProposalInput = {
  titleFr: string;
  titleAr: string;
  descriptionFr: string;
  descriptionAr: string;
  categoryId: string;
  exerciseYear: number;
};

type ReportInput = {
  subject: string;
  targetEntityName: string;
  targetEntityType: "CENTRAL" | "LOCAL";
  address: string;
  relationToEntity: string;
  circumstance: string;
  factsLocation: string;
  factsPeriodicity: string;
  irregularityDescription: string;
  reportCategoryId: string;
};

const fallbackProposals: ProposalListItem[] = proposalRows.map((row) => ({
  id: row.id,
  title: row.title,
  category: row.category,
  exercise: Number(row.exercise),
  status: row.status,
  updatedAt: row.updatedAt,
  likes: row.likes,
  comments: row.comments,
}));

const fallbackReports: ReportListItem[] = reportRows.map((row) => ({
  id: row.id,
  subject: row.subject,
  entity: row.entity,
  status: row.status,
  updatedAt: row.updatedAt,
  acknowledgement: row.acknowledgement,
}));

const fallbackNotifications: NotificationItem[] = notifications.map((item, index) => ({
  id: `notif-${index + 1}`,
  title: item.title,
  body: item.body,
  date: item.date,
  channel: "IN_APP",
  isRead: false,
}));

function hasDatabaseConfig() {
  return Boolean(process.env.DATABASE_URL);
}

async function runWithFallback<T>(operation: () => Promise<T>, fallback: () => T | Promise<T>) {
  if (!hasDatabaseConfig()) {
    return fallback();
  }

  try {
    return await operation();
  } catch (error) {
    console.warn("Database access failed, falling back to mock data.", error);
    return fallback();
  }
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function normalizeProposalStatus(status: string) {
  return ProposalStatus[status as keyof typeof ProposalStatus] ?? ProposalStatus.RECU;
}

function normalizeReportStatus(status: string) {
  return ReportStatus[status as keyof typeof ReportStatus] ?? ReportStatus.NON_TRAITE;
}

function normalizeFilterValue(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized.toLowerCase() : "";
}

function matchesQuery(values: Array<string | null | undefined>, query?: string) {
  const normalizedQuery = normalizeFilterValue(query);
  if (!normalizedQuery) return true;

  return values.some((value) => value?.toLowerCase().includes(normalizedQuery));
}

function matchesStatus(status: string, expected?: string) {
  if (!expected?.trim()) return true;
  return status === expected;
}

function matchesAction(action: string, expected?: string) {
  if (!expected?.trim()) return true;
  return action === expected;
}

function matchesValue(value: string | number, expected?: string) {
  if (!expected?.trim()) return true;
  return String(value) === expected;
}

function parseFilterDate(value?: string | null, endOfDay = false) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }

  return date;
}

function matchesDateRange(date: Date, filters: TableQuery = {}) {
  const from = parseFilterDate(filters.from);
  const to = parseFilterDate(filters.to, true);

  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

function buildNotificationLink(type: string, body: string) {
  const proposalMatch = body.match(/dossier ([A-Za-z0-9_-]+)/);
  const reportMatch = body.match(/signalement ([A-Za-z0-9_-]+)/);

  if ((type === "PROPOSAL_CREATED" || type === "REPORT_CONVERTED") && proposalMatch) {
    return {
      relatedHref: `/dashboard/proposals/${proposalMatch[1]}`,
      relatedLabel: `Voir le dossier ${proposalMatch[1]}`,
    };
  }

  if ((type === "REPORT_CREATED" || type === "REPORT_REJECTED" || type === "REPORT_UPDATED") && reportMatch) {
    return {
      relatedHref: `/dashboard/reports/${reportMatch[1]}`,
      relatedLabel: `Voir le signalement ${reportMatch[1]}`,
    };
  }

  return {};
}

async function findDemoCitizenId() {
  const user =
    (await db.user.findFirst({
      where: {
        email: "citizen@cdc.dz",
      },
    })) ??
    (await db.user.findFirst({
      where: {
        userType: "CITIZEN",
      },
    }));

  return user?.id ?? null;
}

async function resolveUserId(userId?: string | null) {
  return userId ?? (await findDemoCitizenId());
}

async function resolveThemeCategory(categoryId: string) {
  return (
    (await db.themeCategory.findFirst({
      where: {
        OR: [{ id: categoryId }, { nameFr: categoryId }, { nameAr: categoryId }],
      },
    })) ??
    db.themeCategory.findFirst({
      where: { isActive: true },
    })
  );
}

async function resolveThemeCategoryForChamber(chamberId: string) {
  return (
    (await db.themeCategory.findFirst({
      where: {
        chamberId,
        isActive: true,
      },
      orderBy: { nameFr: "asc" },
    })) ??
    db.themeCategory.findFirst({
      where: { isActive: true },
      orderBy: { nameFr: "asc" },
    })
  );
}

async function findLinkedProposalIdForReport(reportId: string) {
  const linkedReport = await db.report.findUnique({
    where: { id: reportId },
    select: { generatedProposalId: true },
  });

  if (linkedReport?.generatedProposalId) {
    return linkedReport.generatedProposalId;
  }

  const linkedProposal = await db.proposal.findFirst({
    where: {
      descriptionFr: {
        contains: `signalement ${reportId}`,
      },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  return linkedProposal?.id ?? null;
}

async function resolveReportCategory(reportCategoryId: string) {
  return (
    (await db.reportCategory.findFirst({
      where: {
        OR: [{ id: reportCategoryId }, { nameFr: reportCategoryId }, { nameAr: reportCategoryId }],
      },
    })) ??
    db.reportCategory.findFirst({
      where: { isActive: true },
    })
  );
}

async function resolveReportAssignment() {
  const centralAdministration =
    (await db.centralAdministration.findFirst({
      where: { isActive: true },
    })) ?? null;

  if (centralAdministration) {
    return {
      assignedChamberId: centralAdministration.chamberId,
      centralAdministrationId: centralAdministration.id,
      localCollectivityId: null,
    };
  }

  const localCollectivity =
    (await db.localCollectivity.findFirst({
      where: { isActive: true },
    })) ?? null;

  if (localCollectivity) {
    return {
      assignedChamberId: localCollectivity.chamberId,
      centralAdministrationId: null,
      localCollectivityId: localCollectivity.id,
    };
  }

  return null;
}

async function resolveFirstChamberId() {
  const chamber = await db.chamber.findFirst({
    orderBy: { nameFr: "asc" },
  });

  return chamber?.id ?? null;
}

async function resolveFirstWilayaId() {
  const wilaya = await db.wilaya.findFirst({
    orderBy: { code: "asc" },
  });

  return wilaya?.id ?? null;
}

async function getInternalScope(userId?: string | null) {
  if (!userId || !hasDatabaseConfig()) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      chamber: true,
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    userId: user.id,
    chamberId: user.chamberId,
    chamberName: user.chamber?.nameFr ?? "Portefeuille non assigne",
    role: String(user.roles[0]?.role.code ?? ""),
  };
}

export const repository = {
  async listProposals(userId?: string | null): Promise<ProposalListItem[]> {
    return runWithFallback(
      async () => {
        const resolvedUserId = await resolveUserId(userId);
        const proposals = await db.proposal.findMany({
          ...(resolvedUserId
            ? {
                where: {
                  submittedByUserId: resolvedUserId,
                },
              }
            : {}),
          orderBy: { updatedAt: "desc" },
          include: {
            category: true,
            likes: true,
            comments: true,
          },
        });

        return proposals.map((proposal) => ({
          id: proposal.id,
          title: proposal.titleFr,
          category: proposal.category.nameFr,
          exercise: proposal.exerciseYear,
          status: proposal.currentStatus,
          updatedAt: formatDate(proposal.updatedAt),
          likes: proposal.likes.length,
          comments: proposal.comments.length,
        }));
      },
      () => [...fallbackProposals].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    );
  },

  async getProposal(id: string, userId?: string | null) {
    return runWithFallback(
      async () => {
        const resolvedUserId = await resolveUserId(userId);
        const proposal = await db.proposal.findUnique({
          where: { id },
          include: {
            category: true,
            likes: true,
            comments: true,
          },
        });

        if (!proposal) return null;
        if (resolvedUserId && proposal.submittedByUserId !== resolvedUserId) return null;

        return {
          id: proposal.id,
          title: proposal.titleFr,
          category: proposal.category.nameFr,
          exercise: proposal.exerciseYear,
          status: proposal.currentStatus,
          updatedAt: formatDate(proposal.updatedAt),
          likes: proposal.likes.length,
          comments: proposal.comments.length,
        } satisfies ProposalListItem;
      },
      () => fallbackProposals.find((proposal) => proposal.id === id) ?? null,
    );
  },

  async listPublicThemes(filters: TableQuery = {}): Promise<ProposalListItem[]> {
    return runWithFallback(
      async () => {
        const proposals = await db.proposal.findMany({
          orderBy: { updatedAt: "desc" },
          include: {
            category: true,
            likes: true,
            comments: true,
          },
          take: 24,
        });

        return proposals
          .map((proposal) => ({
            id: proposal.id,
            title: proposal.titleFr,
            category: proposal.category.nameFr,
            exercise: proposal.exerciseYear,
            status: String(proposal.currentStatus),
            updatedAt: formatDate(proposal.updatedAt),
            likes: proposal.likes.length,
            comments: proposal.comments.length,
          }))
          .filter(
            (proposal) =>
              matchesQuery([proposal.title, proposal.category], filters.q) &&
              matchesStatus(proposal.status, filters.status) &&
              matchesValue(proposal.category, filters.category) &&
              matchesValue(proposal.exercise, filters.exercise),
          );
      },
      () =>
        [...fallbackProposals]
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
          .filter(
            (proposal) =>
              matchesQuery([proposal.title, proposal.category], filters.q) &&
              matchesStatus(proposal.status, filters.status) &&
              matchesValue(proposal.category, filters.category) &&
              matchesValue(proposal.exercise, filters.exercise),
          ),
    );
  },

  async getPublicTheme(id: string): Promise<PublicThemeDetail | null> {
    return runWithFallback(
      async () => {
        const proposal = await db.proposal.findUnique({
          where: { id },
          include: {
            category: true,
            likes: true,
            comments: true,
          },
        });

        if (!proposal) return null;

        return {
          id: proposal.id,
          title: proposal.titleFr,
          titleAr: proposal.titleAr,
          descriptionFr: proposal.descriptionFr,
          descriptionAr: proposal.descriptionAr,
          category: proposal.category.nameFr,
          exercise: proposal.exerciseYear,
          status: String(proposal.currentStatus),
          updatedAt: formatDate(proposal.updatedAt),
          likes: proposal.likes.length,
          comments: proposal.comments.length,
        };
      },
      () => {
        const proposal = proposalRows.find((row) => row.id === id);
        if (!proposal) return null;

        return {
          id: proposal.id,
          title: proposal.title,
          titleAr: proposal.title,
          descriptionFr: `Theme public de demonstration pour ${proposal.title}.`,
          descriptionAr: `Theme public de demonstration pour ${proposal.title}.`,
          category: proposal.category,
          exercise: Number(proposal.exercise),
          status: proposal.status,
          updatedAt: proposal.updatedAt,
          likes: proposal.likes,
          comments: proposal.comments,
        };
      },
    );
  },

  async createProposal(input: ProposalInput, userId?: string | null) {
    const parsed = proposalSchema.safeParse(input);

    if (!parsed.success) {
      return { error: parsed.error.flatten() } as const;
    }

      return runWithFallback(
      async () => {
        const submitterId = await resolveUserId(userId);
        const category = await resolveThemeCategory(parsed.data.categoryId);

        if (!submitterId || !category) {
          return {
            error: {
              formErrors: ["Aucun utilisateur citoyen ou catégorie disponible dans la base."],
              fieldErrors: {},
            },
          } as const;
        }

        const proposal = await db.proposal.create({
          data: {
            submittedByUserId: submitterId,
            titleFr: parsed.data.titleFr,
            titleAr: parsed.data.titleAr,
            descriptionFr: parsed.data.descriptionFr,
            descriptionAr: parsed.data.descriptionAr,
            categoryId: category.id,
            exerciseYear: parsed.data.exerciseYear,
            currentStatus: ProposalStatus.RECU,
            assignedChamberId: category.chamberId,
            statusHistory: {
              create: {
                toStatus: ProposalStatus.RECU,
                changedByUserId: submitterId,
                note: "Soumission initiale",
              },
            },
          },
          include: {
            category: true,
            likes: true,
            comments: true,
          },
        });

        await db.notification.create({
          data: {
            userId: submitterId,
            type: "PROPOSAL_CREATED",
            title: "Nouvelle proposition enregistrée",
            body: `Le dossier ${proposal.id} a été reçu et orienté vers la chambre compétente.`,
            channel: "IN_APP",
          },
        });

        return {
          data: {
            id: proposal.id,
            title: proposal.titleFr,
            category: proposal.category.nameFr,
            exercise: proposal.exerciseYear,
            status: String(proposal.currentStatus),
            updatedAt: formatDate(proposal.updatedAt),
            likes: proposal.likes.length,
            comments: proposal.comments.length,
          } satisfies ProposalListItem,
        } as const;
      },
      () => {
        const created: ProposalListItem = {
          id: `theme-${nextExerciseYear(new Date())}-${String(fallbackProposals.length + 1).padStart(3, "0")}`,
          title: parsed.data.titleFr,
          category: parsed.data.categoryId,
          exercise: parsed.data.exerciseYear,
          status: "RECU",
          updatedAt: new Date().toISOString().slice(0, 10),
          likes: 0,
          comments: 0,
        };

        fallbackProposals.unshift(created);

        fallbackNotifications.unshift({
          id: `notif-${fallbackNotifications.length + 1}`,
          title: "Nouvelle proposition enregistrée",
          body: `Le dossier ${created.id} a été reçu et orienté vers la chambre compétente.`,
          date: created.updatedAt,
          channel: "IN_APP",
          isRead: false,
        });

        return { data: created } as const;
      },
    );
  },

  async updateProposalStatus({
    id,
    status,
    actorUserId,
    actorRole,
    workflowAction,
    note,
  }: {
    id: string;
    status: string;
    actorUserId: string;
    actorRole: string;
    workflowAction?: string;
    note?: string;
  }) {
    return runWithFallback(
      async () => {
        const existing = await db.proposal.findUnique({ where: { id } });
        if (!existing) return null;

        const normalizedStatus = normalizeProposalStatus(status);
        const isTransmission = workflowAction === "TRANSMIT_TO_RAPPORTEUR";
        const proposal = await db.proposal.update({
          where: { id },
          data: {
            currentStatus: normalizedStatus,
            assignedPresidentUserId: actorRole === "PRESIDENT" ? actorUserId : existing.assignedPresidentUserId,
            transmittedToRapporteurAt:
              actorRole === "PRESIDENT" && isTransmission ? new Date() : existing.transmittedToRapporteurAt,
            finalDecidedByUserId:
              actorRole === "RAPPORTEUR_GENERAL" ? actorUserId : existing.finalDecidedByUserId,
            finalDecisionAt:
              actorRole === "RAPPORTEUR_GENERAL" ? new Date() : existing.finalDecisionAt,
            statusHistory: {
              create: {
                fromStatus: existing.currentStatus,
                toStatus: normalizedStatus,
                changedByUserId: actorUserId,
                note:
                  note ??
                  (isTransmission
                    ? "Transmission au rapporteur general"
                    : actorRole === "RAPPORTEUR_GENERAL"
                      ? "Decision finale du rapporteur general"
                      : "Mise a jour de statut via API"),
              },
            },
          },
          include: {
            category: true,
            likes: true,
            comments: true,
          },
        });

        return {
          id: proposal.id,
          title: proposal.titleFr,
          category: proposal.category.nameFr,
          exercise: proposal.exerciseYear,
          status: String(proposal.currentStatus),
          updatedAt: formatDate(proposal.updatedAt),
          likes: proposal.likes.length,
          comments: proposal.comments.length,
        } satisfies ProposalListItem;
      },
      () => {
        const proposal = fallbackProposals.find((entry) => entry.id === id);
        if (!proposal) return null;
        proposal.status = status;
        proposal.updatedAt = new Date().toISOString().slice(0, 10);
        return proposal;
      },
    );
  },

  async listReports(userId?: string | null): Promise<ReportListItem[]> {
    return runWithFallback(
      async () => {
        const resolvedUserId = await resolveUserId(userId);
        const reports = await db.report.findMany({
          ...(resolvedUserId
            ? {
                where: {
                  submittedByUserId: resolvedUserId,
                },
              }
            : {}),
          orderBy: { updatedAt: "desc" },
        });

        return reports.map((report) => ({
          id: report.id,
          subject: report.subject,
          entity: report.targetEntityName,
          status: String(report.currentStatus),
          updatedAt: formatDate(report.updatedAt),
          acknowledgement: report.acknowledgementNumber,
          linkedProposalId: null,
        } satisfies ReportListItem));
      },
      () => [...fallbackReports].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    );
  },

  async getReport(id: string, userId?: string | null) {
    return runWithFallback(
      async () => {
        const resolvedUserId = await resolveUserId(userId);
        const report = await db.report.findUnique({ where: { id } });
        if (!report) return null;
        if (resolvedUserId && report.submittedByUserId !== resolvedUserId) return null;
        const linkedProposalId =
          report.currentStatus === ReportStatus.CONVERTI_EN_THEME ? await findLinkedProposalIdForReport(report.id) : null;
        return {
          id: report.id,
          subject: report.subject,
          entity: report.targetEntityName,
          status: String(report.currentStatus),
          updatedAt: formatDate(report.updatedAt),
          acknowledgement: report.acknowledgementNumber,
          linkedProposalId,
        } satisfies ReportListItem;
      },
      () => fallbackReports.find((report) => report.id === id) ?? null,
    );
  },

  async listPublishedReports(filters: TableQuery = {}): Promise<PublishedReportItem[]> {
    return runWithFallback(
      async () => {
        const rows = await db.proposalFinalReport.findMany({
          orderBy: { publishedAt: "desc" },
          include: {
            proposal: {
              include: {
                category: true,
              },
            },
          },
          take: 24,
        });

        return rows
          .map((row) => ({
            id: row.id,
            title: row.fileName,
            exercise: String(row.proposal.exerciseYear),
            category: row.proposal.category.nameFr,
            publishedAt: formatDate(row.publishedAt),
            proposalId: row.proposalId,
          }))
          .filter(
            (report) =>
              matchesQuery([report.title, report.category, report.exercise], filters.q) &&
              matchesValue(report.category, filters.category) &&
              matchesValue(report.exercise, filters.exercise),
          );
      },
      () =>
        [
          {
            id: "pub-report-1",
            title: "Synthese audit transport urbain",
            exercise: "2025",
            category: "Transport",
            publishedAt: "2026-02-12",
            proposalId: "theme-2027-014",
          },
          {
            id: "pub-report-2",
            title: "Rapport controle dechets menagers",
            exercise: "2025",
            category: "Collectivites locales",
            publishedAt: "2026-03-03",
            proposalId: "theme-2027-019",
          },
        ].filter(
          (report) =>
            matchesQuery([report.title, report.category, report.exercise], filters.q) &&
            matchesValue(report.category, filters.category) &&
            matchesValue(report.exercise, filters.exercise),
        ),
    );
  },

  async createReport(input: ReportInput, userId?: string | null) {
    const parsed = reportSchema.safeParse(input);

    if (!parsed.success) {
      return { error: parsed.error.flatten() } as const;
    }

    return runWithFallback(
      async () => {
        const submitterId = await resolveUserId(userId);
        const category = await resolveReportCategory(parsed.data.reportCategoryId);
        const assignment = await resolveReportAssignment();

        if (!submitterId || !category || !assignment) {
          return {
            error: {
              formErrors: ["Référentiels insuffisants pour créer un signalement dans la base."],
              fieldErrors: {},
            },
          } as const;
        }

        const report = await db.report.create({
          data: {
            submittedByUserId: submitterId,
            subject: parsed.data.subject,
            targetEntityName: parsed.data.targetEntityName,
            targetEntityType: parsed.data.targetEntityType,
            centralAdministrationId:
              parsed.data.targetEntityType === "CENTRAL" ? assignment.centralAdministrationId : null,
            localCollectivityId:
              parsed.data.targetEntityType === "LOCAL" ? assignment.localCollectivityId : null,
            address: parsed.data.address,
            relationToEntity: parsed.data.relationToEntity,
            circumstance: parsed.data.circumstance,
            factsLocation: parsed.data.factsLocation,
            factsPeriodicity: parsed.data.factsPeriodicity,
            irregularityDescription: parsed.data.irregularityDescription,
            reportCategoryId: category.id,
            reportDate: new Date(),
            currentStatus: ReportStatus.NON_TRAITE,
            assignedChamberId: assignment.assignedChamberId,
            acknowledgementNumber: `AR-${new Date().getFullYear()}-${Date.now()}`,
            statusHistory: {
              create: {
                toStatus: ReportStatus.NON_TRAITE,
                changedByUserId: submitterId,
                note: "Soumission initiale",
              },
            },
          },
        });

        await db.notification.create({
          data: {
            userId: submitterId,
            type: "REPORT_CREATED",
            title: "Signalement enregistré",
            body: `Le signalement ${report.id} a reçu l'accusé ${report.acknowledgementNumber}.`,
            channel: "IN_APP",
          },
        });

        return {
          data: {
            id: report.id,
            subject: report.subject,
            entity: report.targetEntityName,
            status: String(report.currentStatus),
            updatedAt: formatDate(report.updatedAt),
            acknowledgement: report.acknowledgementNumber,
          } satisfies ReportListItem,
        } as const;
      },
      () => {
        const created: ReportListItem = {
          id: `SIG-${new Date().getFullYear()}-${String(fallbackReports.length + 1).padStart(4, "0")}`,
          subject: parsed.data.subject,
          entity: parsed.data.targetEntityName,
          status: "NON_TRAITE",
          updatedAt: new Date().toISOString().slice(0, 10),
          acknowledgement: `AR-${new Date().getFullYear()}-${String(fallbackReports.length + 320).padStart(5, "0")}`,
        };

        fallbackReports.unshift(created);
        fallbackNotifications.unshift({
          id: `notif-${fallbackNotifications.length + 1}`,
          title: "Signalement enregistré",
          body: `Le signalement ${created.id} a reçu l'accusé ${created.acknowledgement}.`,
          date: created.updatedAt,
          channel: "IN_APP",
          isRead: false,
        });

        return { data: created } as const;
      },
    );
  },

  async updateReportStatus({
    id,
    status,
    actorUserId,
    actorRole,
    workflowAction,
    note,
  }: {
    id: string;
    status: string;
    actorUserId: string;
    actorRole: string;
    workflowAction?: string;
    note?: string;
  }) {
    return runWithFallback(
      async () => {
        const existing = await db.report.findUnique({ where: { id } });
        if (!existing) return null;

        const normalizedStatus = normalizeReportStatus(status);
        const isConversion = workflowAction === "CONVERT_TO_THEME";
        let createdProposalId: string | null = existing.generatedProposalId ?? null;

        const report = await db.$transaction(async (tx) => {
          if (
            isConversion &&
            normalizedStatus === ReportStatus.CONVERTI_EN_THEME &&
            !existing.generatedProposalId
          ) {
            const themeCategory = await resolveThemeCategoryForChamber(existing.assignedChamberId);

            if (themeCategory) {
              const generatedProposal = await tx.proposal.create({
                data: {
                  submittedByUserId: existing.submittedByUserId,
                  titleFr: existing.subject,
                  titleAr: existing.subject,
                  descriptionFr: [
                    `Theme cree a partir du signalement ${existing.id}.`,
                    `Entite cible: ${existing.targetEntityName}.`,
                    `Adresse: ${existing.address}.`,
                    `Relation avec l'entite: ${existing.relationToEntity}.`,
                    `Contexte: ${existing.circumstance}.`,
                    `Lieu des faits: ${existing.factsLocation}.`,
                    `Periodicite: ${existing.factsPeriodicity}.`,
                    `Description: ${existing.irregularityDescription}.`,
                    note ? `Justification de conversion: ${note}` : null,
                  ]
                    .filter(Boolean)
                    .join("\n"),
                  descriptionAr: existing.irregularityDescription,
                  categoryId: themeCategory.id,
                  exerciseYear: nextExerciseYear(new Date()),
                  currentStatus: ProposalStatus.EN_COURS_ANALYSE,
                  assignedChamberId: existing.assignedChamberId,
                  assignedPresidentUserId: actorUserId,
                  statusHistory: {
                    create: {
                      toStatus: ProposalStatus.EN_COURS_ANALYSE,
                      changedByUserId: actorUserId,
                      note: `Creation automatique depuis le signalement ${existing.id}`,
                    },
                  },
                },
              });

              createdProposalId = generatedProposal.id;
            }
          }

          return tx.report.update({
            where: { id },
            data: {
              currentStatus: normalizedStatus,
              assignedPresidentUserId: actorRole === "PRESIDENT" ? actorUserId : existing.assignedPresidentUserId,
              generatedProposalId: createdProposalId,
              statusHistory: {
                create: {
                  fromStatus: existing.currentStatus,
                  toStatus: normalizedStatus,
                  changedByUserId: actorUserId,
                  note:
                    note ??
                    (isConversion
                      ? "Conversion du signalement en theme"
                      : normalizedStatus === ReportStatus.REJETE
                        ? "Rejet du signalement"
                        : "Prise en charge du signalement"),
                },
              },
            },
          });
        });

        await db.notification.create({
          data: {
            userId: existing.submittedByUserId,
            type:
              normalizedStatus === ReportStatus.CONVERTI_EN_THEME
                ? "REPORT_CONVERTED"
                : normalizedStatus === ReportStatus.REJETE
                  ? "REPORT_REJECTED"
                  : "REPORT_UPDATED",
            title:
              normalizedStatus === ReportStatus.CONVERTI_EN_THEME
                ? "Signalement converti en theme"
                : normalizedStatus === ReportStatus.REJETE
                  ? "Signalement rejete"
                  : "Signalement en cours de traitement",
            body:
              normalizedStatus === ReportStatus.CONVERTI_EN_THEME
                ? createdProposalId
                  ? `Le signalement ${report.id} a ete converti en theme de suivi sous le dossier ${createdProposalId}.`
                  : `Le signalement ${report.id} a ete converti en theme de suivi.`
                : normalizedStatus === ReportStatus.REJETE
                  ? `Le signalement ${report.id} a ete rejete apres analyse.`
                  : `Le signalement ${report.id} est en cours de traitement par la chambre competente.`,
            channel: "IN_APP",
          },
        });

        return {
          id: report.id,
          subject: report.subject,
          entity: report.targetEntityName,
          status: String(report.currentStatus),
          updatedAt: formatDate(report.updatedAt),
          acknowledgement: report.acknowledgementNumber,
        } satisfies ReportListItem;
      },
      () => {
        const report = fallbackReports.find((entry) => entry.id === id);
        if (!report) return null;
        report.status = status;
        report.updatedAt = new Date().toISOString().slice(0, 10);

        if (workflowAction === "CONVERT_TO_THEME" && status === "CONVERTI_EN_THEME") {
          const createdProposal: ProposalListItem = {
            id: `theme-${nextExerciseYear(new Date())}-${String(fallbackProposals.length + 1).padStart(3, "0")}`,
            title: report.subject,
            category: "Theme converti",
            exercise: nextExerciseYear(new Date()),
            status: "EN_COURS_ANALYSE",
            updatedAt: report.updatedAt,
            likes: 0,
            comments: 0,
          };

          fallbackProposals.unshift(createdProposal);
          fallbackNotifications.unshift({
            id: `notif-${fallbackNotifications.length + 1}`,
            title: "Signalement converti en theme",
            body: `Le signalement ${report.id} a ete converti sous le dossier ${createdProposal.id}.`,
            date: report.updatedAt,
            channel: "IN_APP",
            isRead: false,
          });
        }

        return report;
      },
    );
  },

  async listNotifications(userId?: string | null) {
    return runWithFallback(
      async () => {
        const resolvedUserId = await resolveUserId(userId);
        if (!resolvedUserId) return [] as NotificationItem[];

        const rows = await db.notification.findMany({
          where: { userId: resolvedUserId },
          orderBy: { createdAt: "desc" },
        });

        return rows.map((row) => ({
          id: row.id,
          title: row.title,
          body: row.body,
          date: formatDate(row.createdAt),
          channel: row.channel,
          isRead: row.isRead,
          ...buildNotificationLink(row.type, row.body),
        }));
      },
      () => [...fallbackNotifications].sort((a, b) => b.date.localeCompare(a.date)),
    );
  },

  async getOverview(filters: TableQuery = {}): Promise<OverviewResponse> {
    return runWithFallback(
      async () => {
        const [proposals, reports, notifications, finalReports] = await Promise.all([
          db.proposal.findMany({ select: { currentStatus: true, createdAt: true } }),
          db.report.findMany({ select: { currentStatus: true, createdAt: true } }),
          db.notification.findMany({ select: { createdAt: true } }),
          db.proposalFinalReport.findMany({ select: { publishedAt: true } }),
        ]);

        const filteredProposals = proposals.filter(
          (proposal) =>
            matchesDateRange(proposal.createdAt, filters) &&
            (!filters.status || String(proposal.currentStatus) === filters.status),
        );
        const filteredReports = reports.filter(
          (report) =>
            matchesDateRange(report.createdAt, filters) &&
            (!filters.status || String(report.currentStatus) === filters.status),
        );
        const filteredNotifications = notifications.filter((notification) =>
          matchesDateRange(notification.createdAt, filters),
        );
        const acceptedThemes = filteredProposals.filter(
          (proposal) => proposal.currentStatus === ProposalStatus.ACCEPTEE,
        ).length;
        const publishedReports = finalReports.filter((report) => matchesDateRange(report.publishedAt, filters)).length;

        return {
          publicStats: [
            { label: "Propositions reçues", value: String(filteredProposals.length), trend: "+0%" },
            { label: "Signalements enregistrés", value: String(filteredReports.length), trend: "+0%" },
            { label: "Thèmes retenus", value: String(acceptedThemes), trend: "+0%" },
            { label: "Rapports publiés", value: String(publishedReports), trend: "+0%" },
          ],
          proposalsCount: filteredProposals.length,
          reportsCount: filteredReports.length,
          notificationsCount: filteredNotifications.length,
        };
      },
      () => {
        const filteredProposals = fallbackProposals.filter(
          (proposal) =>
            matchesDateRange(new Date(proposal.updatedAt), filters) &&
            matchesStatus(proposal.status, filters.status),
        );
        const filteredReports = fallbackReports.filter(
          (report) =>
            matchesDateRange(new Date(report.updatedAt), filters) &&
            matchesStatus(report.status, filters.status),
        );
        const filteredNotifications = fallbackNotifications.filter((notification) =>
          matchesDateRange(new Date(notification.date), filters),
        );

        return {
          publicStats: [
            { label: "Propositions reçues", value: String(filteredProposals.length), trend: "+0%" },
            { label: "Signalements enregistrés", value: String(filteredReports.length), trend: "+0%" },
            {
              label: "Thèmes retenus",
              value: String(filteredProposals.filter((proposal) => proposal.status === "ACCEPTEE").length),
              trend: "+0%",
            },
            { label: "Rapports publiés", value: "0", trend: "+0%" },
          ],
          proposalsCount: filteredProposals.length,
          reportsCount: filteredReports.length,
          notificationsCount: filteredNotifications.length,
        };
      },
    );
  },

  async getSetting(setting: keyof typeof settingsCatalog): Promise<SettingGroup | null> {
    return runWithFallback(
      async () => {
        switch (setting) {
          case "wilayas": {
            const rows = await db.wilaya.findMany({ where: { isActive: true }, orderBy: { code: "asc" } });
            return {
              title: "Wilayas",
              description: "Référentiel territorial utilisé dans les comptes et les statistiques.",
              rows: rows.map((row) => ({ id: row.id, label: row.nameFr })),
            };
          }
          case "professional-statuses": {
            const rows = await db.professionalStatus.findMany({ where: { isActive: true }, orderBy: { nameFr: "asc" } });
            return {
              title: "Statuts professionnels",
              description: "Valeurs proposées dans les formulaires d'inscription.",
              rows: rows.map((row) => ({ id: row.id, label: row.nameFr })),
            };
          }
          case "theme-categories": {
            const rows = await db.themeCategory.findMany({ where: { isActive: true }, orderBy: { nameFr: "asc" } });
            return {
              title: "Catégories de thèmes",
              description: "Catégories pilotant l'affectation aux chambres compétentes.",
              rows: rows.map((row) => ({ id: row.id, label: row.nameFr })),
            };
          }
          case "report-categories": {
            const rows = await db.reportCategory.findMany({ where: { isActive: true }, orderBy: { nameFr: "asc" } });
            return {
              title: "Catégories de signalement",
              description: "Classification utilisée pour le filtrage et les statistiques.",
              rows: rows.map((row) => ({ id: row.id, label: row.nameFr })),
            };
          }
          case "central-administrations": {
            const rows = await db.centralAdministration.findMany({ where: { isActive: true }, orderBy: { nameFr: "asc" } });
            return {
              title: "Administrations centrales",
              description: "Entités centrales raccordées à une chambre de traitement.",
              rows: rows.map((row) => ({ id: row.id, label: row.nameFr })),
            };
          }
          case "local-collectivities": {
            const rows = await db.localCollectivity.findMany({ where: { isActive: true }, orderBy: { nameFr: "asc" } });
            return {
              title: "Collectivités locales",
              description: "Collectivités locales paramétrables et liées à une wilaya.",
              rows: rows.map((row) => ({ id: row.id, label: row.nameFr })),
            };
          }
          default:
            return null;
        }
      },
      () => {
        const config = settingsCatalog[setting];
        if (!config) return null;
        return {
          title: config.title,
          description: config.description,
          rows: config.rows.map((row, index) => ({ id: `${setting}-${index}`, label: row })),
        };
      },
    );
  },

  async createSettingValue(setting: keyof typeof settingsCatalog, label: string): Promise<SettingRecord | null> {
    return runWithFallback(
      async () => {
        const trimmed = label.trim();
        if (!trimmed) return null;

        switch (setting) {
          case "wilayas": {
            const count = await db.wilaya.count();
            const row = await db.wilaya.create({
              data: {
                code: String(count + 1).padStart(2, "0"),
                nameFr: trimmed,
                nameAr: trimmed,
                isActive: true,
              },
            });
            return { id: row.id, label: row.nameFr };
          }
          case "professional-statuses": {
            const row = await db.professionalStatus.create({
              data: { nameFr: trimmed, nameAr: trimmed, isActive: true },
            });
            return { id: row.id, label: row.nameFr };
          }
          case "theme-categories": {
            const chamberId = await resolveFirstChamberId();
            if (!chamberId) return null;
            const row = await db.themeCategory.create({
              data: { nameFr: trimmed, nameAr: trimmed, chamberId, isActive: true },
            });
            return { id: row.id, label: row.nameFr };
          }
          case "report-categories": {
            const row = await db.reportCategory.create({
              data: { nameFr: trimmed, nameAr: trimmed, isActive: true },
            });
            return { id: row.id, label: row.nameFr };
          }
          case "central-administrations": {
            const chamberId = await resolveFirstChamberId();
            if (!chamberId) return null;
            const row = await db.centralAdministration.create({
              data: { nameFr: trimmed, nameAr: trimmed, chamberId, isActive: true },
            });
            return { id: row.id, label: row.nameFr };
          }
          case "local-collectivities": {
            const chamberId = await resolveFirstChamberId();
            const wilayaId = await resolveFirstWilayaId();
            if (!chamberId || !wilayaId) return null;
            const row = await db.localCollectivity.create({
              data: { nameFr: trimmed, nameAr: trimmed, chamberId, wilayaId, isActive: true },
            });
            return { id: row.id, label: row.nameFr };
          }
          default:
            return null;
        }
      },
      () => ({ id: `${setting}-${Date.now()}`, label: label.trim() }),
    );
  },

  async deactivateSettingValue(setting: keyof typeof settingsCatalog, id: string): Promise<boolean> {
    return runWithFallback(
      async () => {
        switch (setting) {
          case "wilayas":
            await db.wilaya.update({ where: { id }, data: { isActive: false } });
            return true;
          case "professional-statuses":
            await db.professionalStatus.update({ where: { id }, data: { isActive: false } });
            return true;
          case "theme-categories":
            await db.themeCategory.update({ where: { id }, data: { isActive: false } });
            return true;
          case "report-categories":
            await db.reportCategory.update({ where: { id }, data: { isActive: false } });
            return true;
          case "central-administrations":
            await db.centralAdministration.update({ where: { id }, data: { isActive: false } });
            return true;
          case "local-collectivities":
            await db.localCollectivity.update({ where: { id }, data: { isActive: false } });
            return true;
          default:
            return false;
        }
      },
      () => true,
    );
  },

  async listMappings(): Promise<MappingItem[]> {
    return runWithFallback(
      async () => {
        const [themeCategories, centralAdministrations, localCollectivities] = await Promise.all([
          db.themeCategory.findMany({ include: { chamber: true }, orderBy: { nameFr: "asc" } }),
          db.centralAdministration.findMany({ include: { chamber: true }, orderBy: { nameFr: "asc" } }),
          db.localCollectivity.findMany({ include: { chamber: true }, orderBy: { nameFr: "asc" } }),
        ]);

        return [
          ...themeCategories.map((row) => ({
            source: "Catégorie thème",
            value: row.nameFr,
            chamber: row.chamber.nameFr,
          })),
          ...centralAdministrations.map((row) => ({
            source: "Administration centrale",
            value: row.nameFr,
            chamber: row.chamber.nameFr,
          })),
          ...localCollectivities.map((row) => ({
            source: "Collectivité locale",
            value: row.nameFr,
            chamber: row.chamber.nameFr,
          })),
        ];
      },
      () => [
        { source: "Catégorie thème", value: "Santé publique", chamber: "Chambre finances publiques" },
        { source: "Administration centrale", value: "Ministère de la Santé", chamber: "Chambre finances publiques" },
        { source: "Collectivité locale", value: "APC Alger Centre", chamber: "Chambre collectivités locales" },
      ],
    );
  },

  async listUsers(filters: TableQuery = {}): Promise<UserAccountItem[]> {
    return runWithFallback(
      async () => {
        const users = await db.user.findMany({
          orderBy: { createdAt: "desc" },
        });

        return users
          .map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            status: String(user.accountStatus),
            userType: String(user.userType),
            pseudonym: user.pseudonym,
          }))
          .filter(
            (user) =>
              matchesQuery([user.name, user.email, user.pseudonym, user.userType], filters.q) &&
              matchesStatus(user.status, filters.status),
          );
      },
      () =>
        [
          {
            id: "usr-1",
            name: "Nadia Rahmani",
            email: "citizen@cdc.dz",
            status: "ACTIVE",
            userType: "CITIZEN",
            pseudonym: "nadia-citoyenne",
          },
          {
            id: "usr-2",
            name: "Forum Associatif",
            email: "org@cdc.dz",
            status: "PENDING",
            userType: "CIVIL_SOCIETY_ORG",
            pseudonym: "forum-associations",
          },
        ].filter(
          (user) =>
            matchesQuery([user.name, user.email, user.pseudonym, user.userType], filters.q) &&
            matchesStatus(user.status, filters.status),
        ),
    );
  },

  async getUser(id: string) {
    return runWithFallback(
      async () => {
        const user = await db.user.findUnique({ where: { id } });
        if (!user) return null;
        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          status: String(user.accountStatus),
          userType: String(user.userType),
          pseudonym: user.pseudonym,
        } satisfies UserAccountItem;
      },
      () =>
        [
          {
            id: "usr-1",
            name: "Nadia Rahmani",
            email: "citizen@cdc.dz",
            status: "ACTIVE",
            userType: "CITIZEN",
            pseudonym: "nadia-citoyenne",
          },
          {
            id: "usr-2",
            name: "Forum Associatif",
            email: "org@cdc.dz",
            status: "PENDING",
            userType: "CIVIL_SOCIETY_ORG",
            pseudonym: "forum-associations",
          },
        ].find((user) => user.id === id) ?? null,
    );
  },

  async updateUserStatus(id: string, status: string) {
    return runWithFallback(
      async () => {
        const user = await db.user.update({
          where: { id },
          data: {
            accountStatus: status as "PENDING" | "ACTIVE" | "REFUSED" | "BLOCKED" | "SUSPENDED",
          },
        });

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          status: String(user.accountStatus),
          userType: String(user.userType),
          pseudonym: user.pseudonym,
        } satisfies UserAccountItem;
      },
      () => {
        const users = [
          {
            id: "usr-1",
            name: "Nadia Rahmani",
            email: "citizen@cdc.dz",
            status: "ACTIVE",
            userType: "CITIZEN",
            pseudonym: "nadia-citoyenne",
          },
          {
            id: "usr-2",
            name: "Forum Associatif",
            email: "org@cdc.dz",
            status: "PENDING",
            userType: "CIVIL_SOCIETY_ORG",
            pseudonym: "forum-associations",
          },
        ];
        const user = users.find((entry) => entry.id === id);
        if (!user) return null;
        user.status = status;
        return user;
      },
    );
  },

  async listInternalUsers(filters: TableQuery = {}): Promise<InternalUserItem[]> {
    return runWithFallback(
      async () => {
        const users = await db.user.findMany({
          where: { userType: "INTERNAL" },
          include: {
            chamber: true,
            roles: {
              include: {
                role: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        return users
          .map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            role: String(user.roles[0]?.role.code ?? "INTERNAL"),
            chamber: user.chamber?.nameFr ?? "Global",
            status: String(user.accountStatus),
          }))
          .filter(
            (user) =>
              matchesQuery([user.name, user.role, user.chamber], filters.q) &&
              matchesStatus(user.status, filters.status),
          );
      },
      () =>
        [
          {
            id: "internal-1",
            name: "Président Chambre 2",
            role: "PRESIDENT",
            chamber: "Chambre finances publiques",
            status: "ACTIVE",
          },
          {
            id: "internal-2",
            name: "Rapporteur Général",
            role: "RAPPORTEUR_GENERAL",
            chamber: "Global",
            status: "ACTIVE",
          },
        ].filter(
          (user) =>
            matchesQuery([user.name, user.role, user.chamber], filters.q) &&
            matchesStatus(user.status, filters.status),
        ),
    );
  },

  async getAdminSummary(): Promise<AdminSummary> {
    return runWithFallback(
      async () => {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const [totalUsers, pendingAccounts, blockedAccounts, auditEvents24h] = await Promise.all([
          db.user.count(),
          db.user.count({ where: { accountStatus: "PENDING" } }),
          db.user.count({ where: { accountStatus: "BLOCKED" } }),
          db.auditLog.count({ where: { createdAt: { gte: last24Hours } } }),
        ]);

        return {
          totalUsers,
          pendingAccounts,
          blockedAccounts,
          auditEvents24h,
        };
      },
      () => ({
        totalUsers: 18426,
        pendingAccounts: 84,
        blockedAccounts: 12,
        auditEvents24h: 37,
      }),
    );
  },

  async getPresidentSummary(userId: string): Promise<PresidentSummary> {
    return runWithFallback(
      async () => {
        const scope = await getInternalScope(userId);
        if (!scope?.chamberId) {
          return {
            proposalsToReview: 0,
            reportsToReview: 0,
            portfolioCoverage: 0,
            averageProcessingDays: 0,
            chamberName: scope?.chamberName ?? "Portefeuille non assigne",
          };
        }

        const [proposals, reports, categories] = await Promise.all([
          db.proposal.findMany({
            where: { assignedChamberId: scope.chamberId },
            select: { currentStatus: true, createdAt: true, updatedAt: true },
          }),
          db.report.findMany({
            where: { assignedChamberId: scope.chamberId },
            select: { currentStatus: true, createdAt: true, updatedAt: true },
          }),
          db.themeCategory.count({
            where: { chamberId: scope.chamberId, isActive: true },
          }),
        ]);

        const proposalsToReview = proposals.filter(
          (proposal) =>
            proposal.currentStatus === ProposalStatus.RECU ||
            proposal.currentStatus === ProposalStatus.EN_COURS_ANALYSE,
        ).length;
        const reportsToReview = reports.filter((report) => report.currentStatus === ReportStatus.NON_TRAITE).length;
        const processingDurations = [...proposals, ...reports].map((item) =>
          Math.max(
            0,
            Math.round((item.updatedAt.getTime() - item.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
          ),
        );
        const averageProcessingDays =
          processingDurations.length > 0
            ? Math.round(
                processingDurations.reduce((sum, value) => sum + value, 0) / processingDurations.length,
              )
            : 0;

        return {
          proposalsToReview,
          reportsToReview,
          portfolioCoverage: categories,
          averageProcessingDays,
          chamberName: scope.chamberName,
        };
      },
      () => ({
        proposalsToReview: fallbackProposals.filter((row) =>
          ["RECU", "EN_COURS_ANALYSE"].includes(row.status),
        ).length,
        reportsToReview: fallbackReports.filter((row) => row.status === "NON_TRAITE").length,
        portfolioCoverage: new Set(fallbackProposals.map((row) => row.category)).size,
        averageProcessingDays: 8,
        chamberName: "Chambre finances publiques",
      }),
    );
  },

  async listPresidentProposals(userId: string, filters: TableQuery = {}): Promise<ProposalListItem[]> {
    return runWithFallback(
      async () => {
        const scope = await getInternalScope(userId);
        if (!scope?.chamberId) return [];

        const proposals = await db.proposal.findMany({
          where: { assignedChamberId: scope.chamberId },
          orderBy: { updatedAt: "desc" },
          include: { category: true, likes: true, comments: true },
        });

        return proposals
          .map((proposal) => ({
            id: proposal.id,
            title: proposal.titleFr,
            category: proposal.category.nameFr,
            exercise: proposal.exerciseYear,
            status: String(proposal.currentStatus),
            updatedAt: formatDate(proposal.updatedAt),
            likes: proposal.likes.length,
            comments: proposal.comments.length,
          }))
          .filter(
            (proposal) =>
              matchesQuery([proposal.title, proposal.category], filters.q) &&
              matchesStatus(proposal.status, filters.status),
          );
      },
      () =>
        [...fallbackProposals].filter(
          (proposal) =>
            matchesQuery([proposal.title, proposal.category], filters.q) &&
            matchesStatus(proposal.status, filters.status),
        ),
    );
  },

  async listPresidentReports(userId: string, filters: TableQuery = {}): Promise<ReportListItem[]> {
    return runWithFallback(
      async () => {
        const scope = await getInternalScope(userId);
        if (!scope?.chamberId) return [];

        const reports = await db.report.findMany({
          where: { assignedChamberId: scope.chamberId },
          orderBy: { updatedAt: "desc" },
        });

        return reports
          .map((report) => ({
            id: report.id,
            subject: report.subject,
            entity: report.targetEntityName,
            status: String(report.currentStatus),
            updatedAt: formatDate(report.updatedAt),
            acknowledgement: report.acknowledgementNumber,
          }))
          .filter(
            (report) =>
              matchesQuery([report.subject, report.entity, report.acknowledgement], filters.q) &&
              matchesStatus(report.status, filters.status),
          );
      },
      () =>
        [...fallbackReports].filter(
          (report) =>
            matchesQuery([report.subject, report.entity, report.acknowledgement], filters.q) &&
            matchesStatus(report.status, filters.status),
        ),
    );
  },

  async getProposalForPresident(id: string, userId: string) {
    return runWithFallback(
      async () => {
        const scope = await getInternalScope(userId);
        if (!scope?.chamberId) return null;
        const proposal = await db.proposal.findFirst({
          where: { id, assignedChamberId: scope.chamberId },
          include: { category: true, likes: true, comments: true },
        });
        if (!proposal) return null;
        return {
          id: proposal.id,
          title: proposal.titleFr,
          category: proposal.category.nameFr,
          exercise: proposal.exerciseYear,
          status: String(proposal.currentStatus),
          updatedAt: formatDate(proposal.updatedAt),
          likes: proposal.likes.length,
          comments: proposal.comments.length,
        } satisfies ProposalListItem;
      },
      () => fallbackProposals.find((proposal) => proposal.id === id) ?? null,
    );
  },

  async getReportForPresident(id: string, userId: string) {
    return runWithFallback(
      async () => {
        const scope = await getInternalScope(userId);
        if (!scope?.chamberId) return null;
        const report = await db.report.findFirst({
          where: { id, assignedChamberId: scope.chamberId },
        });
        if (!report) return null;
        const linkedProposalId =
          report.currentStatus === ReportStatus.CONVERTI_EN_THEME ? await findLinkedProposalIdForReport(report.id) : null;
        return {
          id: report.id,
          subject: report.subject,
          entity: report.targetEntityName,
          status: String(report.currentStatus),
          updatedAt: formatDate(report.updatedAt),
          acknowledgement: report.acknowledgementNumber,
          linkedProposalId,
        } satisfies ReportListItem;
      },
      () => fallbackReports.find((report) => report.id === id) ?? null,
    );
  },

  async getProposalForRapporteur(id: string, userId?: string) {
    return runWithFallback(
      async () => {
        void userId;
        const proposal = await db.proposal.findFirst({
          where: {
            id,
            OR: [
              {
                transmittedToRapporteurAt: {
                  not: null,
                },
              },
              {
                currentStatus: {
                  in: [
                    ProposalStatus.ACCEPTEE,
                    ProposalStatus.REJETEE,
                    ProposalStatus.NON_ACTUALISEE,
                  ],
                },
              },
            ],
          },
          include: { category: true, likes: true, comments: true },
        });

        if (!proposal) return null;

        return {
          id: proposal.id,
          title: proposal.titleFr,
          category: proposal.category.nameFr,
          exercise: proposal.exerciseYear,
          status: String(proposal.currentStatus),
          updatedAt: formatDate(proposal.updatedAt),
          likes: proposal.likes.length,
          comments: proposal.comments.length,
        } satisfies ProposalListItem;
      },
      () => fallbackProposals.find((proposal) => proposal.id === id) ?? null,
    );
  },

  async registerParticipationUser(input: unknown) {
    const parsed = participationRegistrationSchema.safeParse(input);

    if (!parsed.success) {
      return { error: parsed.error.flatten() } as const;
    }

    return runWithFallback(
      async () => {
        const role = await db.role.findUnique({ where: { code: parsed.data.accountType === "CITIZEN" ? RoleCode.CITIZEN : RoleCode.ORG } });
        if (!role) {
          return {
            error: {
              formErrors: ["Rôle introuvable dans la base."],
              fieldErrors: {},
            },
          } as const;
        }

        const user = await db.user.create({
          data: {
            userType:
              parsed.data.accountType === "CITIZEN"
                ? UserType.CITIZEN
                : UserType.CIVIL_SOCIETY_ORG,
            firstName: parsed.data.firstName,
            lastName: parsed.data.lastName,
            pseudonym: parsed.data.pseudonym,
            email: parsed.data.email,
            passwordHash: hashSync(parsed.data.password, 10),
            organizationName: parsed.data.organizationName || null,
            professionalStatusId: parsed.data.professionalStatusId,
            wilayaId: parsed.data.wilayaId,
            sex: parsed.data.sex as "MALE" | "FEMALE",
            ageRange: parsed.data.ageRange as
              | "UNDER_25"
              | "FROM_25_TO_34"
              | "FROM_35_TO_44"
              | "FROM_45_TO_59"
              | "ABOVE_60",
            accountStatus: AccountStatus.PENDING,
            roles: {
              create: {
                roleId: role.id,
              },
            },
          },
        });

        return {
          data: {
            id: user.id,
            email: user.email,
            accountStatus: String(user.accountStatus),
          },
        } as const;
      },
      () => ({
        data: {
          id: `mock-user-${Date.now()}`,
          email: parsed.data.email,
          accountStatus: "PENDING",
        },
      }),
    );
  },

  async registerReportingUser(input: unknown) {
    const parsed = reportingRegistrationSchema.safeParse(input);

    if (!parsed.success) {
      return { error: parsed.error.flatten() } as const;
    }

    return runWithFallback(
      async () => {
        const role = await db.role.findUnique({ where: { code: parsed.data.accountType === "CITIZEN" ? RoleCode.CITIZEN : RoleCode.ORG } });
        if (!role) {
          return {
            error: {
              formErrors: ["Rôle introuvable dans la base."],
              fieldErrors: {},
            },
          } as const;
        }

        const user = await db.user.create({
          data: {
            userType:
              parsed.data.accountType === "CITIZEN"
                ? UserType.CITIZEN
                : UserType.CIVIL_SOCIETY_ORG,
            firstName: parsed.data.firstName,
            lastName: parsed.data.lastName,
            pseudonym: parsed.data.pseudonym,
            email: parsed.data.email,
            phone: parsed.data.phone,
            nin: parsed.data.nin,
            passwordHash: hashSync(parsed.data.password, 10),
            organizationName: parsed.data.organizationName || null,
            professionalStatusId: parsed.data.professionalStatusId,
            wilayaId: parsed.data.wilayaId,
            sex: parsed.data.sex as "MALE" | "FEMALE",
            ageRange: parsed.data.ageRange as
              | "UNDER_25"
              | "FROM_25_TO_34"
              | "FROM_35_TO_44"
              | "FROM_45_TO_59"
              | "ABOVE_60",
            accountStatus: AccountStatus.PENDING,
            roles: {
              create: {
                roleId: role.id,
              },
            },
          },
        });

        return {
          data: {
            id: user.id,
            email: user.email,
            accountStatus: String(user.accountStatus),
          },
        } as const;
      },
      () => ({
        data: {
          id: `mock-user-${Date.now()}`,
          email: parsed.data.email,
          accountStatus: "PENDING",
        },
      }),
    );
  },

  async getProfile(userId?: string | null): Promise<ProfileItem | null> {
    return runWithFallback(
      async () => {
        const resolvedUserId = await resolveUserId(userId);
        if (!resolvedUserId) return null;
        const user = await db.user.findUnique({ where: { id: resolvedUserId } });
        if (!user) return null;

        return {
          id: user.id,
          phone: user.phone ?? "",
          pseudonym: user.pseudonym,
          email: user.email,
          accountStatus: String(user.accountStatus),
        };
      },
      () => ({
        id: "citizen-1",
        phone: "0550000001",
        pseudonym: "nadia-citoyenne",
        email: "citizen@cdc.dz",
        accountStatus: "ACTIVE",
      }),
    );
  },

  async updateProfile(input: unknown, userId?: string | null) {
    const parsed = profileUpdateSchema.safeParse(input);

    if (!parsed.success) {
      return { error: parsed.error.flatten() } as const;
    }

    return runWithFallback(
      async () => {
        const resolvedUserId = await resolveUserId(userId);
        if (!resolvedUserId) {
          return {
            error: {
              formErrors: ["Aucun profil citoyen disponible."],
              fieldErrors: {},
            },
          } as const;
        }

        const user = await db.user.update({
          where: { id: resolvedUserId },
          data: {
            phone: parsed.data.phone,
            pseudonym: parsed.data.pseudonym,
            ...(parsed.data.password
              ? { passwordHash: hashSync(parsed.data.password, 10) }
              : {}),
          },
        });

        return {
          data: {
            id: user.id,
            phone: user.phone ?? "",
            pseudonym: user.pseudonym,
            email: user.email,
            accountStatus: String(user.accountStatus),
          } satisfies ProfileItem,
        } as const;
      },
      () => ({
        data: {
          id: "citizen-1",
          phone: parsed.data.phone,
          pseudonym: parsed.data.pseudonym,
          email: "citizen@cdc.dz",
          accountStatus: "ACTIVE",
        } satisfies ProfileItem,
      }),
    );
  },

  async listAuditLogs(filters: TableQuery = {}): Promise<AuditLogItem[]> {
    return runWithFallback(
      async () => {
        const logs = await db.auditLog.findMany({
          include: {
            actorUser: true,
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        });

        return logs
          .map((log) => ({
            id: log.id,
            date: log.createdAt.toISOString().replace("T", " ").slice(0, 16),
            actor: log.actorUser?.email ?? "Système",
            action: log.action,
            resource: `${log.resourceType}:${log.resourceId}`,
          }))
          .filter(
            (log) =>
              matchesDateRange(new Date(log.date.replace(" ", "T")), filters) &&
              matchesQuery([log.actor, log.action, log.resource, log.date], filters.q) &&
              matchesAction(log.action, filters.action),
          );
      },
      () =>
        [
          {
            id: "audit-1",
            date: "2026-03-30 09:12",
            actor: "admin@cdc.dz",
            action: "BLOCK_ACCOUNT",
            resource: "user:usr-3",
          },
          {
            id: "audit-2",
            date: "2026-03-30 10:02",
            actor: "president@cdc.dz",
            action: "READ_REPORT",
            resource: "report:SIG-2026-0012",
          },
        ].filter(
          (log) =>
            matchesDateRange(new Date(log.date.replace(" ", "T")), filters) &&
            matchesQuery([log.actor, log.action, log.resource, log.date], filters.q) &&
            matchesAction(log.action, filters.action),
        ),
    );
  },

  async getModerationSummary(): Promise<ModerationSummary> {
    return runWithFallback(
      async () => {
        const [blockedAccounts, pendingAccounts, suspiciousSignals, recentLogs] = await Promise.all([
          db.user.count({ where: { accountStatus: "BLOCKED" } }),
          db.user.count({ where: { accountStatus: "PENDING" } }),
          db.report.count({ where: { currentStatus: "REJETE" } }),
          db.auditLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 4,
          }),
        ]);

        return {
          blockedAccounts,
          pendingAccounts,
          suspiciousSignals,
          recentActions: recentLogs.map(
            (log) => `${log.action} · ${log.resourceType}:${log.resourceId}`,
          ),
        };
      },
      () => ({
        blockedAccounts: 2,
        pendingAccounts: 4,
        suspiciousSignals: 3,
        recentActions: [
          "BLOCK_ACCOUNT · user:usr-3",
          "UPDATE_REPORT_STATUS · report:SIG-2026-0012",
          "UPDATE_PROPOSAL_STATUS · proposal:theme-2027-001",
          "LOGIN_FAILED · auth:citizen@cdc.dz",
        ],
      }),
    );
  },

  async getStatsSeries(filters: TableQuery = {}): Promise<StatsSeriesItem[]> {
    return runWithFallback(
      async () => {
        const proposals = await db.proposal.findMany({
          select: { createdAt: true, currentStatus: true },
        });
        const reports = await db.report.findMany({
          select: { createdAt: true, currentStatus: true },
        });

        const fromDate = parseFilterDate(filters.from) ?? new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);
        const toDate = parseFilterDate(filters.to, true) ?? new Date();
        const cursor = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
        const buckets: Array<{ name: string; year: number; month: number; propositions: number; signalements: number }> = [];

        while (cursor <= toDate) {
          buckets.push({
            name: cursor.toLocaleString("fr-FR", { month: "short" }),
            year: cursor.getFullYear(),
            month: cursor.getMonth(),
            propositions: 0,
            signalements: 0,
          });
          cursor.setMonth(cursor.getMonth() + 1);
        }

        proposals
          .filter(
            (item) =>
              matchesDateRange(item.createdAt, filters) &&
              (!filters.status || String(item.currentStatus) === filters.status),
          )
          .forEach((item) => {
            const target = buckets.find(
              (entry) => entry.year === item.createdAt.getFullYear() && entry.month === item.createdAt.getMonth(),
            );
            if (target) target.propositions += 1;
          });

        reports
          .filter(
            (item) =>
              matchesDateRange(item.createdAt, filters) &&
              (!filters.status || String(item.currentStatus) === filters.status),
          )
          .forEach((item) => {
            const target = buckets.find(
              (entry) => entry.year === item.createdAt.getFullYear() && entry.month === item.createdAt.getMonth(),
            );
            if (target) target.signalements += 1;
          });

        return buckets.map(({ year, month, ...rest }) => {
          void year;
          void month;
          return rest;
        });
      },
      () => {
        const fromDate = parseFilterDate(filters.from) ?? new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);
        const toDate = parseFilterDate(filters.to, true) ?? new Date();
        const cursor = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
        const buckets: Array<{ name: string; year: number; month: number; propositions: number; signalements: number }> = [];

        while (cursor <= toDate) {
          buckets.push({
            name: cursor.toLocaleString("fr-FR", { month: "short" }),
            year: cursor.getFullYear(),
            month: cursor.getMonth(),
            propositions: 0,
            signalements: 0,
          });
          cursor.setMonth(cursor.getMonth() + 1);
        }

        fallbackProposals
          .filter(
            (proposal) =>
              matchesDateRange(new Date(proposal.updatedAt), filters) &&
              matchesStatus(proposal.status, filters.status),
          )
          .forEach((proposal) => {
            const createdAt = new Date(proposal.updatedAt);
            const target = buckets.find(
              (entry) => entry.year === createdAt.getFullYear() && entry.month === createdAt.getMonth(),
            );
            if (target) target.propositions += 1;
          });

        fallbackReports
          .filter(
            (report) =>
              matchesDateRange(new Date(report.updatedAt), filters) &&
              matchesStatus(report.status, filters.status),
          )
          .forEach((report) => {
            const createdAt = new Date(report.updatedAt);
            const target = buckets.find(
              (entry) => entry.year === createdAt.getFullYear() && entry.month === createdAt.getMonth(),
            );
            if (target) target.signalements += 1;
          });

        return buckets.map(({ year, month, ...rest }) => {
          void year;
          void month;
          return rest;
        });
      },
    );
  },

  async getRapporteurSummary(userId?: string): Promise<RapporteurSummary> {
    return runWithFallback(
      async () => {
        void userId;
        const transmittedWhere = {
          transmittedToRapporteurAt: {
            not: null,
          },
        } as const;
        const [transmitted, pendingDecision, accepted, rejected, actionPlanCount, decidedProposals] = await Promise.all([
          db.proposal.count({
            where: transmittedWhere,
          }),
          db.proposal.count({
            where: {
              ...transmittedWhere,
              finalDecisionAt: null,
            },
          }),
          db.proposal.count({
            where: {
              currentStatus: ProposalStatus.ACCEPTEE,
            },
          }),
          db.proposal.count({
            where: {
              currentStatus: ProposalStatus.REJETEE,
            },
          }),
          db.proposal.count({
            where: {
              currentStatus: ProposalStatus.ACCEPTEE,
            },
          }),
          db.proposal.findMany({
            where: {
              finalDecisionAt: {
                not: null,
              },
              transmittedToRapporteurAt: {
                not: null,
              },
            },
            select: {
              transmittedToRapporteurAt: true,
              finalDecisionAt: true,
            },
          }),
        ]);

        const averageDecisionDays =
          decidedProposals.length > 0
            ? Math.round(
                decidedProposals.reduce((sum, proposal) => {
                  const transmittedAt = proposal.transmittedToRapporteurAt?.getTime() ?? 0;
                  const finalDecisionAt = proposal.finalDecisionAt?.getTime() ?? transmittedAt;
                  return sum + Math.max(0, Math.round((finalDecisionAt - transmittedAt) / (1000 * 60 * 60 * 24)));
                }, 0) / decidedProposals.length,
              )
            : 0;

        return { transmitted, pendingDecision, accepted, rejected, actionPlanCount, averageDecisionDays };
      },
      () => ({
        transmitted: fallbackProposals.length,
        pendingDecision: fallbackProposals.filter((row) =>
          ["RECU", "EN_COURS_ANALYSE"].includes(row.status),
        ).length,
        accepted: fallbackProposals.filter((row) => row.status === "ACCEPTEE").length,
        rejected: fallbackProposals.filter((row) => row.status === "REJETEE").length,
        actionPlanCount: fallbackProposals.filter((row) => row.status === "ACCEPTEE").length,
        averageDecisionDays: 6,
      }),
    );
  },

  async listRapporteurProposals(userId?: string, filters: TableQuery = {}): Promise<ProposalListItem[]> {
    return runWithFallback(
      async () => {
        void userId;
        const proposals = await db.proposal.findMany({
          where: {
            OR: [
              {
                transmittedToRapporteurAt: {
                  not: null,
                },
              },
              {
                currentStatus: {
                  in: [
                    ProposalStatus.ACCEPTEE,
                    ProposalStatus.REJETEE,
                    ProposalStatus.NON_ACTUALISEE,
                  ],
                },
              },
            ],
          },
          orderBy: { updatedAt: "desc" },
          include: {
            category: true,
            likes: true,
            comments: true,
          },
        });

        return proposals
          .map((proposal) => ({
            id: proposal.id,
            title: proposal.titleFr,
            category: proposal.category.nameFr,
            exercise: proposal.exerciseYear,
            status: String(proposal.currentStatus),
            updatedAt: formatDate(proposal.updatedAt),
            likes: proposal.likes.length,
            comments: proposal.comments.length,
          }))
          .filter(
            (proposal) =>
              matchesQuery([proposal.title, proposal.category], filters.q) &&
              matchesStatus(proposal.status, filters.status),
          );
      },
      () =>
        [...fallbackProposals]
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
          .filter(
            (proposal) =>
              matchesQuery([proposal.title, proposal.category], filters.q) &&
              matchesStatus(proposal.status, filters.status),
          ),
    );
  },

  async listActionPlan(userId?: string): Promise<ActionPlanItem[]> {
    return runWithFallback(
      async () => {
        void userId;
        const proposals = await db.proposal.findMany({
          where: {
            currentStatus: ProposalStatus.ACCEPTEE,
          },
          orderBy: { updatedAt: "desc" },
          include: {
            category: true,
          },
        });

        return proposals.map((proposal) => ({
          id: proposal.id,
          theme: proposal.titleFr,
          exercise: String(proposal.exerciseYear),
          source: proposal.transmittedToRapporteurAt ? "Transmission rapporteur" : proposal.category.nameFr,
          state: "Intégré",
        }));
      },
      () =>
        fallbackProposals
          .filter((row) => row.status === "ACCEPTEE")
          .map((row) => ({
            id: row.id,
            theme: row.title,
            exercise: String(row.exercise),
            source: "Transmission rapporteur",
            state: "Intégré",
          })),
    );
  },
};
