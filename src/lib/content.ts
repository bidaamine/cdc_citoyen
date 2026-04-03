import {
  Bell,
  BookOpen,
  Building2,
  FileBarChart2,
  FolderClock,
  Gavel,
  HandHelping,
  LayoutDashboard,
  MessageSquareWarning,
  Settings,
  Shield,
  UserCircle2,
} from "lucide-react";

export const publicNav = [
  { href: "/", label: "Accueil" },
  { href: "/participation", label: "Participation citoyenne" },
  { href: "/signalement", label: "Signalement" },
  { href: "/themes", label: "Thèmes" },
  { href: "/reports", label: "Rapports" },
  { href: "/stats", label: "Statistiques" },
];

export const citizenNav = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/proposals", label: "Mes propositions", icon: HandHelping },
  { href: "/dashboard/reports", label: "Mes signalements", icon: MessageSquareWarning },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profil", icon: UserCircle2 },
];

export const presidentNav = [
  { href: "/backoffice/president", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/backoffice/president/proposals", label: "Propositions", icon: HandHelping },
  { href: "/backoffice/president/reports", label: "Signalements", icon: MessageSquareWarning },
];

export const rapporteurNav = [
  { href: "/backoffice/rapporteur", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/backoffice/rapporteur/proposals", label: "Propositions", icon: HandHelping },
  { href: "/backoffice/rapporteur/action-plan", label: "Plan d'action", icon: BookOpen },
];

export const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Comptes citoyens", icon: UserCircle2 },
  { href: "/admin/internal-users", label: "Profils internes", icon: Building2 },
  { href: "/admin/mappings", label: "Mappings", icon: FolderClock },
  { href: "/admin/stats", label: "Statistiques", icon: FileBarChart2 },
  { href: "/admin/moderation", label: "Modération", icon: Shield },
  { href: "/admin/audit-logs", label: "Audit", icon: Gavel },
  { href: "/admin/settings/wilayas", label: "Paramètres", icon: Settings },
];

export const publicStats = [
  { label: "Propositions reçues", value: "12 480", trend: "+14%" },
  { label: "Signalements enregistrés", value: "1 324", trend: "+9%" },
  { label: "Thèmes retenus", value: "286", trend: "+6%" },
  { label: "Rapports publiés", value: "91", trend: "+21%" },
];

export const proposalRows = [
  {
    id: "theme-2027-001",
    title: "Audit des services d'urgence hospitaliers",
    category: "Santé publique",
    exercise: "2027",
    status: "EN_COURS_ANALYSE",
    updatedAt: "2026-03-18",
    likes: 241,
    comments: 34,
  },
  {
    id: "theme-2027-014",
    title: "Transparence des marchés de transport urbain",
    category: "Transport",
    exercise: "2027",
    status: "ACCEPTEE",
    updatedAt: "2026-03-22",
    likes: 189,
    comments: 28,
  },
  {
    id: "theme-2027-019",
    title: "Gestion des déchets ménagers par wilaya",
    category: "Collectivités locales",
    exercise: "2027",
    status: "RECU",
    updatedAt: "2026-03-28",
    likes: 92,
    comments: 11,
  },
];

export const reportRows = [
  {
    id: "SIG-2026-0007",
    subject: "Suspicion d'irrégularité sur un marché local",
    entity: "Assemblée populaire communale",
    status: "NON_TRAITE",
    updatedAt: "2026-03-17",
    acknowledgement: "AR-2026-00421",
  },
  {
    id: "SIG-2026-0012",
    subject: "Anomalies sur la gestion de fournitures",
    entity: "Administration centrale",
    status: "CONVERTI_EN_THEME",
    updatedAt: "2026-03-25",
    acknowledgement: "AR-2026-00496",
  },
];

export const notifications = [
  {
    title: "Votre proposition a été transmise au rapporteur général",
    body: "Le dossier theme-2027-001 avance dans le circuit institutionnel.",
    date: "2026-03-18",
  },
  {
    title: "Compte validé pour le module participation",
    body: "Vous pouvez déposer des propositions jusqu'au 31 mars.",
    date: "2026-03-05",
  },
  {
    title: "Accusé de réception généré",
    body: "Le signalement SIG-2026-0012 a reçu le numéro AR-2026-00496.",
    date: "2026-03-25",
  },
];

export const chartSeries = [
  { name: "Jan", propositions: 310, signalements: 41 },
  { name: "Fév", propositions: 502, signalements: 59 },
  { name: "Mar", propositions: 891, signalements: 88 },
  { name: "Avr", propositions: 203, signalements: 47 },
  { name: "Mai", propositions: 164, signalements: 39 },
  { name: "Juin", propositions: 142, signalements: 32 },
];

export const settingsCatalog = {
  wilayas: {
    title: "Wilayas",
    description: "Référentiel territorial utilisé dans les comptes et les statistiques.",
    rows: ["Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna"],
  },
  "professional-statuses": {
    title: "Statuts professionnels",
    description: "Valeurs proposées dans les formulaires d'inscription.",
    rows: ["Fonctionnaire", "Profession libérale", "Étudiant", "Retraité", "Autre"],
  },
  "theme-categories": {
    title: "Catégories de thèmes",
    description: "Catégories pilotant l'affectation aux chambres compétentes.",
    rows: ["Santé publique", "Éducation", "Transport", "Collectivités locales"],
  },
  "report-categories": {
    title: "Catégories de signalement",
    description: "Classification utilisée pour le filtrage et les statistiques.",
    rows: ["Financier", "Gouvernance", "Marchés publics", "Patrimoine"],
  },
  "central-administrations": {
    title: "Administrations centrales",
    description: "Entités centrales raccordées à une chambre de traitement.",
    rows: ["Ministère de la Santé", "Ministère des Finances", "Ministère des Transports"],
  },
  "local-collectivities": {
    title: "Collectivités locales",
    description: "Collectivités locales paramétrables et liées à une wilaya.",
    rows: ["APC Alger Centre", "APW Oran", "APC Constantine"],
  },
} as const;
