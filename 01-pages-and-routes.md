# Pages, routes et écrans — Espace citoyen

Ce document liste **toutes les pages nécessaires** pour une V1 conforme au CDC, avec séparation entre **pages explicitement demandées** et **pages techniques nécessaires** pour livrer correctement le produit.

---

## 1. Pages publiques

### 1.1 `/`
**Nom**: Accueil Espace citoyen  
**But**: présenter la plateforme, ses deux modules, ses objectifs, les règles de participation et les liens d’accès principaux.

**Contenu**
- Hero institutionnel Cour des comptes.
- Présentation du module **Participation citoyenne**.
- Présentation du module **Signalement**.
- Bloc “Comment ça marche”.
- Mise en avant des statistiques publiques simplifiées.
- CTA vers inscription, connexion, consultation des thèmes, dépôt de proposition, dépôt de signalement.
- Liens vers CGU, politique de confidentialité, cadre légal, engagement de confidentialité.

**Composants**
- Navbar multilingue FR/AR.
- Bandeau de changement de langue.
- Cards modules.
- Section statistiques publiques.
- Footer institutionnel.

---

### 1.2 `/participation`
**Nom**: Landing module participation citoyenne  
**But**: expliquer le dépôt de thèmes, la période d’ouverture annuelle, le processus, les statuts et les règles.

**Contenu**
- Description du module.
- Rappel de la fenêtre de soumission : **01 janvier → 31 mars**.
- Statuts possibles : reçu, en cours d’analyse, acceptée, rejetée, non actualisée.
- CTA vers inscription/connexion.
- Accès à la recherche de thèmes.

---

### 1.3 `/signalement`
**Nom**: Landing module signalement  
**But**: expliquer la portée du signalement, ses implications, les protections et les limites.

**Contenu**
- Texte d’avertissement clair sur la gravité du signalement.
- Mention sur risque de calomnie/diffamation.
- Explication de la confidentialité.
- Distinction entre anonymat public et identité vérifiée par l’administration.
- Accès au cadre légal.
- Téléchargement du document d’engagement de la Cour.
- CTA vers inscription/connexion.

---

### 1.4 `/themes`
**Nom**: Recherche et consultation des thèmes  
**But**: moteur de recherche des thèmes proposés, retenus et du plan d’action.

**Filtres explicitement requis**
- mots-clés ;
- catégorie ;
- wilaya ;
- exercice ;
- type de thème : plan d’action / proposés / retenus.

**Résultats**
- cartes ou tableau des thèmes ;
- titre FR + AR ;
- catégorie ;
- exercice ;
- type ;
- compteur likes ;
- nombre de commentaires ;
- état de publication.

---

### 1.5 `/themes/[id]`
**Nom**: Détail d’un thème  
**But**: afficher le détail d’un thème proposé, retenu ou publié au plan d’action.

**Contenu**
- titre FR/AR ;
- description FR/AR ;
- catégorie ;
- exercice ;
- auteur public via pseudonyme ;
- pièces jointes visibles si autorisées ;
- bouton Like ;
- fil de commentaires ;
- synthèse publiée par la Cour ;
- rapport final PDF si disponible.

---

### 1.6 `/reports`
**Nom**: Rapports issus des thèmes retenus  
**But**: centraliser les rapports finaux publiés.

**Contenu**
- liste filtrable des rapports ;
- téléchargement PDF ;
- tri par exercice, catégorie, date de publication.

---

### 1.7 `/legal/reporting-framework`
**Nom**: Cadre juridique du signalement  
**But**: mettre à disposition les textes réglementaires encadrant la procédure de signalement.

---

### 1.8 `/legal/privacy-commitment`
**Nom**: Engagement de confidentialité Cour des comptes  
**But**: afficher et permettre le téléchargement du document d’engagement mentionné dans le CDC.

---

### 1.9 `/stats`
**Nom**: Statistiques publiques  
**But**: exposer une version simplifiée des métriques publiques.

**KPI publics possibles**
- nombre total de propositions ;
- nombre total de signalements ;
- nombre de thèmes retenus ;
- nombre de rapports publiés ;
- répartition par catégorie ;
- répartition par wilaya.

---

## 2. Authentification et compte

### 2.1 `/auth/register/participation`
**Nom**: Inscription participation citoyenne  
**Profils**: citoyen, organisation de la société civile

**Champs explicitement requis**
- type : citoyen / organisation ;
- organisation (conditionnel) ;
- nom ;
- prénom ;
- email ;
- pseudonyme ;
- wilaya ;
- statut professionnel ;
- tranche d’âge ;
- sexe ;
- mot de passe ;
- confirmation du mot de passe.

