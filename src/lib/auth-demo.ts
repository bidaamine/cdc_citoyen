export type DemoRole =
  | "CITIZEN"
  | "ORG"
  | "PRESIDENT"
  | "RAPPORTEUR_GENERAL"
  | "ADMIN";

export const demoUsers = [
  {
    id: "citizen-1",
    name: "Nadia Rahmani",
    email: "citizen@cdc.dz",
    password: "demo12345",
    role: "CITIZEN" as DemoRole,
    accountStatus: "ACTIVE",
  },
  {
    id: "org-1",
    name: "Forum des associations",
    email: "org@cdc.dz",
    password: "demo12345",
    role: "ORG" as DemoRole,
    accountStatus: "PENDING",
  },
  {
    id: "president-1",
    name: "Président Chambre 2",
    email: "president@cdc.dz",
    password: "demo12345",
    role: "PRESIDENT" as DemoRole,
    accountStatus: "ACTIVE",
  },
  {
    id: "rapporteur-1",
    name: "Rapporteur Général",
    email: "rapporteur@cdc.dz",
    password: "demo12345",
    role: "RAPPORTEUR_GENERAL" as DemoRole,
    accountStatus: "ACTIVE",
  },
  {
    id: "admin-1",
    name: "Administrateur CDC",
    email: "admin@cdc.dz",
    password: "demo12345",
    role: "ADMIN" as DemoRole,
    accountStatus: "ACTIVE",
  },
];

export function resolveDashboard(role: DemoRole) {
  if (role === "ADMIN") return "/admin";
  if (role === "PRESIDENT") return "/backoffice/president";
  if (role === "RAPPORTEUR_GENERAL") return "/backoffice/rapporteur";
  return "/dashboard";
}
