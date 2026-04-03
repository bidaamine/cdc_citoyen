# Prompt maître Codex — Génération du projet Espace citoyen

Tu es un ingénieur logiciel senior full-stack. Construis une plateforme web institutionnelle nommée **Espace citoyen** pour la **Cour des comptes**, en respectant strictement les exigences ci-dessous.

## Stack obligatoire
- Next.js latest avec App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- MySQL
- Prisma ORM
- NextAuth ou système d’auth équivalent sécurisé
- i18n français + arabe avec support RTL

## Objectif produit
La plateforme comporte deux modules :
1. **Participation citoyenne** : permettre aux citoyens et organisations de la société civile de proposer des thèmes de contrôle/enquête.
2. **Signalement** : permettre aux citoyens de déposer des dossiers documentés concernant des irrégularités, avec confidentialité forte.

## Rôles
- Citoyen
- Organisation de la société civile
- Président de chambre
- Rapporteur général
- Administrateur

## Exigences majeures
- Interface intuitive, responsive, accessible.
- Support multilingue FR/AR.
- Contrôle d’accès basé sur les rôles.
- Auth par email/mot de passe.
- Support 2FA.
- Notifications email + in-app.
- Audit logs complets.
- Validation stricte des uploads.
- Sécurité contre SQL injection, XSS, CSRF.
- Chiffrement des données sensibles.
- Tableaux de bord et statistiques.
- Exports PDF/Excel.

## Module 1 — Participation citoyenne

### Règles métier
- Les propositions ne peuvent être soumises qu’entre **le 1er janvier et le 31 mars**.
- Le champ exercice est automatiquement affecté à **l’année n+1** et n’est pas modifiable.
- Chaque catégorie de thème est associée à une chambre compétente.

### Inscription simplifiée
Champs :
- type: citoyen ou organisation de la société civile
- organisation conditionnelle
- nom
- prénom
- email
- pseudonyme
- wilaya
- statut professionnel
- tranche d’âge
- sexe
- mot de passe
- confirmation du mot de passe

### Formulaire proposition
Champs :
- titre FR
- titre AR
- description FR
- description AR
- catégorie
- exercice année n+1 auto-rempli
- pièces jointes

### Recherche thèmes
Filtres :
- mots-clés
- catégorie
- wilaya
- exercice
- type: plan d’action / proposés / retenus

### Interactions publiques
- likes
- commentaires

### Workflow propositions
- citoyen soumet
- système confirme réception
- système oriente vers président compétent
- président met statut en cours d’analyse
- président transmet au rapporteur général
- rapporteur décide acceptée / rejetée / non actualisée
- notifications à chaque étape

### Statuts propositions
- RECU
- EN_COURS_ANALYSE
- ACCEPTEE
- REJETEE
- NON_ACTUALISEE

## Module 2 — Signalement

### Contraintes
- anonymat vis-à-vis des autres internautes uniquement ;
- identité réelle connue de l’administration ;
- afficher un avertissement juridique clair avant dépôt ;
- fournir accès aux textes réglementaires ;
- fournir téléchargement du document d’engagement de confidentialité.

### Inscription signalement
Champs :
- type
- organisation conditionnelle
- nom
- prénom
- téléphone
- email
- pseudonyme
- NIN
- wilaya
- statut professionnel
- tranche d’âge
- sexe
- mot de passe
- confirmation du mot de passe

### Formulaire signalement
Champs :
- objet du signalement
- entité concernée
- nature de l’entité: central ou local
- administration centrale conditionnelle
- collectivité locale conditionnelle
- adresse
- poste / relation vis-à-vis de l’organisme
- circonstance
- localisation
- périodicité
- description détaillée de l’irrégularité
- catégorie du signalement
- date du jour auto-remplie non modifiable
- pièces jointes (20 Mo max par fichier, 100 Mo max au total)

### Workflow signalement
- citoyen authentifié remplit dossier
- système enregistre et génère accusé de réception
- système oriente vers président de chambre compétent
- président examine
- président met statut non traité / rejeté / converti en thème
- citoyen reçoit notifications

### Statuts signalement
- NON_TRAITE
- REJETE
- CONVERTI_EN_THEME

## Back-office Président de chambre
Fonctionnalités :
- moteur de recherche propositions
- validation avant publication
- reformulation de l’intitulé des thèmes
- suppression de thèmes
- publication synthèses de résultats
- téléversement rapport final PDF
- statistiques sur volume/catégorie/statut/issue
- recherche signalements
- validation signalements
- suppression signalements

## Back-office Rapporteur général
Fonctionnalités :
- ajout de thème au plan d’action annuel
- ajout des thèmes validés au plan d’action final
- décision finale sur propositions

## Administration
Fonctionnalités :
- gestion comptes citoyens
- blocage/déblocage avec motif et traçabilité
- gestion profils internes
- gestion des référentiels paramétrables
- gestion des mappings catégorie→chambre et entité→chambre
- dashboards statistiques
- exports PDF/Excel
- audit logs

## Référentiels paramétrables
- wilayas
- statuts professionnels
- catégories de thèmes
- catégories de signalement
- administrations centrales
- collectivités locales

## KPI et statistiques
Prévoir des dashboards administrateur pour :
- volume propositions par période
- soutiens/commentaires par proposition
- répartition géographique des propositions
- démographie contributeurs
- thèmes populaires
- pourcentage de propositions retenues
- rapports publiés issus des propositions
- visiteurs uniques
- taux de conversion
- volume signalements
- répartition par type d’irrégularité
- entités signalées
- répartition par wilaya
- taux de recevabilité
- nombre de signalements transmis
- nombre d’enquêtes déclenchées
- rapports publiés suite à signalements
- signalements abusifs ou bloqués

## Pages à générer
Génère toutes les pages décrites dans `01-pages-and-routes.md`, avec layouts distincts par rôle.

## Contraintes d’implémentation
- code propre et modulaire ;
- séparation claire frontend/backend/data ;
- composants réutilisables shadcn ;
- formulaires validés avec schémas ;
- upload sécurisé ;
- pagination, filtres et recherche ;
- journalisation systématique des actions sensibles ;
- seed Prisma pour référentiels de base ;
- README de démarrage ;
- scripts migration + seed ;
- données mock réalistes ;
- tests unitaires et d’intégration sur flux critiques.

## Livrable attendu de Codex
1. structure complète du projet ;
2. schéma Prisma ;
3. pages publiques ;
4. espace citoyen ;
5. back-office président ;
6. back-office rapporteur ;
7. back-office admin ;
8. auth + RBAC + 2FA ;
9. notifications ;
10. audit logs ;
11. dashboard statistiques ;
12. README d’installation et de déploiement.

Commence par produire :
- l’arborescence du projet ;
- le schéma Prisma complet ;
- la stratégie RBAC ;
- les routes Next.js ;
- puis le code des pages et APIs par lots cohérents.

