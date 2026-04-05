import {
  AgeRange,
  AccountStatus,
  NotificationChannel,
  PrismaClient,
  ProposalStatus,
  ReportStatus,
  RoleCode,
  Sex,
  UserType,
} from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const chamberFinance = await prisma.chamber.upsert({
    where: { id: "seed-chamber-finance" },
    update: {
      nameFr: "Chambre finances publiques",
      nameAr: "غرفة المالية العمومية",
      scopeType: "FINANCE",
    },
    create: {
      id: "seed-chamber-finance",
      nameFr: "Chambre finances publiques",
      nameAr: "غرفة المالية العمومية",
      scopeType: "FINANCE",
    },
  });

  const chamberLocal = await prisma.chamber.upsert({
    where: { id: "seed-chamber-local" },
    update: {
      nameFr: "Chambre collectivites locales",
      nameAr: "غرفة الجماعات المحلية",
      scopeType: "LOCAL",
    },
    create: {
      id: "seed-chamber-local",
      nameFr: "Chambre collectivites locales",
      nameAr: "غرفة الجماعات المحلية",
      scopeType: "LOCAL",
    },
  });

  for (const role of [
    { code: RoleCode.CITIZEN, label: "Citoyen" },
    { code: RoleCode.ORG, label: "Organisation societe civile" },
    { code: RoleCode.PRESIDENT, label: "President de chambre" },
    { code: RoleCode.RAPPORTEUR_GENERAL, label: "Rapporteur general" },
    { code: RoleCode.ADMIN, label: "Administrateur" },
  ]) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: { label: role.label },
      create: role,
    });
  }

  for (const status of [
    { id: "prof-1", nameFr: "Fonctionnaire", nameAr: "موظف" },
    { id: "prof-2", nameFr: "Profession liberale", nameAr: "مهنة حرة" },
    { id: "prof-3", nameFr: "Etudiant", nameAr: "طالب" },
    { id: "prof-4", nameFr: "Retraite", nameAr: "متقاعد" },
    { id: "prof-5", nameFr: "Entrepreneur", nameAr: "entrepreneur" },
    { id: "prof-6", nameFr: "Sans emploi", nameAr: "sans-emploi" },
  ]) {
    await prisma.professionalStatus.upsert({
      where: { id: status.id },
      update: { nameFr: status.nameFr, nameAr: status.nameAr, isActive: true },
      create: { ...status, isActive: true },
    });
  }

  for (const wilaya of [
    { id: "wil-16", code: "16", nameFr: "Alger", nameAr: "الجزائر" },
    { id: "wil-31", code: "31", nameFr: "Oran", nameAr: "وهران" },
    { id: "wil-25", code: "25", nameFr: "Constantine", nameAr: "قسنطينة" },
    { id: "wil-19", code: "19", nameFr: "Setif", nameAr: "سطيف" },
    { id: "wil-23", code: "23", nameFr: "Annaba", nameAr: "annaba" },
  ]) {
    await prisma.wilaya.upsert({
      where: { code: wilaya.code },
      update: { nameFr: wilaya.nameFr, nameAr: wilaya.nameAr, isActive: true },
      create: { ...wilaya, isActive: true },
    });
  }

  const themeHealth = await prisma.themeCategory.upsert({
    where: { id: "theme-health" },
    update: {
      nameFr: "Sante publique",
      nameAr: "الصحة العمومية",
      chamberId: chamberFinance.id,
      isActive: true,
    },
    create: {
      id: "theme-health",
      nameFr: "Sante publique",
      nameAr: "الصحة العمومية",
      chamberId: chamberFinance.id,
      isActive: true,
    },
  });

  const themeTransport = await prisma.themeCategory.upsert({
    where: { id: "theme-transport" },
    update: {
      nameFr: "Transport public",
      nameAr: "النقل العمومي",
      chamberId: chamberFinance.id,
      isActive: true,
    },
    create: {
      id: "theme-transport",
      nameFr: "Transport public",
      nameAr: "النقل العمومي",
      chamberId: chamberFinance.id,
      isActive: true,
    },
  });

  const themeLocal = await prisma.themeCategory.upsert({
    where: { id: "theme-local" },
    update: {
      nameFr: "Collectivites locales",
      nameAr: "الجماعات المحلية",
      chamberId: chamberLocal.id,
      isActive: true,
    },
    create: {
      id: "theme-local",
      nameFr: "Collectivites locales",
      nameAr: "الجماعات المحلية",
      chamberId: chamberLocal.id,
      isActive: true,
    },
  });

  const reportFinance = await prisma.reportCategory.upsert({
    where: { id: "report-finance" },
    update: {
      nameFr: "Irregularite financiere",
      nameAr: "مخالفة مالية",
      isActive: true,
    },
    create: {
      id: "report-finance",
      nameFr: "Irregularite financiere",
      nameAr: "مخالفة مالية",
      isActive: true,
    },
  });

  const reportGovernance = await prisma.reportCategory.upsert({
    where: { id: "report-governance" },
    update: {
      nameFr: "Gouvernance",
      nameAr: "الحوكمة",
      isActive: true,
    },
    create: {
      id: "report-governance",
      nameFr: "Gouvernance",
      nameAr: "الحوكمة",
      isActive: true,
    },
  });

  await prisma.reportCategory.upsert({
    where: { id: "report-public-procurement" },
    update: {
      nameFr: "Marches publics",
      nameAr: "marches-publics",
      isActive: true,
    },
    create: {
      id: "report-public-procurement",
      nameFr: "Marches publics",
      nameAr: "marches-publics",
      isActive: true,
    },
  });

  await prisma.centralAdministration.upsert({
    where: { id: "central-health" },
    update: {
      nameFr: "Ministere de la Sante",
      nameAr: "وزارة الصحة",
      chamberId: chamberFinance.id,
      isActive: true,
    },
    create: {
      id: "central-health",
      nameFr: "Ministere de la Sante",
      nameAr: "وزارة الصحة",
      chamberId: chamberFinance.id,
      isActive: true,
    },
  });

  await prisma.centralAdministration.upsert({
    where: { id: "central-transport" },
    update: {
      nameFr: "Ministere des Transports",
      nameAr: "وزارة النقل",
      chamberId: chamberFinance.id,
      isActive: true,
    },
    create: {
      id: "central-transport",
      nameFr: "Ministere des Transports",
      nameAr: "وزارة النقل",
      chamberId: chamberFinance.id,
      isActive: true,
    },
  });

  await prisma.centralAdministration.upsert({
    where: { id: "central-finance" },
    update: {
      nameFr: "Ministere des Finances",
      nameAr: "ministere-finances",
      chamberId: chamberFinance.id,
      isActive: true,
    },
    create: {
      id: "central-finance",
      nameFr: "Ministere des Finances",
      nameAr: "ministere-finances",
      chamberId: chamberFinance.id,
      isActive: true,
    },
  });

  await prisma.localCollectivity.upsert({
    where: { id: "local-alger-centre" },
    update: {
      nameFr: "APC Alger Centre",
      nameAr: "بلدية الجزائر الوسطى",
      wilayaId: "wil-16",
      chamberId: chamberLocal.id,
      isActive: true,
    },
    create: {
      id: "local-alger-centre",
      nameFr: "APC Alger Centre",
      nameAr: "بلدية الجزائر الوسطى",
      wilayaId: "wil-16",
      chamberId: chamberLocal.id,
      isActive: true,
    },
  });

  await prisma.localCollectivity.upsert({
    where: { id: "local-oran-centre" },
    update: {
      nameFr: "APC Oran Centre",
      nameAr: "apc-oran-centre",
      wilayaId: "wil-31",
      chamberId: chamberLocal.id,
      isActive: true,
    },
    create: {
      id: "local-oran-centre",
      nameFr: "APC Oran Centre",
      nameAr: "apc-oran-centre",
      wilayaId: "wil-31",
      chamberId: chamberLocal.id,
      isActive: true,
    },
  });

  const userSeeds = [
    {
      id: "user-citizen",
      email: "citizen@cdc.dz",
      firstName: "Nadia",
      lastName: "Rahmani",
      pseudonym: "nadia-citoyenne",
      userType: UserType.CITIZEN,
      accountStatus: AccountStatus.ACTIVE,
      roleCode: RoleCode.CITIZEN,
      chamberId: null,
      phone: "0550000001",
      nin: "111111111111111111",
      wilayaId: "wil-16",
      professionalStatusId: "prof-1",
      sex: Sex.FEMALE,
      ageRange: AgeRange.FROM_25_TO_34,
      emailVerifiedAt: new Date("2026-01-08T08:00:00.000Z"),
      twoFactorEnabled: false,
    },
    {
      id: "user-org",
      email: "org@cdc.dz",
      firstName: "Forum",
      lastName: "Associatif",
      pseudonym: "forum-associations",
      userType: UserType.CIVIL_SOCIETY_ORG,
      accountStatus: AccountStatus.PENDING,
      roleCode: RoleCode.ORG,
      chamberId: null,
      phone: "0550000002",
      nin: "222222222222222222",
      organizationName: "Forum des associations",
      wilayaId: "wil-31",
      professionalStatusId: "prof-2",
      sex: Sex.MALE,
      ageRange: AgeRange.FROM_35_TO_44,
      emailVerifiedAt: null,
      twoFactorEnabled: false,
    },
    {
      id: "user-president-finance",
      email: "president@cdc.dz",
      firstName: "Karim",
      lastName: "Bensaid",
      pseudonym: "president-finance",
      userType: UserType.INTERNAL,
      accountStatus: AccountStatus.ACTIVE,
      roleCode: RoleCode.PRESIDENT,
      chamberId: chamberFinance.id,
      phone: "0550000003",
      nin: "333333333333333333",
      wilayaId: "wil-16",
      professionalStatusId: "prof-1",
      sex: Sex.MALE,
      ageRange: AgeRange.FROM_45_TO_59,
      emailVerifiedAt: new Date("2025-12-20T08:00:00.000Z"),
      twoFactorEnabled: true,
    },
    {
      id: "user-president-local",
      email: "president-local@cdc.dz",
      firstName: "Salima",
      lastName: "Mansouri",
      pseudonym: "president-local",
      userType: UserType.INTERNAL,
      accountStatus: AccountStatus.ACTIVE,
      roleCode: RoleCode.PRESIDENT,
      chamberId: chamberLocal.id,
      phone: "0550000006",
      nin: "666666666666666666",
      wilayaId: "wil-25",
      professionalStatusId: "prof-1",
      sex: Sex.FEMALE,
      ageRange: AgeRange.FROM_45_TO_59,
      emailVerifiedAt: new Date("2025-12-21T08:00:00.000Z"),
      twoFactorEnabled: true,
    },
    {
      id: "user-rapporteur",
      email: "rapporteur@cdc.dz",
      firstName: "Yacine",
      lastName: "Merabet",
      pseudonym: "rapporteur-general",
      userType: UserType.INTERNAL,
      accountStatus: AccountStatus.ACTIVE,
      roleCode: RoleCode.RAPPORTEUR_GENERAL,
      chamberId: chamberFinance.id,
      phone: "0550000004",
      nin: "444444444444444444",
      wilayaId: "wil-16",
      professionalStatusId: "prof-1",
      sex: Sex.MALE,
      ageRange: AgeRange.FROM_35_TO_44,
      emailVerifiedAt: new Date("2025-12-22T08:00:00.000Z"),
      twoFactorEnabled: true,
    },
    {
      id: "user-admin",
      email: "admin@cdc.dz",
      firstName: "Admin",
      lastName: "CDC",
      pseudonym: "admin-cdc",
      userType: UserType.INTERNAL,
      accountStatus: AccountStatus.ACTIVE,
      roleCode: RoleCode.ADMIN,
      chamberId: chamberFinance.id,
      phone: "0550000005",
      nin: "555555555555555555",
      wilayaId: "wil-16",
      professionalStatusId: "prof-1",
      sex: Sex.MALE,
      ageRange: AgeRange.FROM_35_TO_44,
      emailVerifiedAt: new Date("2025-12-19T08:00:00.000Z"),
      twoFactorEnabled: true,
    },
    {
      id: "user-citizen-2",
      email: "farid@cdc.dz",
      firstName: "Farid",
      lastName: "Khellaf",
      pseudonym: "farid-observateur",
      userType: UserType.CITIZEN,
      accountStatus: AccountStatus.ACTIVE,
      roleCode: RoleCode.CITIZEN,
      chamberId: null,
      phone: "0550000011",
      nin: "777777777777777777",
      wilayaId: "wil-31",
      professionalStatusId: "prof-5",
      sex: Sex.MALE,
      ageRange: AgeRange.FROM_35_TO_44,
      emailVerifiedAt: new Date("2026-01-10T10:00:00.000Z"),
      twoFactorEnabled: false,
    },
    {
      id: "user-citizen-3",
      email: "amal@cdc.dz",
      firstName: "Amal",
      lastName: "Bouziane",
      pseudonym: "amal-civique",
      userType: UserType.CITIZEN,
      accountStatus: AccountStatus.BLOCKED,
      roleCode: RoleCode.CITIZEN,
      chamberId: null,
      phone: "0550000012",
      nin: "888888888888888888",
      wilayaId: "wil-23",
      professionalStatusId: "prof-6",
      sex: Sex.FEMALE,
      ageRange: AgeRange.FROM_25_TO_34,
      emailVerifiedAt: new Date("2026-02-03T11:00:00.000Z"),
      twoFactorEnabled: false,
    },
    {
      id: "user-org-2",
      email: "association@cdc.dz",
      firstName: "Maison",
      lastName: "Citoyenne",
      pseudonym: "maison-citoyenne",
      userType: UserType.CIVIL_SOCIETY_ORG,
      accountStatus: AccountStatus.ACTIVE,
      roleCode: RoleCode.ORG,
      chamberId: null,
      phone: "0550000013",
      nin: "999999999999999999",
      organizationName: "Maison citoyenne d'Oran",
      wilayaId: "wil-31",
      professionalStatusId: "prof-2",
      sex: Sex.FEMALE,
      ageRange: AgeRange.FROM_35_TO_44,
      emailVerifiedAt: new Date("2026-01-16T09:30:00.000Z"),
      twoFactorEnabled: false,
    },
  ] as const;

  const seededUsers: Record<string, string> = {};

  for (const seed of userSeeds) {
    const user = await prisma.user.upsert({
      where: { email: seed.email },
      update: {
        firstName: seed.firstName,
        lastName: seed.lastName,
        pseudonym: seed.pseudonym,
        phone: seed.phone,
        nin: seed.nin,
        accountStatus: seed.accountStatus,
        chamberId: seed.chamberId,
        organizationName: "organizationName" in seed ? seed.organizationName ?? null : null,
        wilayaId: seed.wilayaId,
        professionalStatusId: seed.professionalStatusId,
        sex: seed.sex,
        ageRange: seed.ageRange,
        emailVerifiedAt: seed.emailVerifiedAt,
        twoFactorEnabled: seed.twoFactorEnabled,
      },
      create: {
        id: seed.id,
        userType: seed.userType,
        firstName: seed.firstName,
        lastName: seed.lastName,
        pseudonym: seed.pseudonym,
        email: seed.email,
        phone: seed.phone,
        nin: seed.nin,
        passwordHash: hashSync("demo12345", 10),
        accountStatus: seed.accountStatus,
        chamberId: seed.chamberId,
        organizationName: "organizationName" in seed ? seed.organizationName ?? null : null,
        wilayaId: seed.wilayaId,
        professionalStatusId: seed.professionalStatusId,
        sex: seed.sex,
        ageRange: seed.ageRange,
        emailVerifiedAt: seed.emailVerifiedAt,
        twoFactorEnabled: seed.twoFactorEnabled,
      },
    });

    const role = await prisma.role.findUniqueOrThrow({
      where: { code: seed.roleCode },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: role.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: role.id,
      },
    });

    seededUsers[seed.id] = user.id;
  }

  const proposalHospital = await prisma.proposal.upsert({
    where: { id: "proposal-hospital-2027" },
    update: {
      titleFr: "Audit des services d'urgence hospitaliers",
      titleAr: "تدقيق خدمات الاستعجالات الاستشفائية",
      descriptionFr:
        "Evaluation de la disponibilite des soins, des achats d'urgence et des delais de prise en charge dans les hopitaux publics.",
      descriptionAr: "تقييم توفر الرعاية وعمليات الشراء الاستعجالية وآجال التكفل في المستشفيات العمومية.",
      categoryId: themeHealth.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.EN_COURS_ANALYSE,
      assignedChamberId: chamberFinance.id,
      assignedPresidentUserId: seededUsers["user-president-finance"],
    },
    create: {
      id: "proposal-hospital-2027",
      submittedByUserId: seededUsers["user-citizen"],
      titleFr: "Audit des services d'urgence hospitaliers",
      titleAr: "تدقيق خدمات الاستعجالات الاستشفائية",
      descriptionFr:
        "Evaluation de la disponibilite des soins, des achats d'urgence et des delais de prise en charge dans les hopitaux publics.",
      descriptionAr: "تقييم توفر الرعاية وعمليات الشراء الاستعجالية وآجال التكفل في المستشفيات العمومية.",
      categoryId: themeHealth.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.EN_COURS_ANALYSE,
      assignedChamberId: chamberFinance.id,
      assignedPresidentUserId: seededUsers["user-president-finance"],
    },
  });

  const proposalTransport = await prisma.proposal.upsert({
    where: { id: "proposal-transport-2027" },
    update: {
      titleFr: "Transparence des marches de transport urbain",
      titleAr: "شفافية صفقات النقل الحضري",
      descriptionFr:
        "Analyse des marches publics de transport urbain, des criteres d'attribution et du suivi d'execution contractuelle.",
      descriptionAr: "تحليل صفقات النقل الحضري ومعايير الإسناد ومتابعة التنفيذ التعاقدي.",
      categoryId: themeTransport.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.ACCEPTEE,
      assignedChamberId: chamberFinance.id,
      assignedPresidentUserId: seededUsers["user-president-finance"],
      transmittedToRapporteurAt: new Date("2026-03-18T09:00:00.000Z"),
      finalDecidedByUserId: seededUsers["user-rapporteur"],
      finalDecisionAt: new Date("2026-03-24T11:00:00.000Z"),
    },
    create: {
      id: "proposal-transport-2027",
      submittedByUserId: seededUsers["user-citizen"],
      titleFr: "Transparence des marches de transport urbain",
      titleAr: "شفافية صفقات النقل الحضري",
      descriptionFr:
        "Analyse des marches publics de transport urbain, des criteres d'attribution et du suivi d'execution contractuelle.",
      descriptionAr: "تحليل صفقات النقل الحضري ومعايير الإسناد ومتابعة التنفيذ التعاقدي.",
      categoryId: themeTransport.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.ACCEPTEE,
      assignedChamberId: chamberFinance.id,
      assignedPresidentUserId: seededUsers["user-president-finance"],
      transmittedToRapporteurAt: new Date("2026-03-18T09:00:00.000Z"),
      finalDecidedByUserId: seededUsers["user-rapporteur"],
      finalDecisionAt: new Date("2026-03-24T11:00:00.000Z"),
    },
  });

  await prisma.proposal.upsert({
    where: { id: "proposal-dechets-2027" },
    update: {
      titleFr: "Gestion des dechets menagers par commune",
      titleAr: "تسيير النفايات المنزلية على مستوى البلديات",
      descriptionFr:
        "Lecture comparee des contrats de collecte, des centres de tri et des couts de traitement dans plusieurs communes.",
      descriptionAr: "قراءة مقارنة لعقود الجمع ومراكز الفرز وتكاليف المعالجة عبر عدة بلديات.",
      categoryId: themeLocal.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.RECU,
      assignedChamberId: chamberLocal.id,
      assignedPresidentUserId: seededUsers["user-president-local"],
    },
    create: {
      id: "proposal-dechets-2027",
      submittedByUserId: seededUsers["user-org"],
      titleFr: "Gestion des dechets menagers par commune",
      titleAr: "تسيير النفايات المنزلية على مستوى البلديات",
      descriptionFr:
        "Lecture comparee des contrats de collecte, des centres de tri et des couts de traitement dans plusieurs communes.",
      descriptionAr: "قراءة مقارنة لعقود الجمع ومراكز الفرز وتكاليف المعالجة عبر عدة بلديات.",
      categoryId: themeLocal.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.RECU,
      assignedChamberId: chamberLocal.id,
      assignedPresidentUserId: seededUsers["user-president-local"],
    },
  });

  const generatedProposal = await prisma.proposal.upsert({
    where: { id: "proposal-generated-from-report" },
    update: {
      titleFr: "Irregularites dans la gestion des fournitures hospitalieres",
      titleAr: "اختلالات في تسيير اللوازم الاستشفائية",
      descriptionFr:
        "Theme cree a partir du signalement report-governance-001. Entite cible: Ministere de la Sante. Justification de conversion: dossier relevant d'un axe recurrent de controle.",
      descriptionAr: "موضوع تم إنشاؤه انطلاقا من تبليغ متعلق باختلالات في تسيير اللوازم الاستشفائية.",
      categoryId: themeHealth.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.EN_COURS_ANALYSE,
      assignedChamberId: chamberFinance.id,
      assignedPresidentUserId: seededUsers["user-president-finance"],
    },
    create: {
      id: "proposal-generated-from-report",
      submittedByUserId: seededUsers["user-citizen"],
      titleFr: "Irregularites dans la gestion des fournitures hospitalieres",
      titleAr: "اختلالات في تسيير اللوازم الاستشفائية",
      descriptionFr:
        "Theme cree a partir du signalement report-governance-001. Entite cible: Ministere de la Sante. Justification de conversion: dossier relevant d'un axe recurrent de controle.",
      descriptionAr: "موضوع تم إنشاؤه انطلاقا من تبليغ متعلق باختلالات في تسيير اللوازم الاستشفائية.",
      categoryId: themeHealth.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.EN_COURS_ANALYSE,
      assignedChamberId: chamberFinance.id,
      assignedPresidentUserId: seededUsers["user-president-finance"],
    },
  });

  const proposalRejected = await prisma.proposal.upsert({
    where: { id: "proposal-school-canteen-2027" },
    update: {
      titleFr: "Controle de la restauration scolaire",
      titleAr: "controle-restauration-scolaire",
      descriptionFr:
        "Proposition de controle sur les marches de restauration scolaire, la qualite des prestations et la traçabilite des denrees.",
      descriptionAr: "controle-restauration-scolaire",
      categoryId: themeLocal.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.REJETEE,
      assignedChamberId: chamberLocal.id,
      assignedPresidentUserId: seededUsers["user-president-local"],
      transmittedToRapporteurAt: new Date("2026-03-14T08:00:00.000Z"),
      finalDecidedByUserId: seededUsers["user-rapporteur"],
      finalDecisionAt: new Date("2026-03-21T08:00:00.000Z"),
    },
    create: {
      id: "proposal-school-canteen-2027",
      submittedByUserId: seededUsers["user-citizen-2"],
      titleFr: "Controle de la restauration scolaire",
      titleAr: "controle-restauration-scolaire",
      descriptionFr:
        "Proposition de controle sur les marches de restauration scolaire, la qualite des prestations et la traçabilite des denrees.",
      descriptionAr: "controle-restauration-scolaire",
      categoryId: themeLocal.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.REJETEE,
      assignedChamberId: chamberLocal.id,
      assignedPresidentUserId: seededUsers["user-president-local"],
      transmittedToRapporteurAt: new Date("2026-03-14T08:00:00.000Z"),
      finalDecidedByUserId: seededUsers["user-rapporteur"],
      finalDecisionAt: new Date("2026-03-21T08:00:00.000Z"),
    },
  });

  const proposalStale = await prisma.proposal.upsert({
    where: { id: "proposal-digital-archives-2027" },
    update: {
      titleFr: "Archivage numerique des marches publics",
      titleAr: "archivage-numerique-marches-publics",
      descriptionFr:
        "Analyse des outils d'archivage, de la conservation des pieces et de la disponibilite des traces documentaires pour les marches publics.",
      descriptionAr: "archivage-numerique-marches-publics",
      categoryId: themeTransport.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.NON_ACTUALISEE,
      assignedChamberId: chamberFinance.id,
      assignedPresidentUserId: seededUsers["user-president-finance"],
      transmittedToRapporteurAt: new Date("2026-03-11T10:00:00.000Z"),
      finalDecidedByUserId: seededUsers["user-rapporteur"],
      finalDecisionAt: new Date("2026-03-27T13:00:00.000Z"),
    },
    create: {
      id: "proposal-digital-archives-2027",
      submittedByUserId: seededUsers["user-org-2"],
      titleFr: "Archivage numerique des marches publics",
      titleAr: "archivage-numerique-marches-publics",
      descriptionFr:
        "Analyse des outils d'archivage, de la conservation des pieces et de la disponibilite des traces documentaires pour les marches publics.",
      descriptionAr: "archivage-numerique-marches-publics",
      categoryId: themeTransport.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.NON_ACTUALISEE,
      assignedChamberId: chamberFinance.id,
      assignedPresidentUserId: seededUsers["user-president-finance"],
      transmittedToRapporteurAt: new Date("2026-03-11T10:00:00.000Z"),
      finalDecidedByUserId: seededUsers["user-rapporteur"],
      finalDecisionAt: new Date("2026-03-27T13:00:00.000Z"),
    },
  });

  for (const history of [
    {
      id: "proposal-history-hospital-1",
      proposalId: proposalHospital.id,
      fromStatus: null,
      toStatus: ProposalStatus.RECU,
      changedByUserId: seededUsers["user-citizen"],
      note: "Soumission initiale",
    },
    {
      id: "proposal-history-hospital-2",
      proposalId: proposalHospital.id,
      fromStatus: ProposalStatus.RECU,
      toStatus: ProposalStatus.EN_COURS_ANALYSE,
      changedByUserId: seededUsers["user-president-finance"],
      note: "Prise en charge par le president de chambre",
    },
    {
      id: "proposal-history-transport-1",
      proposalId: proposalTransport.id,
      fromStatus: null,
      toStatus: ProposalStatus.RECU,
      changedByUserId: seededUsers["user-citizen"],
      note: "Soumission initiale",
    },
    {
      id: "proposal-history-transport-2",
      proposalId: proposalTransport.id,
      fromStatus: ProposalStatus.RECU,
      toStatus: ProposalStatus.EN_COURS_ANALYSE,
      changedByUserId: seededUsers["user-president-finance"],
      note: "Analyse initiale",
    },
    {
      id: "proposal-history-transport-3",
      proposalId: proposalTransport.id,
      fromStatus: ProposalStatus.EN_COURS_ANALYSE,
      toStatus: ProposalStatus.ACCEPTEE,
      changedByUserId: seededUsers["user-rapporteur"],
      note: "Decision finale favorable",
    },
    {
      id: "proposal-history-generated-1",
      proposalId: generatedProposal.id,
      fromStatus: null,
      toStatus: ProposalStatus.EN_COURS_ANALYSE,
      changedByUserId: seededUsers["user-president-finance"],
      note: "Creation automatique depuis un signalement converti",
    },
    {
      id: "proposal-history-rejected-1",
      proposalId: proposalRejected.id,
      fromStatus: null,
      toStatus: ProposalStatus.RECU,
      changedByUserId: seededUsers["user-citizen-2"],
      note: "Soumission initiale",
    },
    {
      id: "proposal-history-rejected-2",
      proposalId: proposalRejected.id,
      fromStatus: ProposalStatus.RECU,
      toStatus: ProposalStatus.REJETEE,
      changedByUserId: seededUsers["user-rapporteur"],
      note: "Theme hors priorites annuelles",
    },
    {
      id: "proposal-history-stale-1",
      proposalId: proposalStale.id,
      fromStatus: null,
      toStatus: ProposalStatus.RECU,
      changedByUserId: seededUsers["user-org-2"],
      note: "Soumission initiale",
    },
    {
      id: "proposal-history-stale-2",
      proposalId: proposalStale.id,
      fromStatus: ProposalStatus.RECU,
      toStatus: ProposalStatus.NON_ACTUALISEE,
      changedByUserId: seededUsers["user-president-finance"],
      note: "Informations non actualisees dans les delais",
    },
  ]) {
    await prisma.proposalStatusHistory.upsert({
      where: { id: history.id },
      update: history,
      create: history,
    });
  }

  for (const comment of [
    {
      id: "comment-hospital-1",
      proposalId: proposalHospital.id,
      userId: seededUsers["user-citizen"],
      body: "Le sujet concerne plusieurs etablissements avec tensions sur les achats d'urgence.",
      isPublic: true,
    },
    {
      id: "comment-transport-1",
      proposalId: proposalTransport.id,
      userId: seededUsers["user-org"],
      body: "Des comparaisons inter-wilayas seraient utiles pour mesurer l'efficacite du dispositif.",
      isPublic: true,
    },
    {
      id: "comment-rejected-1",
      proposalId: proposalRejected.id,
      userId: seededUsers["user-org-2"],
      body: "Ce theme pourrait revenir dans un prochain exercice avec une focale regionale.",
      isPublic: true,
    },
    {
      id: "comment-stale-1",
      proposalId: proposalStale.id,
      userId: seededUsers["user-citizen"],
      body: "Les archives numeriques restent un sujet cle mais il manque encore des elements documentes.",
      isPublic: true,
    },
  ]) {
    await prisma.proposalComment.upsert({
      where: { id: comment.id },
      update: comment,
      create: comment,
    });
  }

  for (const like of [
    { proposalId: proposalHospital.id, userId: seededUsers["user-citizen"] },
    { proposalId: proposalHospital.id, userId: seededUsers["user-org"] },
    { proposalId: proposalTransport.id, userId: seededUsers["user-citizen"] },
    { proposalId: proposalRejected.id, userId: seededUsers["user-citizen"] },
    { proposalId: proposalStale.id, userId: seededUsers["user-citizen-2"] },
    { proposalId: proposalStale.id, userId: seededUsers["user-org-2"] },
  ]) {
    await prisma.proposalLike.upsert({
      where: {
        proposalId_userId: {
          proposalId: like.proposalId,
          userId: like.userId,
        },
      },
      update: {},
      create: like,
    });
  }

  for (const attachment of [
    {
      id: "proposal-attachment-hospital-1",
      proposalId: proposalHospital.id,
      fileName: "note-cadrage-hopitaux.pdf",
      mimeType: "application/pdf",
      fileSize: 412000,
      storagePath: "/uploads/proposals/note-cadrage-hopitaux.pdf",
      uploadedByUserId: seededUsers["user-citizen"],
    },
    {
      id: "proposal-attachment-transport-1",
      proposalId: proposalTransport.id,
      fileName: "synthese-transport-urbain.docx",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      fileSize: 286000,
      storagePath: "/uploads/proposals/synthese-transport-urbain.docx",
      uploadedByUserId: seededUsers["user-org"],
    },
    {
      id: "proposal-attachment-stale-1",
      proposalId: proposalStale.id,
      fileName: "inventaire-archives.csv",
      mimeType: "text/csv",
      fileSize: 96000,
      storagePath: "/uploads/proposals/inventaire-archives.csv",
      uploadedByUserId: seededUsers["user-org-2"],
    },
  ]) {
    await prisma.proposalAttachment.upsert({
      where: { id: attachment.id },
      update: attachment,
      create: attachment,
    });
  }

  const reportSubjectFinance = await prisma.reportSubject.upsert({
    where: { id: "report-subject-finance-2027" },
    update: {
      submittedByUserId: seededUsers["user-citizen"],
      titleFr: "Controle des couts de maintenance des hopitaux universitaires",
      titleAr: "ظ…ط±ط§ظ‚ط¨ط© طھظƒط§ظ„ظٹظپ طµظٹط§ظ†ط© ط§ظ„ظ…ط³طھط´ظپظٹط§طھ ط§ظ„ط¬ط§ظ…ط¹ظٹط©",
      descriptionFr:
        "Le sujet vise a comparer les marches de maintenance, les delais d'intervention et les couts reels supportes par les etablissements publics hospitaliers.",
      descriptionAr:
        "ظٹظ‡ط¯ظپ ط§ظ„ظ…ظˆط¶ظˆط¹ ط¥ظ„ظ‰ ظ…ظ‚ط§ط±ظ†ط© طµظپظ‚ط§طھ ط§ظ„طµظٹط§ظ†ط© ظˆط¢ط¬ط§ظ„ ط§ظ„طھط¯ط®ظ„ ظˆط§ظ„طھظƒط§ظ„ظٹظپ ط§ظ„ظپط¹ظ„ظٹط© ط§ظ„طھظٹ طھطھط­ظ…ظ„ظ‡ط§ ط§ظ„ظ…ط¤ط³ط³ط§طھ ط§ظ„ط§ط³طھط´ظپط§ط¦ظٹط© ط§ظ„ط¹ظ…ظˆظ…ظٹط©.",
      categoryId: reportFinance.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.EN_COURS_ANALYSE,
    },
    create: {
      id: "report-subject-finance-2027",
      submittedByUserId: seededUsers["user-citizen"],
      titleFr: "Controle des couts de maintenance des hopitaux universitaires",
      titleAr: "ظ…ط±ط§ظ‚ط¨ط© طھظƒط§ظ„ظٹظپ طµظٹط§ظ†ط© ط§ظ„ظ…ط³طھط´ظپظٹط§طھ ط§ظ„ط¬ط§ظ…ط¹ظٹط©",
      descriptionFr:
        "Le sujet vise a comparer les marches de maintenance, les delais d'intervention et les couts reels supportes par les etablissements publics hospitaliers.",
      descriptionAr:
        "ظٹظ‡ط¯ظپ ط§ظ„ظ…ظˆط¶ظˆط¹ ط¥ظ„ظ‰ ظ…ظ‚ط§ط±ظ†ط© طµظپظ‚ط§طھ ط§ظ„طµظٹط§ظ†ط© ظˆط¢ط¬ط§ظ„ ط§ظ„طھط¯ط®ظ„ ظˆط§ظ„طھظƒط§ظ„ظٹظپ ط§ظ„ظپط¹ظ„ظٹط© ط§ظ„طھظٹ طھطھط­ظ…ظ„ظ‡ط§ ط§ظ„ظ…ط¤ط³ط³ط§طھ ط§ظ„ط§ط³طھط´ظپط§ط¦ظٹط© ط§ظ„ط¹ظ…ظˆظ…ظٹط©.",
      categoryId: reportFinance.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.EN_COURS_ANALYSE,
    },
  });

  const reportSubjectGovernance = await prisma.reportSubject.upsert({
    where: { id: "report-subject-governance-2027" },
    update: {
      submittedByUserId: seededUsers["user-org"],
      titleFr: "Suivi des delegations de service public dans le transport urbain",
      titleAr: "ظ…طھط§ط¨ط¹ط© طھظپظˆظٹط¶ ط§ظ„ط®ط¯ظ…ط§طھ ط§ظ„ط¹ظ…ظˆظ…ظٹط© ظپظٹ ط§ظ„ظ†ظ‚ظ„ ط§ظ„ط­ط¶ط±ظٹ",
      descriptionFr:
        "La suggestion porte sur la transparence des contrats, les indicateurs de performance et les mecanismes de controle associes aux delegations de transport urbain.",
      descriptionAr:
        "ظٹطھط¹ظ„ظ‚ ط§ظ„ط§ظ‚طھط±ط§ط­ ط¨ط´ظپط§ظپظٹط© ط§ظ„ط¹ظ‚ظˆط¯ ظˆظ…ط¤ط´ط±ط§طھ ط§ظ„ط£ط¯ط§ط، وظآليات الرقابة المرتبطة بتفويضات النقل الحضري.",
      categoryId: reportGovernance.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.RECU,
    },
    create: {
      id: "report-subject-governance-2027",
      submittedByUserId: seededUsers["user-org"],
      titleFr: "Suivi des delegations de service public dans le transport urbain",
      titleAr: "ظ…طھط§ط¨ط¹ط© طھظپظˆظٹط¶ ط§ظ„ط®ط¯ظ…ط§طھ ط§ظ„ط¹ظ…ظˆظ…ظٹط© ظپظٹ ط§ظ„ظ†ظ‚ظ„ ط§ظ„ط­ط¶ط±ظٹ",
      descriptionFr:
        "La suggestion porte sur la transparence des contrats, les indicateurs de performance et les mecanismes de controle associes aux delegations de transport urbain.",
      descriptionAr:
        "ظٹطھط¹ظ„ظ‚ ط§ظ„ط§ظ‚طھط±ط§ط­ ط¨ط´ظپط§ظپظٹط© ط§ظ„ط¹ظ‚ظˆط¯ ظˆظ…ط¤ط´ط±ط§طھ ط§ظ„ط£ط¯ط§ط، وظآليات الرقابة المرتبطة بتفويضات النقل الحضري.",
      categoryId: reportGovernance.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.RECU,
    },
  });

  const reportSubjectAccepted = await prisma.reportSubject.upsert({
    where: { id: "report-subject-procurement-2027" },
    update: {
      submittedByUserId: seededUsers["user-citizen-2"],
      titleFr: "Controle des avenants dans les marches publics communaux",
      titleAr: "controle-avenants-marches-communaux",
      descriptionFr:
        "Suggestion portant sur la frequence des avenants, leur justification et l'evolution financiere des marches publics communaux.",
      descriptionAr: "controle-avenants-marches-communaux",
      categoryId: "report-public-procurement",
      exerciseYear: 2027,
      currentStatus: ProposalStatus.ACCEPTEE,
    },
    create: {
      id: "report-subject-procurement-2027",
      submittedByUserId: seededUsers["user-citizen-2"],
      titleFr: "Controle des avenants dans les marches publics communaux",
      titleAr: "controle-avenants-marches-communaux",
      descriptionFr:
        "Suggestion portant sur la frequence des avenants, leur justification et l'evolution financiere des marches publics communaux.",
      descriptionAr: "controle-avenants-marches-communaux",
      categoryId: "report-public-procurement",
      exerciseYear: 2027,
      currentStatus: ProposalStatus.ACCEPTEE,
    },
  });

  const reportSubjectRejected = await prisma.reportSubject.upsert({
    where: { id: "report-subject-school-2027" },
    update: {
      submittedByUserId: seededUsers["user-org-2"],
      titleFr: "Controle des achats de fournitures scolaires",
      titleAr: "controle-fournitures-scolaires",
      descriptionFr:
        "Suggestion citoyenne sur la programmation des achats, la livraison et la qualite des fournitures scolaires dans plusieurs wilayas.",
      descriptionAr: "controle-fournitures-scolaires",
      categoryId: reportFinance.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.REJETEE,
    },
    create: {
      id: "report-subject-school-2027",
      submittedByUserId: seededUsers["user-org-2"],
      titleFr: "Controle des achats de fournitures scolaires",
      titleAr: "controle-fournitures-scolaires",
      descriptionFr:
        "Suggestion citoyenne sur la programmation des achats, la livraison et la qualite des fournitures scolaires dans plusieurs wilayas.",
      descriptionAr: "controle-fournitures-scolaires",
      categoryId: reportFinance.id,
      exerciseYear: 2027,
      currentStatus: ProposalStatus.REJETEE,
    },
  });

  for (const comment of [
    {
      id: "report-subject-comment-1",
      reportSubjectId: reportSubjectFinance.id,
      userId: seededUsers["user-org"],
      body: "Une comparaison entre CHU et etablissements regionaux serait tres utile.",
      isPublic: true,
    },
    {
      id: "report-subject-comment-2",
      reportSubjectId: reportSubjectGovernance.id,
      userId: seededUsers["user-citizen"],
      body: "Le suivi des indicateurs contractuels devrait etre publie wilaya par wilaya.",
      isPublic: true,
    },
    {
      id: "report-subject-comment-3",
      reportSubjectId: reportSubjectAccepted.id,
      userId: seededUsers["user-org"],
      body: "Les avenants repetitifs meritaient deja une revue systematique.",
      isPublic: true,
    },
    {
      id: "report-subject-comment-4",
      reportSubjectId: reportSubjectRejected.id,
      userId: seededUsers["user-citizen-2"],
      body: "Le sujet reste interessant meme s'il n'est pas retenu cette annee.",
      isPublic: true,
    },
  ]) {
    await prisma.reportSubjectComment.upsert({
      where: { id: comment.id },
      update: comment,
      create: comment,
    });
  }

  for (const like of [
    { reportSubjectId: reportSubjectFinance.id, userId: seededUsers["user-citizen"] },
    { reportSubjectId: reportSubjectFinance.id, userId: seededUsers["user-org"] },
    { reportSubjectId: reportSubjectGovernance.id, userId: seededUsers["user-citizen"] },
    { reportSubjectId: reportSubjectAccepted.id, userId: seededUsers["user-citizen"] },
    { reportSubjectId: reportSubjectAccepted.id, userId: seededUsers["user-org-2"] },
    { reportSubjectId: reportSubjectRejected.id, userId: seededUsers["user-citizen-2"] },
  ]) {
    await prisma.reportSubjectLike.upsert({
      where: {
        reportSubjectId_userId: {
          reportSubjectId: like.reportSubjectId,
          userId: like.userId,
        },
      },
      update: {},
      create: like,
    });
  }

  await prisma.proposalSummary.upsert({
    where: { id: "proposal-summary-transport" },
    update: {
      proposalId: proposalTransport.id,
      summaryText: "Synthese publiee sur la transparence des marches de transport urbain et le suivi contractuel.",
      publishedByUserId: seededUsers["user-president-finance"],
      publishedAt: new Date("2026-03-26T09:00:00.000Z"),
    },
    create: {
      id: "proposal-summary-transport",
      proposalId: proposalTransport.id,
      summaryText: "Synthese publiee sur la transparence des marches de transport urbain et le suivi contractuel.",
      publishedByUserId: seededUsers["user-president-finance"],
      publishedAt: new Date("2026-03-26T09:00:00.000Z"),
    },
  });

  await prisma.proposalFinalReport.upsert({
    where: { id: "proposal-final-report-transport" },
    update: {
      proposalId: proposalTransport.id,
      fileName: "Synthese audit transport urbain",
      storagePath: "/reports/synthese-audit-transport-urbain.pdf",
      uploadedByUserId: seededUsers["user-admin"],
      publishedAt: new Date("2026-03-28T10:00:00.000Z"),
    },
    create: {
      id: "proposal-final-report-transport",
      proposalId: proposalTransport.id,
      fileName: "Synthese audit transport urbain",
      storagePath: "/reports/synthese-audit-transport-urbain.pdf",
      uploadedByUserId: seededUsers["user-admin"],
      publishedAt: new Date("2026-03-28T10:00:00.000Z"),
    },
  });

  const reportPending = await prisma.report.upsert({
    where: { id: "report-finance-001" },
    update: {
      submittedByUserId: seededUsers["user-citizen"],
      subject: "Suspicion d'irregularite sur un marche local",
      targetEntityName: "APC Alger Centre",
      targetEntityType: "LOCAL",
      localCollectivityId: "local-alger-centre",
      address: "Alger Centre",
      relationToEntity: "Usager du service public",
      circumstance: "Consultation des pieces communales",
      factsLocation: "Alger Centre",
      factsPeriodicity: "Occasionnelle",
      irregularityDescription: "Signalement relatif a des anomalies dans l'execution et la tracabilite d'un marche local.",
      reportCategoryId: reportFinance.id,
      reportDate: new Date("2026-03-20T08:00:00.000Z"),
      currentStatus: ReportStatus.NON_TRAITE,
      assignedChamberId: chamberLocal.id,
      assignedPresidentUserId: seededUsers["user-president-local"],
      acknowledgementNumber: "AR-2026-00421",
      generatedProposalId: null,
    },
    create: {
      id: "report-finance-001",
      submittedByUserId: seededUsers["user-citizen"],
      subject: "Suspicion d'irregularite sur un marche local",
      targetEntityName: "APC Alger Centre",
      targetEntityType: "LOCAL",
      localCollectivityId: "local-alger-centre",
      address: "Alger Centre",
      relationToEntity: "Usager du service public",
      circumstance: "Consultation des pieces communales",
      factsLocation: "Alger Centre",
      factsPeriodicity: "Occasionnelle",
      irregularityDescription: "Signalement relatif a des anomalies dans l'execution et la tracabilite d'un marche local.",
      reportCategoryId: reportFinance.id,
      reportDate: new Date("2026-03-20T08:00:00.000Z"),
      currentStatus: ReportStatus.NON_TRAITE,
      assignedChamberId: chamberLocal.id,
      assignedPresidentUserId: seededUsers["user-president-local"],
      acknowledgementNumber: "AR-2026-00421",
    },
  });

  const reportConverted = await prisma.report.upsert({
    where: { id: "report-governance-001" },
    update: {
      submittedByUserId: seededUsers["user-citizen"],
      subject: "Anomalies sur la gestion de fournitures hospitalieres",
      targetEntityName: "Ministere de la Sante",
      targetEntityType: "CENTRAL",
      centralAdministrationId: "central-health",
      address: "Alger",
      relationToEntity: "Agent observateur",
      circumstance: "Examen de circuits de validation",
      factsLocation: "Administration centrale",
      factsPeriodicity: "Recurrente",
      irregularityDescription: "Constats repetes sur les fournitures hospitalieres, justifiant un theme de suivi institutionnel.",
      reportCategoryId: reportGovernance.id,
      reportDate: new Date("2026-03-15T09:00:00.000Z"),
      currentStatus: ReportStatus.CONVERTI_EN_THEME,
      assignedChamberId: chamberFinance.id,
      assignedPresidentUserId: seededUsers["user-president-finance"],
      acknowledgementNumber: "AR-2026-00496",
      generatedProposalId: generatedProposal.id,
    },
    create: {
      id: "report-governance-001",
      submittedByUserId: seededUsers["user-citizen"],
      subject: "Anomalies sur la gestion de fournitures hospitalieres",
      targetEntityName: "Ministere de la Sante",
      targetEntityType: "CENTRAL",
      centralAdministrationId: "central-health",
      address: "Alger",
      relationToEntity: "Agent observateur",
      circumstance: "Examen de circuits de validation",
      factsLocation: "Administration centrale",
      factsPeriodicity: "Recurrente",
      irregularityDescription: "Constats repetes sur les fournitures hospitalieres, justifiant un theme de suivi institutionnel.",
      reportCategoryId: reportGovernance.id,
      reportDate: new Date("2026-03-15T09:00:00.000Z"),
      currentStatus: ReportStatus.CONVERTI_EN_THEME,
      assignedChamberId: chamberFinance.id,
      assignedPresidentUserId: seededUsers["user-president-finance"],
      acknowledgementNumber: "AR-2026-00496",
      generatedProposalId: generatedProposal.id,
    },
  });

  for (const attachment of [
    {
      id: "report-attachment-finance-1",
      reportId: reportPending.id,
      fileName: "pieces-marche-local.pdf",
      mimeType: "application/pdf",
      fileSize: 524000,
      storagePath: "/uploads/reports/pieces-marche-local.pdf",
      uploadedByUserId: seededUsers["user-citizen"],
    },
    {
      id: "report-attachment-governance-1",
      reportId: reportConverted.id,
      fileName: "releve-fournitures.xlsx",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      fileSize: 198000,
      storagePath: "/uploads/reports/releve-fournitures.xlsx",
      uploadedByUserId: seededUsers["user-citizen"],
    },
    {
      id: "report-attachment-rejected-1",
      reportId: "report-rejected-001",
      fileName: "declaration-partielle.txt",
      mimeType: "text/plain",
      fileSize: 24000,
      storagePath: "/uploads/reports/declaration-partielle.txt",
      uploadedByUserId: seededUsers["user-org"],
    },
  ]) {
    await prisma.reportAttachment.upsert({
      where: { id: attachment.id },
      update: attachment,
      create: attachment,
    });
  }

  await prisma.report.upsert({
    where: { id: "report-rejected-001" },
    update: {
      submittedByUserId: seededUsers["user-org"],
      subject: "Signalement incomplet sur un dispositif local",
      targetEntityName: "APC Alger Centre",
      targetEntityType: "LOCAL",
      localCollectivityId: "local-alger-centre",
      address: "Alger Centre",
      relationToEntity: "Representant associatif",
      circumstance: "Depot documentaire incomplet",
      factsLocation: "Alger Centre",
      factsPeriodicity: "Ponctuelle",
      irregularityDescription: "Le signalement reste trop partiel pour permettre une instruction complete a ce stade.",
      reportCategoryId: reportGovernance.id,
      reportDate: new Date("2026-03-12T10:00:00.000Z"),
      currentStatus: ReportStatus.REJETE,
      assignedChamberId: chamberLocal.id,
      assignedPresidentUserId: seededUsers["user-president-local"],
      acknowledgementNumber: "AR-2026-00407",
      generatedProposalId: null,
    },
    create: {
      id: "report-rejected-001",
      submittedByUserId: seededUsers["user-org"],
      subject: "Signalement incomplet sur un dispositif local",
      targetEntityName: "APC Alger Centre",
      targetEntityType: "LOCAL",
      localCollectivityId: "local-alger-centre",
      address: "Alger Centre",
      relationToEntity: "Representant associatif",
      circumstance: "Depot documentaire incomplet",
      factsLocation: "Alger Centre",
      factsPeriodicity: "Ponctuelle",
      irregularityDescription: "Le signalement reste trop partiel pour permettre une instruction complete a ce stade.",
      reportCategoryId: reportGovernance.id,
      reportDate: new Date("2026-03-12T10:00:00.000Z"),
      currentStatus: ReportStatus.REJETE,
      assignedChamberId: chamberLocal.id,
      assignedPresidentUserId: seededUsers["user-president-local"],
      acknowledgementNumber: "AR-2026-00407",
    },
  });

  const reportProcurement = await prisma.report.upsert({
    where: { id: "report-procurement-001" },
    update: {
      submittedByUserId: seededUsers["user-citizen-2"],
      subject: "Avenants repetitifs sur des marches d'equipement communal",
      targetEntityName: "Ministere des Finances",
      targetEntityType: "CENTRAL",
      centralAdministrationId: "central-finance",
      address: "Alger",
      relationToEntity: "Consultant externe",
      circumstance: "Analyse documentaire",
      factsLocation: "Direction de la commande publique",
      factsPeriodicity: "Recurrente",
      irregularityDescription:
        "Le signalement porte sur des avenants successifs et une hausse inhabituelle des montants dans plusieurs marches d'equipement communal.",
      reportCategoryId: "report-public-procurement",
      reportDate: new Date("2026-03-22T09:30:00.000Z"),
      currentStatus: ReportStatus.NON_TRAITE,
      assignedChamberId: chamberFinance.id,
      assignedPresidentUserId: seededUsers["user-president-finance"],
      acknowledgementNumber: "AR-2026-00518",
      generatedProposalId: null,
    },
    create: {
      id: "report-procurement-001",
      submittedByUserId: seededUsers["user-citizen-2"],
      subject: "Avenants repetitifs sur des marches d'equipement communal",
      targetEntityName: "Ministere des Finances",
      targetEntityType: "CENTRAL",
      centralAdministrationId: "central-finance",
      address: "Alger",
      relationToEntity: "Consultant externe",
      circumstance: "Analyse documentaire",
      factsLocation: "Direction de la commande publique",
      factsPeriodicity: "Recurrente",
      irregularityDescription:
        "Le signalement porte sur des avenants successifs et une hausse inhabituelle des montants dans plusieurs marches d'equipement communal.",
      reportCategoryId: "report-public-procurement",
      reportDate: new Date("2026-03-22T09:30:00.000Z"),
      currentStatus: ReportStatus.NON_TRAITE,
      assignedChamberId: chamberFinance.id,
      assignedPresidentUserId: seededUsers["user-president-finance"],
      acknowledgementNumber: "AR-2026-00518",
    },
  });

  await prisma.reportAttachment.upsert({
    where: { id: "report-attachment-procurement-1" },
    update: {
      reportId: reportProcurement.id,
      fileName: "avenants-communes.pdf",
      mimeType: "application/pdf",
      fileSize: 438000,
      storagePath: "/uploads/reports/avenants-communes.pdf",
      uploadedByUserId: seededUsers["user-citizen-2"],
    },
    create: {
      id: "report-attachment-procurement-1",
      reportId: reportProcurement.id,
      fileName: "avenants-communes.pdf",
      mimeType: "application/pdf",
      fileSize: 438000,
      storagePath: "/uploads/reports/avenants-communes.pdf",
      uploadedByUserId: seededUsers["user-citizen-2"],
    },
  });

  for (const history of [
    {
      id: "report-history-pending-1",
      reportId: reportPending.id,
      fromStatus: null,
      toStatus: ReportStatus.NON_TRAITE,
      changedByUserId: seededUsers["user-citizen"],
      note: "Soumission initiale",
    },
    {
      id: "report-history-converted-1",
      reportId: reportConverted.id,
      fromStatus: null,
      toStatus: ReportStatus.NON_TRAITE,
      changedByUserId: seededUsers["user-citizen"],
      note: "Soumission initiale",
    },
    {
      id: "report-history-converted-2",
      reportId: reportConverted.id,
      fromStatus: ReportStatus.NON_TRAITE,
      toStatus: ReportStatus.CONVERTI_EN_THEME,
      changedByUserId: seededUsers["user-president-finance"],
      note: "Conversion du signalement en theme",
    },
    {
      id: "report-history-procurement-1",
      reportId: reportProcurement.id,
      fromStatus: null,
      toStatus: ReportStatus.NON_TRAITE,
      changedByUserId: seededUsers["user-citizen-2"],
      note: "Soumission initiale",
    },
  ]) {
    await prisma.reportStatusHistory.upsert({
      where: { id: history.id },
      update: history,
      create: history,
    });
  }

  for (const notification of [
    {
      id: "notif-proposal-created",
      userId: seededUsers["user-citizen"],
      type: "PROPOSAL_CREATED",
      title: "Nouvelle proposition enregistree",
      body: `Le dossier ${proposalHospital.id} a ete recu et oriente vers la chambre competente.`,
      channel: NotificationChannel.IN_APP,
    },
    {
      id: "notif-proposal-transmitted",
      userId: seededUsers["user-citizen"],
      type: "PROPOSAL_TRANSMITTED",
      title: "Votre proposition a ete transmise au rapporteur general",
      body: `Le dossier ${proposalTransport.id} avance dans le circuit institutionnel.`,
      channel: NotificationChannel.IN_APP,
    },
    {
      id: "notif-report-created",
      userId: seededUsers["user-citizen"],
      type: "REPORT_CREATED",
      title: "Signalement enregistre",
      body: `Le signalement ${reportConverted.id} a recu l'accuse ${reportConverted.acknowledgementNumber}.`,
      channel: NotificationChannel.IN_APP,
    },
    {
      id: "notif-report-converted",
      userId: seededUsers["user-citizen"],
      type: "REPORT_CONVERTED",
      title: "Signalement converti en theme",
      body: `Le signalement ${reportConverted.id} a ete converti sous le dossier ${generatedProposal.id}.`,
      channel: NotificationChannel.IN_APP,
    },
    {
      id: "notif-report-procurement",
      userId: seededUsers["user-citizen-2"],
      type: "REPORT_CREATED",
      title: "Signalement commande publique enregistre",
      body: `Le signalement ${reportProcurement.id} a recu l'accuse ${reportProcurement.acknowledgementNumber}.`,
      channel: NotificationChannel.EMAIL,
    },
    {
      id: "notif-blocked-account",
      userId: seededUsers["user-citizen-3"],
      type: "ACCOUNT_BLOCKED",
      title: "Compte temporairement bloque",
      body: "Votre compte est temporairement bloque dans l'attente d'une verification complementaire.",
      channel: NotificationChannel.IN_APP,
    },
  ]) {
    await prisma.notification.upsert({
      where: { id: notification.id },
      update: notification,
      create: notification,
    });
  }

  for (const log of [
    {
      id: "audit-1",
      actorUserId: seededUsers["user-admin"],
      action: "BLOCK_ACCOUNT",
      resourceType: "user",
      resourceId: seededUsers["user-org"],
      metadataJson: { reason: "Verification requise" },
    },
    {
      id: "audit-2",
      actorUserId: seededUsers["user-president-finance"],
      action: "UPDATE_REPORT_STATUS",
      resourceType: "report",
      resourceId: reportConverted.id,
      metadataJson: { status: "CONVERTI_EN_THEME" },
    },
    {
      id: "audit-3",
      actorUserId: seededUsers["user-rapporteur"],
      action: "UPDATE_PROPOSAL_STATUS",
      resourceType: "proposal",
      resourceId: proposalTransport.id,
      metadataJson: { status: "ACCEPTEE" },
    },
    {
      id: "audit-4",
      actorUserId: seededUsers["user-president-local"],
      action: "UPDATE_PROPOSAL_STATUS",
      resourceType: "proposal",
      resourceId: proposalRejected.id,
      metadataJson: { status: "REJETEE" },
    },
    {
      id: "audit-5",
      actorUserId: seededUsers["user-president-finance"],
      action: "CREATE_REPORT",
      resourceType: "report",
      resourceId: reportProcurement.id,
      metadataJson: { acknowledgement: reportProcurement.acknowledgementNumber },
    },
  ]) {
    await prisma.auditLog.upsert({
      where: { id: log.id },
      update: log,
      create: log,
    });
  }

  await prisma.accountBlock.upsert({
    where: { id: "account-block-org-review" },
    update: {
      userId: seededUsers["user-org"],
      blockedByUserId: seededUsers["user-admin"],
      reason: "Blocage temporaire pendant verification complementaire du dossier organisation.",
      startsAt: new Date("2026-03-10T09:00:00.000Z"),
      endsAt: new Date("2026-03-17T09:00:00.000Z"),
      isPermanent: false,
    },
    create: {
      id: "account-block-org-review",
      userId: seededUsers["user-org"],
      blockedByUserId: seededUsers["user-admin"],
      reason: "Blocage temporaire pendant verification complementaire du dossier organisation.",
      startsAt: new Date("2026-03-10T09:00:00.000Z"),
      endsAt: new Date("2026-03-17T09:00:00.000Z"),
      isPermanent: false,
    },
  });

  await prisma.accountBlock.upsert({
    where: { id: "account-block-citizen-review" },
    update: {
      userId: seededUsers["user-citizen-3"],
      blockedByUserId: seededUsers["user-admin"],
      reason: "Compte signale pour verification de coherence des informations d'identite.",
      startsAt: new Date("2026-03-18T09:00:00.000Z"),
      endsAt: null,
      isPermanent: false,
    },
    create: {
      id: "account-block-citizen-review",
      userId: seededUsers["user-citizen-3"],
      blockedByUserId: seededUsers["user-admin"],
      reason: "Compte signale pour verification de coherence des informations d'identite.",
      startsAt: new Date("2026-03-18T09:00:00.000Z"),
      endsAt: null,
      isPermanent: false,
    },
  });

  console.log("Seed complete with reference data for every model, demo accounts, workflows, attachments, moderation and public content.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
