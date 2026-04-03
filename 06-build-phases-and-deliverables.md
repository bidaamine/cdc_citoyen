# Phasage, qualité, sécurité et livrables

## Phase 1 — Fondations
- initialisation Next.js + TypeScript + Tailwind + shadcn
- i18n FR/AR + RTL
- Prisma + MySQL
- authentification de base
- RBAC
- design system

## Phase 2 — Référentiels et administration minimale
- wilayas
- statuts professionnels
- catégories
- administrations centrales
- collectivités locales
- chambres
- mappings

## Phase 3 — Module participation citoyenne
- inscription simplifiée
- tableau de bord citoyen
- soumission proposition
- recherche thèmes
- likes/commentaires
- back-office président
- back-office rapporteur

## Phase 4 — Module signalement
- inscription complète
- avertissements juridiques
- soumission dossier avec preuves
- accusé de réception
- traitement président
- suivi sécurisé citoyen

## Phase 5 — Statistiques, exports et audit
- dashboard admin
- dashboard public
- export PDF/Excel
- audit logs
- modération et blocage comptes

## Phase 6 — Hardening
- tests de charge
- tests de sécurité
- validation UX mobile
- optimisation perf
- préparation déploiement

## Exigences de test
- tests unitaires frontend/backend
- tests d’intégration auth, proposition, signalement, blocage compte
- tests de permissions par rôle
- tests sur fenêtre annuelle de participation
- tests upload et validation de format
- tests 2FA

## Exigences sécurité
- hash mot de passe fort
- validation serveur de tous les inputs
- nettoyage des noms de fichiers
- anti malware/validation mimetype
- rate limiting
- cookies/session sécurisés
- logs d’accès et opérations sensibles
- politique de rétention des pièces jointes

## Livrables à fournir
- code source complet
- documentation technique
- manuel utilisateur
- guide d’exploitation/maintenance
- tutoriels vidéo citoyens
- formation administrateurs
- plan de maintenance évolutive
- support technique post-déploiement

