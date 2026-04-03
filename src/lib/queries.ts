import type { TableQuery } from "@/lib/api-types";
import { repository } from "@/lib/repository";

export async function getDashboardOverview(filters: TableQuery = {}) {
  return repository.getOverview(filters);
}

export async function getCitizenProposals(userId?: string | null) {
  return repository.listProposals(userId);
}

export async function getPublicThemes(filters: TableQuery = {}) {
  return repository.listPublicThemes(filters);
}

export async function getPublicTheme(id: string) {
  return repository.getPublicTheme(id);
}

export async function getCitizenReports(userId?: string | null) {
  return repository.listReports(userId);
}

export async function getPublishedReports(filters: TableQuery = {}) {
  return repository.listPublishedReports(filters);
}

export async function getPresidentProposals(userId: string, filters: TableQuery = {}) {
  return repository.listPresidentProposals(userId, filters);
}

export async function getPresidentReports(userId: string, filters: TableQuery = {}) {
  return repository.listPresidentReports(userId, filters);
}

export async function getPresidentSummary(userId: string) {
  return repository.getPresidentSummary(userId);
}

export async function getUserNotifications(userId?: string | null) {
  return repository.listNotifications(userId);
}

export async function getAdminUsers(filters: TableQuery = {}) {
  return repository.listUsers(filters);
}

export async function getAdminSummary() {
  return repository.getAdminSummary();
}

export async function getAdminUser(id: string) {
  return repository.getUser(id);
}

export async function getSettingGroup(setting: keyof typeof import("@/lib/content").settingsCatalog) {
  return repository.getSetting(setting);
}

export async function getMappings() {
  return repository.listMappings();
}

export async function getInternalUsers(filters: TableQuery = {}) {
  return repository.listInternalUsers(filters);
}

export async function getAuditLogs(filters: TableQuery = {}) {
  return repository.listAuditLogs(filters);
}

export async function getModerationSummary() {
  return repository.getModerationSummary();
}

export async function getStatsSeries(filters: TableQuery = {}) {
  return repository.getStatsSeries(filters);
}

export async function getRapporteurSummary(userId?: string) {
  return repository.getRapporteurSummary(userId);
}

export async function getRapporteurProposals(userId?: string, filters: TableQuery = {}) {
  return repository.listRapporteurProposals(userId, filters);
}

export async function getActionPlan(userId?: string) {
  return repository.listActionPlan(userId);
}

export async function getProfile(userId?: string | null) {
  return repository.getProfile(userId);
}
