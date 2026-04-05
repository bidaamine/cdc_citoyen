export type ProposalListItem = {
  id: string;
  title: string;
  category: string;
  exercise: number;
  status: string;
  updatedAt: string;
  likes: number;
  comments: number;
};

export type PublicThemeDetail = {
  id: string;
  title: string;
  titleAr: string;
  descriptionFr: string;
  descriptionAr: string;
  category: string;
  exercise: number;
  status: string;
  updatedAt: string;
  likes: number;
  comments: number;
  viewerHasLiked?: boolean;
  discussion: SuggestionCommentItem[];
};

export type SuggestionCommentItem = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

export type ReportListItem = {
  id: string;
  subject: string;
  entity: string;
  status: string;
  updatedAt: string;
  acknowledgement: string;
  linkedProposalId?: string | null;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  date: string;
  channel: "IN_APP" | "EMAIL";
  isRead: boolean;
  relatedHref?: string;
  relatedLabel?: string;
};

export type OverviewStat = {
  key?: "proposals_received" | "reports_received" | "accepted_themes" | "published_reports";
  label: string;
  value: string;
  trend?: string;
};

export type OverviewResponse = {
  publicStats: OverviewStat[];
  proposalsCount: number;
  reportsCount: number;
  notificationsCount: number;
};

export type UserAccountItem = {
  id: string;
  name: string;
  email: string;
  status: string;
  userType: string;
  pseudonym: string;
};

export type SettingRecord = {
  id: string;
  label: string;
};

export type SettingGroup = {
  title: string;
  description: string;
  rows: SettingRecord[];
};

export type MappingItem = {
  source: string;
  value: string;
  chamber: string;
};

export type InternalUserItem = {
  id: string;
  name: string;
  role: string;
  chamber: string;
  status: string;
};

export type AuditLogItem = {
  id: string;
  date: string;
  actor: string;
  action: string;
  resource: string;
};

export type ModerationSummary = {
  blockedAccounts: number;
  pendingAccounts: number;
  suspiciousSignals: number;
  recentActions: string[];
};

export type StatsSeriesItem = {
  name: string;
  propositions: number;
  signalements: number;
};

export type ActionPlanItem = {
  id: string;
  theme: string;
  exercise: string;
  source: string;
  state: string;
};

export type PublishedReportItem = {
  id: string;
  title: string;
  exercise: string;
  category: string;
  publishedAt: string;
  proposalId: string;
};

export type ReportSubjectListItem = {
  id: string;
  title: string;
  category: string;
  exercise: number;
  status: string;
  updatedAt: string;
  likes: number;
  comments: number;
};

export type PublicReportSubjectDetail = {
  id: string;
  title: string;
  titleAr: string;
  descriptionFr: string;
  descriptionAr: string;
  category: string;
  exercise: number;
  status: string;
  updatedAt: string;
  likes: number;
  comments: number;
  viewerHasLiked?: boolean;
  discussion: SuggestionCommentItem[];
};

export type RapporteurSummary = {
  transmitted: number;
  pendingDecision: number;
  accepted: number;
  rejected: number;
  actionPlanCount: number;
  averageDecisionDays: number;
};

export type AdminSummary = {
  totalUsers: number;
  pendingAccounts: number;
  blockedAccounts: number;
  auditEvents24h: number;
};

export type PresidentSummary = {
  proposalsToReview: number;
  reportsToReview: number;
  portfolioCoverage: number;
  averageProcessingDays: number;
  chamberName: string;
};

export type ProfileItem = {
  id: string;
  phone: string;
  pseudonym: string;
  email: string;
  accountStatus: string;
};

export type TableQuery = {
  q?: string;
  status?: string;
  action?: string;
  from?: string;
  to?: string;
  category?: string;
  exercise?: string;
};