---

### 2.2 `/auth/register/reporting`
**Nom**: Inscription signalement  
**Profils**: citoyen, organisation de la société civile

**Champs explicitement requis**
- type ;
- organisation conditionnelle ;
- nom ;
- prénom ;
- téléphone ;
- email ;
- pseudonyme ;
- **NIN** ;
- wilaya ;
- statut professionnel ;
- tranche d’âge ;
- sexe ;
- mot de passe ;
- confirmation mot de passe.

---

### 2.3 `/auth/login`
**Nom**: Connexion

**Fonctions**
- email + mot de passe ;
- redirection selon rôle ;
- support 2FA.

---

### 2.4 `/auth/verify-email`
**Nom**: Validation email

---

### 2.5 `/auth/2fa`
**Nom**: Vérification 2FA

---

### 2.6 `/auth/forgot-password`
### 2.7 `/auth/reset-password`

---

## 3. Espace citoyen / organisation

### 3.1 `/dashboard`
**Nom**: Tableau de bord citoyen  
**But**: point d’entrée après connexion.

**Widgets**
- état du compte ;
- raccourcis vers “nouvelle proposition” et “nouveau signalement” ;
- dernières notifications ;
- dernières soumissions ;
- compte bloqué / actif / en attente de validation.

---

### 3.2 `/dashboard/profile`
**Nom**: Mon profil  
**Fonctions**
- modifier mot de passe ;
- modifier téléphone ;
- modifier certaines informations autorisées ;
- voir statut de vérification.

---

### 3.3 `/dashboard/proposals`
**Nom**: Mes propositions  
**But**: historique des propositions avec statuts.

**Colonnes**
- titre ;
- catégorie ;
- exercice ;
- date ;
- statut ;
- dernière mise à jour.

---

### 3.4 `/dashboard/proposals/new`
**Nom**: Nouvelle proposition de thème

**Règles**
- disponible uniquement entre le 1er janvier et le 31 mars ;
- exercice auto-rempli en année n+1 et non modifiable.

**Champs**
- titre FR ;
- titre AR ;
- description FR ;
- description AR ;
- catégorie ;
- exercice n+1 ;
- pièces jointes.

---

### 3.5 `/dashboard/proposals/[id]`
**Nom**: Détail de ma proposition  
**Contenu**
- contenu soumis ;
- journal du statut ;
- commentaires éventuels de traitement internes non publics si partagés ;
- notifications reçues.

---

### 3.6 `/dashboard/reports`
**Nom**: Mes signalements  
**But**: historique des dossiers de signalement.

**Statuts**
- non traité ;
- rejeté ;
- converti en thème.

---

### 3.7 `/dashboard/reports/new`
**Nom**: Nouveau signalement

**Préambule obligatoire**
- avertissement juridique ;
- confirmation d’acceptation ;
- lien vers textes de loi ;
- lien vers engagement de confidentialité.

**Champs**
- objet du signalement ;
- entité concernée ;
- nature de l’entité : central / local ;
- administration centrale (conditionnel) ;
- collectivité locale (conditionnel) ;
- adresse ;
- poste / relation avec l’organisme ;
- circonstance ;
- localisation ;
- périodicité ;
- description détaillée de l’irrégularité ;
- catégorie du signalement ;
- date du jour non modifiable ;
- pièces jointes.

---

### 3.8 `/dashboard/reports/[id]`
**Nom**: Détail de mon signalement

**Contenu**
- résumé du dossier ;
- preuve(s) déposée(s) ;
- accusé de réception ;
- statut ;
- historique des notifications.

---

### 3.9 `/dashboard/notifications`
**Nom**: Notifications

---

## 4. Back-office Président de chambre

### 4.1 `/backoffice/president`
**Nom**: Tableau de bord président de chambre

**Widgets**
- propositions à traiter ;
- signalements à traiter ;
- répartition par catégorie/portefeuille ;
- délais moyens de traitement.

---

### 4.2 `/backoffice/president/proposals`
**Nom**: Gestion des propositions

**Fonctions**
- recherche ;
- filtrage ;
- visualisation des propositions de sa compétence ;
- validation avant publication ;
- reformulation ;
- suppression ;
- publication de synthèse de résultats ;
- téléversement rapport final PDF si nécessaire selon workflow institutionnel.

---

### 4.3 `/backoffice/president/proposals/[id]`
**Nom**: Détail proposition — traitement président

