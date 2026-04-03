# Spécification fonctionnelle consolidée

## 1. Objectif produit
Construire une plateforme web institutionnelle “Espace citoyen” intégrée à l’écosystème de la Cour des comptes, permettant :

- la participation citoyenne via proposition de thèmes de contrôle et d’enquête ;
- le dépôt de signalements documentés ;
- le suivi des dossiers ;
- la gestion interne des traitements par les profils de la Cour ;
- la production de statistiques publiques et administratives.

## 2. Stack cible
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js route handlers ou services dédiés Node.js en TypeScript
- **Base de données**: MySQL
- **ORM conseillé**: Prisma
- **Auth**: session sécurisée + 2FA + RBAC
- **Stockage fichiers**: stockage objet ou disque sécurisé selon infra cible
- **Emails**: notifications et validation de compte
- **I18n**: français + arabe avec support RTL

## 3. Modules

### 3.1 Module participation citoyenne
Fonctions :
- inscription simplifiée ;
- soumission de proposition ;
- recherche de thèmes ;
- likes ;
- commentaires ;
- suivi des statuts ;
- modération et décision ;
- publication synthèses et rapports.

### 3.2 Module signalement
Fonctions :
- inscription complète avec NIN ;
- avertissement juridique ;
- dépôt dossier avec preuves ;
- orientation automatique ;
- suivi sécurisé ;
- traitement par président ;
- éventuelle conversion en thème.

## 4. Exigences fonctionnelles détaillées

### 4.1 Comptes et identité
- un utilisateur externe peut être de type citoyen ou organisation de la société civile ;
- email vérifié obligatoire ;
- mot de passe robuste ;
- 2FA disponible ;
- profil modifiable côté citoyen ;
- profils internes préconfigurés avec permissions spécifiques.

### 4.2 Participation citoyenne
- formulaire de proposition bilingue FR/AR ;
- catégorie obligatoire ;
- exercice n+1 auto-assigné ;
- upload pièces jointes ;
- fermeture automatique hors période ;
- moteur de recherche ;
- likes et commentaires ;
- tableau de bord de suivi ;
- notification sur changement d’état.

### 4.3 Signalement
- formulaire détaillé ;
- pièces probantes obligatoires ;
- choix central/local ;
- listes paramétrables associées à des chambres ;
- accusé de réception ;
- espace de suivi confidentiel ;
- statut et notifications ;
- blocage d’abus côté administration.

### 4.4 Gestion interne
- files de traitement par rôle ;
- transmission au président selon référentiel ;
- transmission au rapporteur pour les propositions ;
- décisions finales ;
- gestion des profils internes ;
- gestion des référentiels ;
- audit logs.

### 4.5 Reporting et statistiques
- tableaux de bord interactifs ;
- exports PDF/Excel ;
- KPI participation ;
- KPI signalement ;
- métriques publiques simplifiées.

## 5. Exigences non fonctionnelles

### 5.1 Sécurité
- protection SQL injection, XSS, CSRF ;
- chiffrement des données sensibles ;
- validation stricte des uploads ;
- journalisation ;
- tests de pénétration avant mise en production.

### 5.2 Performance
- pages principales < 2 secondes dans des conditions normales ;
- lazy loading ;
- caching ;
- pagination sur listes volumineuses.

### 5.3 Accessibilité
- interface intuitive ;
- responsive desktop/tablette/mobile ;
- bon contraste ;
- navigation clavier ;
- support arabe RTL.

### 5.4 Conformité
- respect loi algérienne 18-07 sur les données personnelles ;
- respect exigences institutionnelles de traçabilité ;
- prise en compte des contraintes d’infrastructure locale.

## 6. Fonctionnalités à ne pas oublier
- messages d’état clairs ;
- fermeture saisonnière de la participation ;
- explication des motifs de blocage ;
- historique des statuts ;
- affectation automatique vers chambre ;
- paramétrage administrateur de tous les référentiels métiers ;
- téléchargement du document d’engagement ;
- accès aux textes réglementaires ;
- version publique des statistiques.

## 7. Ce qui est explicite vs ce qui est déduit

### Explicite dans le CDC
- formulaires et champs ;
- rôles ;
- statuts ;
- notifications ;
- statistiques ;
- sécurité ;
- 2FA ;
- audit ;
- support FR/AR ;
- responsive.

### Déduit pour une implémentation propre
- pages 403/404/500 ;
- page fenêtre fermée ;
- pages profil et notifications dédiées ;
- module mapping des catégories vers chambres ;
- centre de logs dédié ;
- séparation des layouts par rôle.

