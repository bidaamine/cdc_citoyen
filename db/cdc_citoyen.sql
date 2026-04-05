-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2026 at 02:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.4.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cdc_citoyen`
--

-- --------------------------------------------------------

--
-- Table structure for table `accountblock`
--

CREATE TABLE `accountblock` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `blockedByUserId` varchar(191) NOT NULL,
  `reason` text NOT NULL,
  `startsAt` datetime(3) NOT NULL,
  `endsAt` datetime(3) DEFAULT NULL,
  `isPermanent` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `accountblock`
--

INSERT INTO `accountblock` (`id`, `userId`, `blockedByUserId`, `reason`, `startsAt`, `endsAt`, `isPermanent`, `createdAt`) VALUES
('account-block-citizen-review', 'user-citizen-3', 'user-admin', 'Compte signale pour verification de coherence des informations d\'identite.', '2026-03-18 09:00:00.000', NULL, 0, '2026-04-05 11:26:11.672'),
('account-block-org-review', 'user-org', 'user-admin', 'Blocage temporaire pendant verification complementaire du dossier organisation.', '2026-03-10 09:00:00.000', '2026-03-17 09:00:00.000', 0, '2026-04-05 11:19:35.261');

-- --------------------------------------------------------

--
-- Table structure for table `auditlog`
--

CREATE TABLE `auditlog` (
  `id` varchar(191) NOT NULL,
  `actorUserId` varchar(191) DEFAULT NULL,
  `action` varchar(191) NOT NULL,
  `resourceType` varchar(191) NOT NULL,
  `resourceId` varchar(191) NOT NULL,
  `metadataJson` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadataJson`)),
  `ipAddress` varchar(191) DEFAULT NULL,
  `userAgent` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `auditlog`
--

INSERT INTO `auditlog` (`id`, `actorUserId`, `action`, `resourceType`, `resourceId`, `metadataJson`, `ipAddress`, `userAgent`, `createdAt`) VALUES
('audit-1', 'user-admin', 'BLOCK_ACCOUNT', 'user', 'user-org', '{\"reason\":\"Verification requise\"}', NULL, NULL, '2026-04-05 09:17:53.936'),
('audit-2', 'user-president-finance', 'UPDATE_REPORT_STATUS', 'report', 'report-governance-001', '{\"status\":\"CONVERTI_EN_THEME\"}', NULL, NULL, '2026-04-05 09:17:53.944'),
('audit-3', 'user-rapporteur', 'UPDATE_PROPOSAL_STATUS', 'proposal', 'proposal-transport-2027', '{\"status\":\"ACCEPTEE\"}', NULL, NULL, '2026-04-05 09:17:53.949'),
('audit-4', 'user-president-local', 'UPDATE_PROPOSAL_STATUS', 'proposal', 'proposal-school-canteen-2027', '{\"status\":\"REJETEE\"}', NULL, NULL, '2026-04-05 11:26:11.651'),
('audit-5', 'user-president-finance', 'CREATE_REPORT', 'report', 'report-procurement-001', '{\"acknowledgement\":\"AR-2026-00518\"}', NULL, NULL, '2026-04-05 11:26:11.659');

-- --------------------------------------------------------

--
-- Table structure for table `centraladministration`
--