**Actions**
- mettre statut “en cours d’analyse” ;
- transférer au rapporteur général ;
- reformuler intitulé ;
- valider/rejeter pour publication interne ;
- publier synthèse ;
- supprimer.

---

### 4.4 `/backoffice/president/reports`
**Nom**: Gestion des signalements

**Actions**
- recherche ;
- lecture du dossier ;
- validation ;
- rejet ;
- conversion en thème ;
- suppression.

---

### 4.5 `/backoffice/president/reports/[id]`
**Nom**: Détail signalement — traitement président

---

## 5. Back-office Rapporteur général

### 5.1 `/backoffice/rapporteur`
**Nom**: Tableau de bord rapporteur général

---

### 5.2 `/backoffice/rapporteur/proposals`
**Nom**: Propositions transmises

**Actions**
- consulter les propositions transmises ;
- décider acceptée / rejetée ;
- reporter non actualisée ;
- ajouter au plan d’action annuel ;
- intégrer au plan d’action final.

---

### 5.3 `/backoffice/rapporteur/action-plan`
**Nom**: Gestion du plan d’action annuel

---

## 6. Back-office Administrateur

### 6.1 `/admin`
**Nom**: Dashboard administrateur

**Widgets**
- volume utilisateurs ;
- validations en attente ;
- comptes bloqués ;
- propositions/signalements ;
- KPI globaux.

---

### 6.2 `/admin/users`
**Nom**: Gestion des comptes citoyens

**Fonctions**
- rechercher ;
- approuver / refuser ;
- activer / désactiver ;
- bloquer / débloquer ;
- voir historique d’actions.

---

### 6.3 `/admin/users/[id]`
**Nom**: Fiche compte citoyen

**Contenu**
- identité réelle ;
- pseudonyme public ;
- statut vérification ;
- historique ;
- raison de blocage ;
- documents éventuels.

---

### 6.4 `/admin/internal-users`
**Nom**: Gestion des profils internes Cour des comptes

**Fonctions**
- créer profils institutionnels ;
- affecter rôle ;
- affecter chambre / portefeuille ;
- mettre à jour responsabilité ;
- suspendre accès.

---

### 6.5 `/admin/settings/wilayas`
### 6.6 `/admin/settings/professional-statuses`
### 6.7 `/admin/settings/theme-categories`
### 6.8 `/admin/settings/report-categories`
### 6.9 `/admin/settings/central-administrations`
### 6.10 `/admin/settings/local-collectivities`

**But**: gérer toutes les listes paramétrables citées dans le CDC.

---

### 6.11 `/admin/mappings`
**Nom**: Matrices d’affectation

**Fonctions**
- associer catégorie de thème → chambre compétente ;
- associer administration centrale → chambre ;
- associer collectivité locale → chambre.

---

### 6.12 `/admin/stats`
**Nom**: Statistiques avancées

**Fonctions**
- dashboards détaillés ;
- filtres temporels ;
- export PDF/Excel ;
- graphiques interactifs.

---

### 6.13 `/admin/moderation`
**Nom**: Modération et sécurité

**Fonctions**
- signalements abusifs ;
- comptes suspects ;
- événements de sécurité ;
- blocages ;
- journaux de modération.

---

### 6.14 `/admin/audit-logs`
**Nom**: Journaux d’audit

**Fonctions**
- logs d’accès ;
- logs de modifications ;
- logs de téléchargements ;
- filtrage par acteur, date, action, ressource.

---

## 7. Pages système nécessaires

### 7.1 `/403`
### 7.2 `/404`
### 7.3 `/500`
### 7.4 `/maintenance`
### 7.5 `/account-blocked`
### 7.6 `/submission-window-closed`

Ces pages ne sont pas nommées explicitement dans le CDC mais sont nécessaires pour une implémentation propre, notamment pour la fermeture saisonnière du module de participation.

---

## 8. Layouts applicatifs à prévoir

- PublicLayout
- AuthLayout
- CitizenDashboardLayout
- PresidentLayout
- RapporteurLayout
- AdminLayout
- Arabic RTL Layout support

---

## 9. Navigation principale recommandée

### Public
- Accueil
- Participation citoyenne
- Signalement
- Thèmes
- Rapports
- Statistiques
- Connexion
- Inscription

### Citoyen connecté
- Tableau de bord
- Mes propositions
- Mes signalements
- Notifications
- Profil

### Interne
- Files de traitement
- Recherche
- Statistiques
- Paramétrage
- Audit

