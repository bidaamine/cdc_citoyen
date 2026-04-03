import {
  AccountStatus,
  NotificationChannel,
  PrismaClient,
  ProposalStatus,
  ReportStatus,
  RoleCode,
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
      wilayaId: "wil-16",
      professionalStatusId: "prof-1",
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
      organizationName: "Forum des associations",
      wilayaId: "wil-31",
      professionalStatusId: "prof-2",
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
      wilayaId: "wil-16",
      professionalStatusId: "prof-1",
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
      wilayaId: "wil-25",
      professionalStatusId: "prof-1",
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
      wilayaId: "wil-16",
      professionalStatusId: "prof-1",
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
      wilayaId: "wil-16",
      professionalStatusId: "prof-1",
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
        accountStatus: seed.accountStatus,
        chamberId: seed.chamberId,
        organizationName: "organizationName" in seed ? seed.organizationName ?? null : null,
        wilayaId: seed.wilayaId,
        professionalStatusId: seed.professionalStatusId,
      },
      create: {
        id: seed.id,
        userType: seed.userType,
        firstName: seed.firstName,
        lastName: seed.lastName,
        pseudonym: seed.pseudonym,
        email: seed.email,
        phone: seed.phone,
        passwordHash: hashSync("demo12345", 10),
        accountStatus: seed.accountStatus,
        chamberId: seed.chamberId,
        organizationName: "organizationName" in seed ? seed.organizationName ?? null : null,
        wilayaId: seed.wilayaId,
        professionalStatusId: seed.professionalStatusId,
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
  ]) {
    await prisma.auditLog.upsert({
      where: { id: log.id },
      update: log,
      create: log,
    });
  }

  console.log("Seed complete with reference data, demo accounts, workflows, notifications and public content.");
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
