# Espace citoyen — Pack de spécifications Markdown

Ce dossier contient une traduction opérationnelle du cahier des charges de la Cour des comptes en fichiers Markdown prêts à être utilisés avec Codex pour construire le projet avec **Next.js + shadcn/ui + Tailwind CSS + MySQL**.

## Fichiers inclus

- `01-pages-and-routes.md` — inventaire complet des pages, routes, états d’écran et composants majeurs.
- `02-user-needs-and-workflows.md` — besoins détaillés par rôle, parcours utilisateurs et règles métier.
- `03-functional-spec.md` — spécification fonctionnelle consolidée.
- `04-data-model-and-rbac.md` — schéma logique des données, rôles, permissions, statuts, entités paramétrables.
- `05-codex-master-prompt.md` — prompt maître à donner à Codex pour générer le projet.
- `06-build-phases-and-deliverables.md` — plan d’exécution, livrables, tests, sécurité et déploiement.

## Hypothèses de traduction du CDC en produit

Le cahier des charges décrit explicitement :

- deux modules métier : **participation citoyenne** et **signalement** ;
- cinq profils principaux : **citoyen**, **organisation de la société civile**, **président de chambre**, **rapporteur général**, **administrateur** ;
- un support **français + arabe** ;
- un système de **rôles et permissions** ;
- des **tableaux de bord**, de la **modération**, des **notifications**, des **statistiques**, de la **traçabilité**, de la **gestion documentaire**, un **2FA**, un **contrôle d’accès** et de fortes contraintes de **confidentialité**.

Les fichiers de ce dossier convertissent ces exigences en:

1. pages concrètes à développer ;
2. entités de base de données ;
3. workflows métier ;
4. priorités de build ;
5. prompt d’industrialisation pour Codex.

## Points explicitement imposés par le CDC

- La **soumission de thèmes** n’est ouverte que du **1er janvier au 31 mars** de chaque année.
- Les propositions de thèmes sont affectées à l’**exercice n+1**.
- Le module de signalement permet un **anonymat public**, mais l’**identité réelle doit être connue et vérifiée par l’administration**.
- Les **wilayas**, **statuts professionnels**, **catégories**, **administrations centrales** et **collectivités locales** doivent être **paramétrables par l’administrateur**.
- Les pièces jointes sont requises dans plusieurs cas, avec contraintes de taille explicites dans le CDC.
- Les administrateurs doivent pouvoir **bloquer** les comptes citoyens et **documenter** les motifs.
- Les actions des utilisateurs doivent être **journalisées** pour assurer la traçabilité.

## Recommandation d’usage

Commencer par donner à Codex ce fichier dans l’ordre suivant :

1. `03-functional-spec.md`
2. `04-data-model-and-rbac.md`
3. `01-pages-and-routes.md`
4. `05-codex-master-prompt.md`