CREATE TABLE `centraladministration` (
  `id` varchar(191) NOT NULL,
  `nameFr` varchar(191) NOT NULL,
  `nameAr` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `chamberId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `centraladministration`
--

INSERT INTO `centraladministration` (`id`, `nameFr`, `nameAr`, `isActive`, `chamberId`) VALUES
('central-finance', 'Ministere des Finances', 'ministere-finances', 1, 'seed-chamber-finance'),
('central-health', 'Ministere de la Sante', 'وزارة الصحة', 1, 'seed-chamber-finance'),
('central-transport', 'Ministere des Transports', 'وزارة النقل', 1, 'seed-chamber-finance');

-- --------------------------------------------------------

--
-- Table structure for table `chamber`
--

CREATE TABLE `chamber` (
  `id` varchar(191) NOT NULL,
  `nameFr` varchar(191) NOT NULL,
  `nameAr` varchar(191) NOT NULL,
  `scopeType` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chamber`
--

INSERT INTO `chamber` (`id`, `nameFr`, `nameAr`, `scopeType`) VALUES
('seed-chamber-finance', 'Chambre finances publiques', 'غرفة المالية العمومية', 'FINANCE'),
('seed-chamber-local', 'Chambre collectivites locales', 'غرفة الجماعات المحلية', 'LOCAL');

-- --------------------------------------------------------

--
-- Table structure for table `localcollectivity`
--

CREATE TABLE `localcollectivity` (
  `id` varchar(191) NOT NULL,
  `nameFr` varchar(191) NOT NULL,
  `nameAr` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `wilayaId` varchar(191) NOT NULL,
  `chamberId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `localcollectivity`
--

INSERT INTO `localcollectivity` (`id`, `nameFr`, `nameAr`, `isActive`, `wilayaId`, `chamberId`) VALUES
('local-alger-centre', 'APC Alger Centre', 'بلدية الجزائر الوسطى', 1, 'wil-16', 'seed-chamber-local'),
('local-oran-centre', 'APC Oran Centre', 'apc-oran-centre', 1, 'wil-31', 'seed-chamber-local');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `channel` enum('IN_APP','EMAIL') NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `userId`, `type`, `title`, `body`, `channel`, `isRead`, `createdAt`) VALUES
('notif-blocked-account', 'user-citizen-3', 'ACCOUNT_BLOCKED', 'Compte temporairement bloque', 'Votre compte est temporairement bloque dans l\'attente d\'une verification complementaire.', 'IN_APP', 0, '2026-04-05 11:26:11.615'),
('notif-proposal-created', 'user-citizen', 'PROPOSAL_CREATED', 'Nouvelle proposition enregistree', 'Le dossier proposal-hospital-2027 a ete recu et oriente vers la chambre competente.', 'IN_APP', 0, '2026-04-05 09:17:53.912'),
('notif-proposal-transmitted', 'user-citizen', 'PROPOSAL_TRANSMITTED', 'Votre proposition a ete transmise au rapporteur general', 'Le dossier proposal-transport-2027 avance dans le circuit institutionnel.', 'IN_APP', 0, '2026-04-05 09:17:53.920'),
('notif-report-converted', 'user-citizen', 'REPORT_CONVERTED', 'Signalement converti en theme', 'Le signalement report-governance-001 a ete converti sous le dossier proposal-generated-from-report.', 'IN_APP', 0, '2026-04-05 09:17:53.932'),
('notif-report-created', 'user-citizen', 'REPORT_CREATED', 'Signalement enregistre', 'Le signalement report-governance-001 a recu l\'accuse AR-2026-00496.', 'IN_APP', 0, '2026-04-05 09:17:53.928'),
('notif-report-procurement', 'user-citizen-2', 'REPORT_CREATED', 'Signalement commande publique enregistre', 'Le signalement report-procurement-001 a recu l\'accuse AR-2026-00518.', 'EMAIL', 0, '2026-04-05 11:26:11.606');

-- --------------------------------------------------------

--
-- Table structure for table `professionalstatus`
--

CREATE TABLE `professionalstatus` (
  `id` varchar(191) NOT NULL,
  `nameFr` varchar(191) NOT NULL,
  `nameAr` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `professionalstatus`
--

INSERT INTO `professionalstatus` (`id`, `nameFr`, `nameAr`, `isActive`) VALUES
('prof-1', 'Fonctionnaire', 'موظف', 1),
('prof-2', 'Profession liberale', 'مهنة حرة', 1),
('prof-3', 'Etudiant', 'طالب', 1),
('prof-4', 'Retraite', 'متقاعد', 1),
('prof-5', 'Entrepreneur', 'entrepreneur', 1),
('prof-6', 'Sans emploi', 'sans-emploi', 1);

-- --------------------------------------------------------

--
-- Table structure for table `proposal`
--

CREATE TABLE `proposal` (
  `id` varchar(191) NOT NULL,
  `submittedByUserId` varchar(191) NOT NULL,
  `titleFr` varchar(191) NOT NULL,
  `titleAr` varchar(191) NOT NULL,
  `descriptionFr` text NOT NULL,
  `descriptionAr` text NOT NULL,
  `categoryId` varchar(191) NOT NULL,
  `exerciseYear` int(11) NOT NULL,
  `currentStatus` enum('RECU','EN_COURS_ANALYSE','ACCEPTEE','REJETEE','NON_ACTUALISEE') NOT NULL DEFAULT 'RECU',
  `assignedChamberId` varchar(191) NOT NULL,
  `assignedPresidentUserId` varchar(191) DEFAULT NULL,
  `transmittedToRapporteurAt` datetime(3) DEFAULT NULL,
  `finalDecidedByUserId` varchar(191) DEFAULT NULL,
  `finalDecisionAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `proposal`
--

INSERT INTO `proposal` (`id`, `submittedByUserId`, `titleFr`, `titleAr`, `descriptionFr`, `descriptionAr`, `categoryId`, `exerciseYear`, `currentStatus`, `assignedChamberId`, `assignedPresidentUserId`, `transmittedToRapporteurAt`, `finalDecidedByUserId`, `finalDecisionAt`, `createdAt`, `updatedAt`) VALUES
('proposal-dechets-2027', 'user-org', 'Gestion des dechets menagers par commune', 'تسيير النفايات المنزلية على مستوى البلديات', 'Lecture comparee des contrats de collecte, des centres de tri et des couts de traitement dans plusieurs communes.', 'قراءة مقارنة لعقود الجمع ومراكز الفرز وتكاليف المعالجة عبر عدة بلديات.', 'theme-local', 2027, 'RECU', 'seed-chamber-local', 'user-president-local', NULL, NULL, NULL, '2026-04-05 09:17:53.793', '2026-04-05 11:26:11.244'),
('proposal-digital-archives-2027', 'user-org-2', 'Archivage numerique des marches publics', 'archivage-numerique-marches-publics', 'Analyse des outils d\'archivage, de la conservation des pieces et de la disponibilite des traces documentaires pour les marches publics.', 'archivage-numerique-marches-publics', 'theme-transport', 2027, 'NON_ACTUALISEE', 'seed-chamber-finance', 'user-president-finance', '2026-03-11 10:00:00.000', 'user-rapporteur', '2026-03-27 13:00:00.000', '2026-04-05 11:26:11.268', '2026-04-05 11:26:11.268'),
('proposal-generated-from-report', 'user-citizen', 'Irregularites dans la gestion des fournitures hospitalieres', 'اختلالات في تسيير اللوازم الاستشفائية', 'Theme cree a partir du signalement report-governance-001. Entite cible: Ministere de la Sante. Justification de conversion: dossier relevant d\'un axe recurrent de controle.', 'موضوع تم إنشاؤه انطلاقا من تبليغ متعلق باختلالات في تسيير اللوازم الاستشفائية.', 'theme-health', 2027, 'EN_COURS_ANALYSE', 'seed-chamber-finance', 'user-president-finance', NULL, NULL, NULL, '2026-04-05 09:17:53.798', '2026-04-05 11:26:11.251'),
('proposal-hospital-2027', 'user-citizen', 'Audit des services d\'urgence hospitaliers', 'تدقيق خدمات الاستعجالات الاستشفائية', 'Evaluation de la disponibilite des soins, des achats d\'urgence et des delais de prise en charge dans les hopitaux publics.', 'تقييم توفر الرعاية وعمليات الشراء الاستعجالية وآجال التكفل في المستشفيات العمومية.', 'theme-health', 2027, 'EN_COURS_ANALYSE', 'seed-chamber-finance', 'user-president-finance', NULL, NULL, NULL, '2026-04-05 09:17:53.775', '2026-04-05 11:26:11.229'),
('proposal-school-canteen-2027', 'user-citizen-2', 'Controle de la restauration scolaire', 'controle-restauration-scolaire', 'Proposition de controle sur les marches de restauration scolaire, la qualite des prestations et la traçabilite des denrees.', 'controle-restauration-scolaire', 'theme-local', 2027, 'REJETEE', 'seed-chamber-local', 'user-president-local', '2026-03-14 08:00:00.000', 'user-rapporteur', '2026-03-21 08:00:00.000', '2026-04-05 11:26:11.257', '2026-04-05 11:26:11.257'),
('proposal-transport-2027', 'user-citizen', 'Transparence des marches de transport urbain', 'شفافية صفقات النقل الحضري', 'Analyse des marches publics de transport urbain, des criteres d\'attribution et du suivi d\'execution contractuelle.', 'تحليل صفقات النقل الحضري ومعايير الإسناد ومتابعة التنفيذ التعاقدي.', 'theme-transport', 2027, 'ACCEPTEE', 'seed-chamber-finance', 'user-president-finance', '2026-03-18 09:00:00.000', 'user-rapporteur', '2026-03-24 11:00:00.000', '2026-04-05 09:17:53.784', '2026-04-05 11:26:11.238');

-- --------------------------------------------------------

--
-- Table structure for table `proposalattachment`
--

CREATE TABLE `proposalattachment` (
  `id` varchar(191) NOT NULL,
  `proposalId` varchar(191) NOT NULL,
  `fileName` varchar(191) NOT NULL,
  `mimeType` varchar(191) NOT NULL,
  `fileSize` int(11) NOT NULL,
  `storagePath` varchar(191) NOT NULL,
  `uploadedByUserId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `proposalattachment`
--

INSERT INTO `proposalattachment` (`id`, `proposalId`, `fileName`, `mimeType`, `fileSize`, `storagePath`, `uploadedByUserId`, `createdAt`) VALUES
('proposal-attachment-hospital-1', 'proposal-hospital-2027', 'note-cadrage-hopitaux.pdf', 'application/pdf', 412000, '/uploads/proposals/note-cadrage-hopitaux.pdf', 'user-citizen', '2026-04-05 11:19:35.163'),
('proposal-attachment-stale-1', 'proposal-digital-archives-2027', 'inventaire-archives.csv', 'text/csv', 96000, '/uploads/proposals/inventaire-archives.csv', 'user-org-2', '2026-04-05 11:26:11.401'),
('proposal-attachment-transport-1', 'proposal-transport-2027', 'synthese-transport-urbain.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 286000, '/uploads/proposals/synthese-transport-urbain.docx', 'user-org', '2026-04-05 11:19:35.168');

-- --------------------------------------------------------

--
-- Table structure for table `proposalcomment`
--

CREATE TABLE `proposalcomment` (
  `id` varchar(191) NOT NULL,
  `proposalId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `isPublic` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `proposalcomment`
--

INSERT INTO `proposalcomment` (`id`, `proposalId`, `userId`, `body`, `isPublic`, `createdAt`) VALUES
('comment-hospital-1', 'proposal-hospital-2027', 'user-citizen', 'Le sujet concerne plusieurs etablissements avec tensions sur les achats d\'urgence.', 1, '2026-04-05 09:17:53.832'),
('comment-rejected-1', 'proposal-school-canteen-2027', 'user-org-2', 'Ce theme pourrait revenir dans un prochain exercice avec une focale regionale.', 1, '2026-04-05 11:26:11.340'),
('comment-stale-1', 'proposal-digital-archives-2027', 'user-citizen', 'Les archives numeriques restent un sujet cle mais il manque encore des elements documentes.', 1, '2026-04-05 11:26:11.347'),
('comment-transport-1', 'proposal-transport-2027', 'user-org', 'Des comparaisons inter-wilayas seraient utiles pour mesurer l\'efficacite du dispositif.', 1, '2026-04-05 09:17:53.839');

-- --------------------------------------------------------

--
-- Table structure for table `proposalfinalreport`
--

CREATE TABLE `proposalfinalreport` (
  `id` varchar(191) NOT NULL,
  `proposalId` varchar(191) NOT NULL,
  `fileName` varchar(191) NOT NULL,
  `storagePath` varchar(191) NOT NULL,
  `uploadedByUserId` varchar(191) NOT NULL,
  `publishedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `proposalfinalreport`
--

INSERT INTO `proposalfinalreport` (`id`, `proposalId`, `fileName`, `storagePath`, `uploadedByUserId`, `publishedAt`) VALUES
('proposal-final-report-transport', 'proposal-transport-2027', 'Synthese audit transport urbain', '/reports/synthese-audit-transport-urbain.pdf', 'user-admin', '2026-03-28 10:00:00.000');

-- --------------------------------------------------------

--
-- Table structure for table `proposallike`
--

CREATE TABLE `proposallike` (
  `id` varchar(191) NOT NULL,
  `proposalId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `proposallike`
--

INSERT INTO `proposallike` (`id`, `proposalId`, `userId`, `createdAt`) VALUES
('cmnljtb8y0006kf8cv31cacel', 'proposal-hospital-2027', 'user-citizen', '2026-04-05 09:17:53.842'),
('cmnljtb950008kf8cb28jc12m', 'proposal-hospital-2027', 'user-org', '2026-04-05 09:17:53.849'),
('cmnljtb9a000akf8c4k9reyc5', 'proposal-transport-2027', 'user-citizen', '2026-04-05 09:17:53.854'),
('cmnloeap5000ckfv4ldbpl928', 'proposal-school-canteen-2027', 'user-citizen', '2026-04-05 11:26:11.370'),
('cmnloeapd000ekfv4l5bppjv8', 'proposal-digital-archives-2027', 'user-citizen-2', '2026-04-05 11:26:11.377'),
('cmnloeapn000gkfv4r839afbw', 'proposal-digital-archives-2027', 'user-org-2', '2026-04-05 11:26:11.387');

-- --------------------------------------------------------

--
-- Table structure for table `proposalstatushistory`
--

CREATE TABLE `proposalstatushistory` (
  `id` varchar(191) NOT NULL,
  `proposalId` varchar(191) NOT NULL,
  `fromStatus` enum('RECU','EN_COURS_ANALYSE','ACCEPTEE','REJETEE','NON_ACTUALISEE') DEFAULT NULL,
  `toStatus` enum('RECU','EN_COURS_ANALYSE','ACCEPTEE','REJETEE','NON_ACTUALISEE') NOT NULL,
  `changedByUserId` varchar(191) NOT NULL,
  `note` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `proposalstatushistory`
--

INSERT INTO `proposalstatushistory` (`id`, `proposalId`, `fromStatus`, `toStatus`, `changedByUserId`, `note`, `createdAt`) VALUES
('proposal-history-generated-1', 'proposal-generated-from-report', NULL, 'EN_COURS_ANALYSE', 'user-president-finance', 'Creation automatique depuis un signalement converti', '2026-04-05 09:17:53.828'),
('proposal-history-hospital-1', 'proposal-hospital-2027', NULL, 'RECU', 'user-citizen', 'Soumission initiale', '2026-04-05 09:17:53.803'),
('proposal-history-hospital-2', 'proposal-hospital-2027', 'RECU', 'EN_COURS_ANALYSE', 'user-president-finance', 'Prise en charge par le president de chambre', '2026-04-05 09:17:53.811'),
('proposal-history-rejected-1', 'proposal-school-canteen-2027', NULL, 'RECU', 'user-citizen-2', 'Soumission initiale', '2026-04-05 11:26:11.304'),
('proposal-history-rejected-2', 'proposal-school-canteen-2027', 'RECU', 'REJETEE', 'user-rapporteur', 'Theme hors priorites annuelles', '2026-04-05 11:26:11.312'),
('proposal-history-stale-1', 'proposal-digital-archives-2027', NULL, 'RECU', 'user-org-2', 'Soumission initiale', '2026-04-05 11:26:11.317'),
('proposal-history-stale-2', 'proposal-digital-archives-2027', 'RECU', 'NON_ACTUALISEE', 'user-president-finance', 'Informations non actualisees dans les delais', '2026-04-05 11:26:11.323'),
('proposal-history-transport-1', 'proposal-transport-2027', NULL, 'RECU', 'user-citizen', 'Soumission initiale', '2026-04-05 09:17:53.816'),
('proposal-history-transport-2', 'proposal-transport-2027', 'RECU', 'EN_COURS_ANALYSE', 'user-president-finance', 'Analyse initiale', '2026-04-05 09:17:53.820'),
('proposal-history-transport-3', 'proposal-transport-2027', 'EN_COURS_ANALYSE', 'ACCEPTEE', 'user-rapporteur', 'Decision finale favorable', '2026-04-05 09:17:53.824');

-- --------------------------------------------------------

--
-- Table structure for table `proposalsummary`
--

CREATE TABLE `proposalsummary` (
  `id` varchar(191) NOT NULL,
  `proposalId` varchar(191) NOT NULL,
  `summaryText` text NOT NULL,
  `publishedByUserId` varchar(191) NOT NULL,
  `publishedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `proposalsummary`
--

INSERT INTO `proposalsummary` (`id`, `proposalId`, `summaryText`, `publishedByUserId`, `publishedAt`) VALUES
('proposal-summary-transport', 'proposal-transport-2027', 'Synthese publiee sur la transparence des marches de transport urbain et le suivi contractuel.', 'user-president-finance', '2026-03-26 09:00:00.000');

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `id` varchar(191) NOT NULL,
  `submittedByUserId` varchar(191) NOT NULL,
  `subject` varchar(191) NOT NULL,
  `targetEntityName` varchar(191) NOT NULL,
  `targetEntityType` enum('CENTRAL','LOCAL') NOT NULL,
  `centralAdministrationId` varchar(191) DEFAULT NULL,
  `localCollectivityId` varchar(191) DEFAULT NULL,
  `address` varchar(191) NOT NULL,
  `relationToEntity` varchar(191) NOT NULL,
  `circumstance` varchar(191) NOT NULL,
  `factsLocation` varchar(191) NOT NULL,
  `factsPeriodicity` varchar(191) NOT NULL,
  `irregularityDescription` text NOT NULL,
  `reportCategoryId` varchar(191) NOT NULL,
  `reportDate` datetime(3) NOT NULL,
  `currentStatus` enum('NON_TRAITE','REJETE','CONVERTI_EN_THEME') NOT NULL DEFAULT 'NON_TRAITE',
  `assignedChamberId` varchar(191) NOT NULL,
  `assignedPresidentUserId` varchar(191) DEFAULT NULL,
  `generatedProposalId` varchar(191) DEFAULT NULL,
  `acknowledgementNumber` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`id`, `submittedByUserId`, `subject`, `targetEntityName`, `targetEntityType`, `centralAdministrationId`, `localCollectivityId`, `address`, `relationToEntity`, `circumstance`, `factsLocation`, `factsPeriodicity`, `irregularityDescription`, `reportCategoryId`, `reportDate`, `currentStatus`, `assignedChamberId`, `assignedPresidentUserId`, `generatedProposalId`, `acknowledgementNumber`, `createdAt`, `updatedAt`) VALUES
('report-finance-001', 'user-citizen', 'Suspicion d\'irregularite sur un marche local', 'APC Alger Centre', 'LOCAL', NULL, 'local-alger-centre', 'Alger Centre', 'Usager du service public', 'Consultation des pieces communales', 'Alger Centre', 'Occasionnelle', 'Signalement relatif a des anomalies dans l\'execution et la tracabilite d\'un marche local.', 'report-finance', '2026-03-20 08:00:00.000', 'NON_TRAITE', 'seed-chamber-local', 'user-president-local', NULL, 'AR-2026-00421', '2026-04-05 09:17:53.873', '2026-04-05 11:26:11.504'),
('report-governance-001', 'user-citizen', 'Anomalies sur la gestion de fournitures hospitalieres', 'Ministere de la Sante', 'CENTRAL', 'central-health', NULL, 'Alger', 'Agent observateur', 'Examen de circuits de validation', 'Administration centrale', 'Recurrente', 'Constats repetes sur les fournitures hospitalieres, justifiant un theme de suivi institutionnel.', 'report-governance', '2026-03-15 09:00:00.000', 'CONVERTI_EN_THEME', 'seed-chamber-finance', 'user-president-finance', 'proposal-generated-from-report', 'AR-2026-00496', '2026-04-05 09:17:53.880', '2026-04-05 11:26:11.514'),
('report-procurement-001', 'user-citizen-2', 'Avenants repetitifs sur des marches d\'equipement communal', 'Ministere des Finances', 'CENTRAL', 'central-finance', NULL, 'Alger', 'Consultant externe', 'Analyse documentaire', 'Direction de la commande publique', 'Recurrente', 'Le signalement porte sur des avenants successifs et une hausse inhabituelle des montants dans plusieurs marches d\'equipement communal.', 'report-public-procurement', '2026-03-22 09:30:00.000', 'NON_TRAITE', 'seed-chamber-finance', 'user-president-finance', NULL, 'AR-2026-00518', '2026-04-05 11:26:11.547', '2026-04-05 11:26:11.547'),
('report-rejected-001', 'user-org', 'Signalement incomplet sur un dispositif local', 'APC Alger Centre', 'LOCAL', NULL, 'local-alger-centre', 'Alger Centre', 'Representant associatif', 'Depot documentaire incomplet', 'Alger Centre', 'Ponctuelle', 'Le signalement reste trop partiel pour permettre une instruction complete a ce stade.', 'report-governance', '2026-03-12 10:00:00.000', 'REJETE', 'seed-chamber-local', 'user-president-local', NULL, 'AR-2026-00407', '2026-04-05 09:17:53.887', '2026-04-05 11:26:11.538');

-- --------------------------------------------------------

--
-- Table structure for table `reportattachment`
--

CREATE TABLE `reportattachment` (
  `id` varchar(191) NOT NULL,
  `reportId` varchar(191) NOT NULL,
  `fileName` varchar(191) NOT NULL,
  `mimeType` varchar(191) NOT NULL,
  `fileSize` int(11) NOT NULL,
  `storagePath` varchar(191) NOT NULL,
  `uploadedByUserId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reportattachment`
--

INSERT INTO `reportattachment` (`id`, `reportId`, `fileName`, `mimeType`, `fileSize`, `storagePath`, `uploadedByUserId`, `createdAt`) VALUES
('report-attachment-finance-1', 'report-finance-001', 'pieces-marche-local.pdf', 'application/pdf', 524000, '/uploads/reports/pieces-marche-local.pdf', 'user-citizen', '2026-04-05 11:19:35.216'),
('report-attachment-governance-1', 'report-governance-001', 'releve-fournitures.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 198000, '/uploads/reports/releve-fournitures.xlsx', 'user-citizen', '2026-04-05 11:19:35.222'),
('report-attachment-procurement-1', 'report-procurement-001', 'avenants-communes.pdf', 'application/pdf', 438000, '/uploads/reports/avenants-communes.pdf', 'user-citizen-2', '2026-04-05 11:26:11.558'),
('report-attachment-rejected-1', 'report-rejected-001', 'declaration-partielle.txt', 'text/plain', 24000, '/uploads/reports/declaration-partielle.txt', 'user-org', '2026-04-05 11:26:11.531');

-- --------------------------------------------------------

--
-- Table structure for table `reportcategory`
--

CREATE TABLE `reportcategory` (
  `id` varchar(191) NOT NULL,
  `nameFr` varchar(191) NOT NULL,
  `nameAr` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reportcategory`
--

INSERT INTO `reportcategory` (`id`, `nameFr`, `nameAr`, `isActive`) VALUES
('report-finance', 'Irregularite financiere', 'مخالفة مالية', 1),
('report-governance', 'Gouvernance', 'الحوكمة', 1),
('report-public-procurement', 'Marches publics', 'marches-publics', 1);

-- --------------------------------------------------------

--
-- Table structure for table `reportstatushistory`
--

CREATE TABLE `reportstatushistory` (
  `id` varchar(191) NOT NULL,
  `reportId` varchar(191) NOT NULL,
  `fromStatus` enum('NON_TRAITE','REJETE','CONVERTI_EN_THEME') DEFAULT NULL,
  `toStatus` enum('NON_TRAITE','REJETE','CONVERTI_EN_THEME') NOT NULL,
  `changedByUserId` varchar(191) NOT NULL,
  `note` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reportstatushistory`
--

INSERT INTO `reportstatushistory` (`id`, `reportId`, `fromStatus`, `toStatus`, `changedByUserId`, `note`, `createdAt`) VALUES
('report-history-converted-1', 'report-governance-001', NULL, 'NON_TRAITE', 'user-citizen', 'Soumission initiale', '2026-04-05 09:17:53.901'),
('report-history-converted-2', 'report-governance-001', 'NON_TRAITE', 'CONVERTI_EN_THEME', 'user-president-finance', 'Conversion du signalement en theme', '2026-04-05 09:17:53.908'),
('report-history-pending-1', 'report-finance-001', NULL, 'NON_TRAITE', 'user-citizen', 'Soumission initiale', '2026-04-05 09:17:53.893'),
('report-history-procurement-1', 'report-procurement-001', NULL, 'NON_TRAITE', 'user-citizen-2', 'Soumission initiale', '2026-04-05 11:26:11.578');

-- --------------------------------------------------------

--
-- Table structure for table `reportsubject`
--

CREATE TABLE `reportsubject` (
  `id` varchar(191) NOT NULL,
  `submittedByUserId` varchar(191) NOT NULL,
  `titleFr` varchar(191) NOT NULL,
  `titleAr` varchar(191) NOT NULL,
  `descriptionFr` text NOT NULL,
  `descriptionAr` text NOT NULL,
  `categoryId` varchar(191) NOT NULL,
  `exerciseYear` int(11) NOT NULL,
  `currentStatus` enum('RECU','EN_COURS_ANALYSE','ACCEPTEE','REJETEE','NON_ACTUALISEE') NOT NULL DEFAULT 'RECU',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reportsubject`
--

INSERT INTO `reportsubject` (`id`, `submittedByUserId`, `titleFr`, `titleAr`, `descriptionFr`, `descriptionAr`, `categoryId`, `exerciseYear`, `currentStatus`, `createdAt`, `updatedAt`) VALUES
('report-subject-finance-2027', 'user-citizen', 'Controle des couts de maintenance des hopitaux universitaires', 'ظ…ط±ط§ظ‚ط¨ط© طھظƒط§ظ„ظٹظپ طµظٹط§ظ†ط© ط§ظ„ظ…ط³طھط´ظپظٹط§طھ ط§ظ„ط¬ط§ظ…ط¹ظٹط©', 'Le sujet vise a comparer les marches de maintenance, les delais d\'intervention et les couts reels supportes par les etablissements publics hospitaliers.', 'ظٹظ‡ط¯ظپ ط§ظ„ظ…ظˆط¶ظˆط¹ ط¥ظ„ظ‰ ظ…ظ‚ط§ط±ظ†ط© طµظپظ‚ط§طھ ط§ظ„طµظٹط§ظ†ط© ظˆط¢ط¬ط§ظ„ ط§ظ„طھط¯ط®ظ„ ظˆط§ظ„طھظƒط§ظ„ظٹظپ ط§ظ„ظپط¹ظ„ظٹط© ط§ظ„طھظٹ طھطھط­ظ…ظ„ظ‡ط§ ط§ظ„ظ…ط¤ط³ط³ط§طھ ط§ظ„ط§ط³طھط´ظپط§ط¦ظٹط© ط§ظ„ط¹ظ…ظˆظ…ظٹط©.', 'report-finance', 2027, 'EN_COURS_ANALYSE', '2026-04-05 11:13:26.340', '2026-04-05 11:26:11.406'),
('report-subject-governance-2027', 'user-org', 'Suivi des delegations de service public dans le transport urbain', 'ظ…طھط§ط¨ط¹ط© طھظپظˆظٹط¶ ط§ظ„ط®ط¯ظ…ط§طھ ط§ظ„ط¹ظ…ظˆظ…ظٹط© ظپظٹ ط§ظ„ظ†ظ‚ظ„ ط§ظ„ط­ط¶ط±ظٹ', 'La suggestion porte sur la transparence des contrats, les indicateurs de performance et les mecanismes de controle associes aux delegations de transport urbain.', 'ظٹطھط¹ظ„ظ‚ ط§ظ„ط§ظ‚طھط±ط§ط­ ط¨ط´ظپط§ظپظٹط© ط§ظ„ط¹ظ‚ظˆط¯ ظˆظ…ط¤ط´ط±ط§طھ ط§ظ„ط£ط¯ط§ط، وظآليات الرقابة المرتبطة بتفويضات النقل الحضري.', 'report-governance', 2027, 'RECU', '2026-04-05 11:13:26.345', '2026-04-05 11:26:11.414'),
('report-subject-procurement-2027', 'user-citizen-2', 'Controle des avenants dans les marches publics communaux', 'controle-avenants-marches-communaux', 'Suggestion portant sur la frequence des avenants, leur justification et l\'evolution financiere des marches publics communaux.', 'controle-avenants-marches-communaux', 'report-public-procurement', 2027, 'ACCEPTEE', '2026-04-05 11:26:11.421', '2026-04-05 11:26:11.421'),
('report-subject-school-2027', 'user-org-2', 'Controle des achats de fournitures scolaires', 'controle-fournitures-scolaires', 'Suggestion citoyenne sur la programmation des achats, la livraison et la qualite des fournitures scolaires dans plusieurs wilayas.', 'controle-fournitures-scolaires', 'report-finance', 2027, 'REJETEE', '2026-04-05 11:26:11.429', '2026-04-05 11:26:11.429');

-- --------------------------------------------------------

--
-- Table structure for table `reportsubjectcomment`
--

CREATE TABLE `reportsubjectcomment` (
  `id` varchar(191) NOT NULL,
  `reportSubjectId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `isPublic` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reportsubjectcomment`
--

INSERT INTO `reportsubjectcomment` (`id`, `reportSubjectId`, `userId`, `body`, `isPublic`, `createdAt`) VALUES
('report-subject-comment-1', 'report-subject-finance-2027', 'user-org', 'Une comparaison entre CHU et etablissements regionaux serait tres utile.', 1, '2026-04-05 11:13:26.350'),
('report-subject-comment-2', 'report-subject-governance-2027', 'user-citizen', 'Le suivi des indicateurs contractuels devrait etre publie wilaya par wilaya.', 1, '2026-04-05 11:13:26.353'),
('report-subject-comment-3', 'report-subject-procurement-2027', 'user-org', 'Les avenants repetitifs meritaient deja une revue systematique.', 1, '2026-04-05 11:26:11.444'),
('report-subject-comment-4', 'report-subject-school-2027', 'user-citizen-2', 'Le sujet reste interessant meme s\'il n\'est pas retenu cette annee.', 1, '2026-04-05 11:26:11.452');

-- --------------------------------------------------------

--
-- Table structure for table `reportsubjectlike`
--

CREATE TABLE `reportsubjectlike` (
  `id` varchar(191) NOT NULL,
  `reportSubjectId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reportsubjectlike`
--

INSERT INTO `reportsubjectlike` (`id`, `reportSubjectId`, `userId`, `createdAt`) VALUES
('cmnlnxweu000ckfhkrkubw0n3', 'report-subject-finance-2027', 'user-citizen', '2026-04-05 11:13:26.358'),
('cmnlnxwex000ekfhkynj1frv9', 'report-subject-finance-2027', 'user-org', '2026-04-05 11:13:26.362'),
('cmnlnxwf3000gkfhks0lrc583', 'report-subject-governance-2027', 'user-citizen', '2026-04-05 11:13:26.367'),
('cmnloearz000okfv4tcxzphky', 'report-subject-procurement-2027', 'user-citizen', '2026-04-05 11:26:11.471'),
('cmnloeas8000qkfv4s05pizk4', 'report-subject-procurement-2027', 'user-org-2', '2026-04-05 11:26:11.480'),
('cmnloeasd000skfv4a4q7ah88', 'report-subject-school-2027', 'user-citizen-2', '2026-04-05 11:26:11.485');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` varchar(191) NOT NULL,
  `code` enum('CITIZEN','ORG','PRESIDENT','RAPPORTEUR_GENERAL','ADMIN') NOT NULL,
  `label` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `code`, `label`) VALUES
('cmnljta9b0000kf8c8uk8uzwz', 'CITIZEN', 'Citoyen'),
('cmnljta9m0001kf8c5rl737r3', 'ORG', 'Organisation societe civile'),
('cmnljta9v0002kf8c2c4lv1ca', 'PRESIDENT', 'President de chambre'),
('cmnljtaa00003kf8c14pn5uvj', 'RAPPORTEUR_GENERAL', 'Rapporteur general'),
('cmnljtaa50004kf8ce80co79m', 'ADMIN', 'Administrateur');

-- --------------------------------------------------------

--
-- Table structure for table `themecategory`
--

CREATE TABLE `themecategory` (
  `id` varchar(191) NOT NULL,
  `nameFr` varchar(191) NOT NULL,
  `nameAr` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `chamberId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `themecategory`
--

INSERT INTO `themecategory` (`id`, `nameFr`, `nameAr`, `isActive`, `chamberId`) VALUES
('theme-health', 'Sante publique', 'الصحة العمومية', 1, 'seed-chamber-finance'),
('theme-local', 'Collectivites locales', 'الجماعات المحلية', 1, 'seed-chamber-local'),
('theme-transport', 'Transport public', 'النقل العمومي', 1, 'seed-chamber-finance');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `userType` enum('CITIZEN','CIVIL_SOCIETY_ORG','INTERNAL') NOT NULL,
  `firstName` varchar(191) NOT NULL,
  `lastName` varchar(191) NOT NULL,
  `pseudonym` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `nin` varchar(191) DEFAULT NULL,
  `passwordHash` varchar(191) NOT NULL,
  `sex` enum('MALE','FEMALE') DEFAULT NULL,
  `ageRange` enum('UNDER_25','FROM_25_TO_34','FROM_35_TO_44','FROM_45_TO_59','ABOVE_60') DEFAULT NULL,
  `organizationName` varchar(191) DEFAULT NULL,
  `emailVerifiedAt` datetime(3) DEFAULT NULL,
  `twoFactorEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `accountStatus` enum('PENDING','ACTIVE','REFUSED','BLOCKED','SUSPENDED') NOT NULL DEFAULT 'PENDING',
  `chamberId` varchar(191) DEFAULT NULL,
  `professionalStatusId` varchar(191) DEFAULT NULL,
  `wilayaId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `userType`, `firstName`, `lastName`, `pseudonym`, `email`, `phone`, `nin`, `passwordHash`, `sex`, `ageRange`, `organizationName`, `emailVerifiedAt`, `twoFactorEnabled`, `accountStatus`, `chamberId`, `professionalStatusId`, `wilayaId`, `createdAt`, `updatedAt`) VALUES
('user-admin', 'INTERNAL', 'Admin', 'CDC', 'admin-cdc', 'admin@cdc.dz', '0550000005', '555555555555555555', '$2b$10$JqvE40lI.l/Cy2JTk2/wQOKAj.cBwJw4fu9CZoQV7vX7vwchkCrgG', 'MALE', 'FROM_35_TO_44', NULL, '2025-12-19 08:00:00.000', 1, 'ACTIVE', 'seed-chamber-finance', 'prof-1', 'wil-16', '2026-04-05 09:17:53.763', '2026-04-05 11:26:10.732'),
('user-citizen', 'CITIZEN', 'Nadia', 'Rahmani', 'nadia-citoyenne', 'citizen@cdc.dz', '0550000001', '111111111111111111', '$2b$10$ROfePae6vwAgBcsTDu4pqeXorbgsWAFIOgzDQFiOYrHPAITIdhG5G', 'FEMALE', 'FROM_25_TO_34', NULL, '2026-01-08 08:00:00.000', 0, 'ACTIVE', NULL, 'prof-1', 'wil-16', '2026-04-05 09:17:52.929', '2026-04-05 11:26:10.132'),
('user-citizen-2', 'CITIZEN', 'Farid', 'Khellaf', 'farid-observateur', 'farid@cdc.dz', '0550000011', '777777777777777777', '$2b$10$s7fKIkdNwGkKy1lOQs6DWOUjOIM/lcoNtpj96Qldfuprtl5MTecpi', 'MALE', 'FROM_35_TO_44', NULL, '2026-01-10 10:00:00.000', 0, 'ACTIVE', NULL, 'prof-5', 'wil-31', '2026-04-05 11:26:10.860', '2026-04-05 11:26:10.860'),
('user-citizen-3', 'CITIZEN', 'Amal', 'Bouziane', 'amal-civique', 'amal@cdc.dz', '0550000012', '888888888888888888', '$2b$10$7aOeiVm1jYzmJ/6l/5dwAuEAw97OLqjJGDySjYT4ELrY3n/h/uVxy', 'FEMALE', 'FROM_25_TO_34', NULL, '2026-02-03 11:00:00.000', 0, 'BLOCKED', NULL, 'prof-6', 'wil-23', '2026-04-05 11:26:11.000', '2026-04-05 11:26:11.000'),
('user-org', 'CIVIL_SOCIETY_ORG', 'Forum', 'Associatif', 'forum-associations', 'org@cdc.dz', '0550000002', '222222222222222222', '$2b$10$sCOGa32RWgtdZZRDvj97ru3pQ/coL.tIivqQF/Mc.rA5F4rPwkDUq', 'MALE', 'FROM_35_TO_44', 'Forum des associations', NULL, 0, 'PENDING', NULL, 'prof-2', 'wil-31', '2026-04-05 09:17:53.105', '2026-04-05 11:26:10.248'),
('user-org-2', 'CIVIL_SOCIETY_ORG', 'Maison', 'Citoyenne', 'maison-citoyenne', 'association@cdc.dz', '0550000013', '999999999999999999', '$2b$10$0xub0JTc/TA/Q2t7YwYXvelk0aU1xBxtYTws7kf3bkKsMtfPtgcAS', 'FEMALE', 'FROM_35_TO_44', 'Maison citoyenne d\'Oran', '2026-01-16 09:30:00.000', 0, 'ACTIVE', NULL, 'prof-2', 'wil-31', '2026-04-05 11:26:11.213', '2026-04-05 11:26:11.213'),
('user-president-finance', 'INTERNAL', 'Karim', 'Bensaid', 'president-finance', 'president@cdc.dz', '0550000003', '333333333333333333', '$2b$10$OAqer.rBpTbbM.FSKQjPJueD2RxCmU24.BFi2weLXr5YROlgioDXm', 'MALE', 'FROM_45_TO_59', NULL, '2025-12-20 08:00:00.000', 1, 'ACTIVE', 'seed-chamber-finance', 'prof-1', 'wil-16', '2026-04-05 09:17:53.251', '2026-04-05 11:26:10.358'),
('user-president-local', 'INTERNAL', 'Salima', 'Mansouri', 'president-local', 'president-local@cdc.dz', '0550000006', '666666666666666666', '$2b$10$.Xk3jUqao3XPSa56otlQvu8/1mZAiyCAPD7c0CjwsmH5HW9IivxXC', 'FEMALE', 'FROM_45_TO_59', NULL, '2025-12-21 08:00:00.000', 1, 'ACTIVE', 'seed-chamber-local', 'prof-1', 'wil-25', '2026-04-05 09:17:53.427', '2026-04-05 11:26:10.479'),
('user-rapporteur', 'INTERNAL', 'Yacine', 'Merabet', 'rapporteur-general', 'rapporteur@cdc.dz', '0550000004', '444444444444444444', '$2b$10$SGS3uqBO9E4tOlbCcjtqK.AJi7MeBjKXEJznjksfaKBOUqDU5GlFa', 'MALE', 'FROM_35_TO_44', NULL, '2025-12-22 08:00:00.000', 1, 'ACTIVE', 'seed-chamber-finance', 'prof-1', 'wil-16', '2026-04-05 09:17:53.583', '2026-04-05 11:26:10.607');

-- --------------------------------------------------------

--
-- Table structure for table `userrole`
--

CREATE TABLE `userrole` (
  `userId` varchar(191) NOT NULL,
  `roleId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `userrole`
--

INSERT INTO `userrole` (`userId`, `roleId`) VALUES
('user-admin', 'cmnljtaa50004kf8ce80co79m'),
('user-citizen', 'cmnljta9b0000kf8c8uk8uzwz'),
('user-citizen-2', 'cmnljta9b0000kf8c8uk8uzwz'),
('user-citizen-3', 'cmnljta9b0000kf8c8uk8uzwz'),
('user-org', 'cmnljta9m0001kf8c5rl737r3'),
('user-org-2', 'cmnljta9m0001kf8c5rl737r3'),
('user-president-finance', 'cmnljta9v0002kf8c2c4lv1ca'),
('user-president-local', 'cmnljta9v0002kf8c2c4lv1ca'),
('user-rapporteur', 'cmnljtaa00003kf8c14pn5uvj');

-- --------------------------------------------------------

--
-- Table structure for table `wilaya`
--

CREATE TABLE `wilaya` (
  `id` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `nameFr` varchar(191) NOT NULL,
  `nameAr` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wilaya`
--

INSERT INTO `wilaya` (`id`, `code`, `nameFr`, `nameAr`, `isActive`) VALUES
('wil-16', '16', 'Alger', 'الجزائر', 1),
('wil-19', '19', 'Setif', 'سطيف', 1),
('wil-23', '23', 'Annaba', 'annaba', 1),
('wil-25', '25', 'Constantine', 'قسنطينة', 1),
('wil-31', '31', 'Oran', 'وهران', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accountblock`
--
ALTER TABLE `accountblock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `AccountBlock_userId_fkey` (`userId`),
  ADD KEY `AccountBlock_blockedByUserId_fkey` (`blockedByUserId`);

--
-- Indexes for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `AuditLog_actorUserId_fkey` (`actorUserId`);

--
-- Indexes for table `centraladministration`
--
ALTER TABLE `centraladministration`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CentralAdministration_chamberId_fkey` (`chamberId`);

--
-- Indexes for table `chamber`
--
ALTER TABLE `chamber`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `localcollectivity`
--
ALTER TABLE `localcollectivity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `LocalCollectivity_wilayaId_fkey` (`wilayaId`),
  ADD KEY `LocalCollectivity_chamberId_fkey` (`chamberId`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Notification_userId_fkey` (`userId`);

--
-- Indexes for table `professionalstatus`
--
ALTER TABLE `professionalstatus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `proposal`
--
ALTER TABLE `proposal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Proposal_submittedByUserId_fkey` (`submittedByUserId`),
  ADD KEY `Proposal_categoryId_fkey` (`categoryId`),
  ADD KEY `Proposal_assignedChamberId_fkey` (`assignedChamberId`);

--
-- Indexes for table `proposalattachment`
--
ALTER TABLE `proposalattachment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProposalAttachment_proposalId_fkey` (`proposalId`),
  ADD KEY `ProposalAttachment_uploadedByUserId_fkey` (`uploadedByUserId`);

--
-- Indexes for table `proposalcomment`
--
ALTER TABLE `proposalcomment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProposalComment_proposalId_fkey` (`proposalId`),
  ADD KEY `ProposalComment_userId_fkey` (`userId`);

--
-- Indexes for table `proposalfinalreport`
--
ALTER TABLE `proposalfinalreport`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProposalFinalReport_proposalId_fkey` (`proposalId`),
  ADD KEY `ProposalFinalReport_uploadedByUserId_fkey` (`uploadedByUserId`);

--
-- Indexes for table `proposallike`
--
ALTER TABLE `proposallike`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ProposalLike_proposalId_userId_key` (`proposalId`,`userId`),
  ADD KEY `ProposalLike_userId_fkey` (`userId`);

--
-- Indexes for table `proposalstatushistory`
--
ALTER TABLE `proposalstatushistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProposalStatusHistory_proposalId_fkey` (`proposalId`),
  ADD KEY `ProposalStatusHistory_changedByUserId_fkey` (`changedByUserId`);

--
-- Indexes for table `proposalsummary`
--
ALTER TABLE `proposalsummary`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProposalSummary_proposalId_fkey` (`proposalId`),
  ADD KEY `ProposalSummary_publishedByUserId_fkey` (`publishedByUserId`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Report_acknowledgementNumber_key` (`acknowledgementNumber`),
  ADD UNIQUE KEY `Report_generatedProposalId_key` (`generatedProposalId`),
  ADD KEY `Report_submittedByUserId_fkey` (`submittedByUserId`),
  ADD KEY `Report_centralAdministrationId_fkey` (`centralAdministrationId`),
  ADD KEY `Report_localCollectivityId_fkey` (`localCollectivityId`),
  ADD KEY `Report_reportCategoryId_fkey` (`reportCategoryId`),
  ADD KEY `Report_assignedChamberId_fkey` (`assignedChamberId`);

--
-- Indexes for table `reportattachment`
--
ALTER TABLE `reportattachment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ReportAttachment_reportId_fkey` (`reportId`),
  ADD KEY `ReportAttachment_uploadedByUserId_fkey` (`uploadedByUserId`);

--
-- Indexes for table `reportcategory`
--
ALTER TABLE `reportcategory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reportstatushistory`
--
ALTER TABLE `reportstatushistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ReportStatusHistory_reportId_fkey` (`reportId`),
  ADD KEY `ReportStatusHistory_changedByUserId_fkey` (`changedByUserId`);

--
-- Indexes for table `reportsubject`
--
ALTER TABLE `reportsubject`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ReportSubject_submittedByUserId_fkey` (`submittedByUserId`),
  ADD KEY `ReportSubject_categoryId_fkey` (`categoryId`);

--
-- Indexes for table `reportsubjectcomment`
--
ALTER TABLE `reportsubjectcomment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ReportSubjectComment_reportSubjectId_fkey` (`reportSubjectId`),
  ADD KEY `ReportSubjectComment_userId_fkey` (`userId`);

--
-- Indexes for table `reportsubjectlike`
--
ALTER TABLE `reportsubjectlike`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ReportSubjectLike_reportSubjectId_userId_key` (`reportSubjectId`,`userId`),
  ADD KEY `ReportSubjectLike_userId_fkey` (`userId`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Role_code_key` (`code`);

--
-- Indexes for table `themecategory`
--
ALTER TABLE `themecategory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ThemeCategory_chamberId_fkey` (`chamberId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_pseudonym_key` (`pseudonym`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD UNIQUE KEY `User_nin_key` (`nin`),
  ADD KEY `User_chamberId_fkey` (`chamberId`),
  ADD KEY `User_professionalStatusId_fkey` (`professionalStatusId`),
  ADD KEY `User_wilayaId_fkey` (`wilayaId`);

--
-- Indexes for table `userrole`
--
ALTER TABLE `userrole`
  ADD PRIMARY KEY (`userId`,`roleId`),
  ADD KEY `UserRole_roleId_fkey` (`roleId`);

--
-- Indexes for table `wilaya`
--
ALTER TABLE `wilaya`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Wilaya_code_key` (`code`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accountblock`
--
ALTER TABLE `accountblock`
  ADD CONSTRAINT `AccountBlock_blockedByUserId_fkey` FOREIGN KEY (`blockedByUserId`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `AccountBlock_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD CONSTRAINT `AuditLog_actorUserId_fkey` FOREIGN KEY (`actorUserId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `centraladministration`
--
ALTER TABLE `centraladministration`
  ADD CONSTRAINT `CentralAdministration_chamberId_fkey` FOREIGN KEY (`chamberId`) REFERENCES `chamber` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `localcollectivity`
--
ALTER TABLE `localcollectivity`
  ADD CONSTRAINT `LocalCollectivity_chamberId_fkey` FOREIGN KEY (`chamberId`) REFERENCES `chamber` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `LocalCollectivity_wilayaId_fkey` FOREIGN KEY (`wilayaId`) REFERENCES `wilaya` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `proposal`
--
ALTER TABLE `proposal`
  ADD CONSTRAINT `Proposal_assignedChamberId_fkey` FOREIGN KEY (`assignedChamberId`) REFERENCES `chamber` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Proposal_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `themecategory` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Proposal_submittedByUserId_fkey` FOREIGN KEY (`submittedByUserId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `proposalattachment`
--
ALTER TABLE `proposalattachment`
  ADD CONSTRAINT `ProposalAttachment_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ProposalAttachment_uploadedByUserId_fkey` FOREIGN KEY (`uploadedByUserId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `proposalcomment`
--
ALTER TABLE `proposalcomment`
  ADD CONSTRAINT `ProposalComment_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ProposalComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `proposalfinalreport`
--
ALTER TABLE `proposalfinalreport`
  ADD CONSTRAINT `ProposalFinalReport_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ProposalFinalReport_uploadedByUserId_fkey` FOREIGN KEY (`uploadedByUserId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `proposallike`
--
ALTER TABLE `proposallike`
  ADD CONSTRAINT `ProposalLike_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ProposalLike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `proposalstatushistory`
--
ALTER TABLE `proposalstatushistory`
  ADD CONSTRAINT `ProposalStatusHistory_changedByUserId_fkey` FOREIGN KEY (`changedByUserId`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ProposalStatusHistory_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `proposalsummary`
--
ALTER TABLE `proposalsummary`
  ADD CONSTRAINT `ProposalSummary_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ProposalSummary_publishedByUserId_fkey` FOREIGN KEY (`publishedByUserId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `Report_assignedChamberId_fkey` FOREIGN KEY (`assignedChamberId`) REFERENCES `chamber` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Report_centralAdministrationId_fkey` FOREIGN KEY (`centralAdministrationId`) REFERENCES `centraladministration` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Report_generatedProposalId_fkey` FOREIGN KEY (`generatedProposalId`) REFERENCES `proposal` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Report_localCollectivityId_fkey` FOREIGN KEY (`localCollectivityId`) REFERENCES `localcollectivity` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Report_reportCategoryId_fkey` FOREIGN KEY (`reportCategoryId`) REFERENCES `reportcategory` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Report_submittedByUserId_fkey` FOREIGN KEY (`submittedByUserId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `reportattachment`
--
ALTER TABLE `reportattachment`
  ADD CONSTRAINT `ReportAttachment_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `report` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ReportAttachment_uploadedByUserId_fkey` FOREIGN KEY (`uploadedByUserId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `reportstatushistory`
--
ALTER TABLE `reportstatushistory`
  ADD CONSTRAINT `ReportStatusHistory_changedByUserId_fkey` FOREIGN KEY (`changedByUserId`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ReportStatusHistory_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `report` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reportsubject`
--
ALTER TABLE `reportsubject`
  ADD CONSTRAINT `ReportSubject_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `reportcategory` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ReportSubject_submittedByUserId_fkey` FOREIGN KEY (`submittedByUserId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `reportsubjectcomment`
--
ALTER TABLE `reportsubjectcomment`
  ADD CONSTRAINT `ReportSubjectComment_reportSubjectId_fkey` FOREIGN KEY (`reportSubjectId`) REFERENCES `reportsubject` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ReportSubjectComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `reportsubjectlike`
--
ALTER TABLE `reportsubjectlike`
  ADD CONSTRAINT `ReportSubjectLike_reportSubjectId_fkey` FOREIGN KEY (`reportSubjectId`) REFERENCES `reportsubject` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ReportSubjectLike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `themecategory`
--
ALTER TABLE `themecategory`
  ADD CONSTRAINT `ThemeCategory_chamberId_fkey` FOREIGN KEY (`chamberId`) REFERENCES `chamber` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `User_chamberId_fkey` FOREIGN KEY (`chamberId`) REFERENCES `chamber` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `User_professionalStatusId_fkey` FOREIGN KEY (`professionalStatusId`) REFERENCES `professionalstatus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `User_wilayaId_fkey` FOREIGN KEY (`wilayaId`) REFERENCES `wilaya` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `userrole`
--
ALTER TABLE `userrole`
  ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
