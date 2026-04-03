# Espace citoyen

Plateforme institutionnelle Next.js pour la Cour des comptes, construite avec App Router, Tailwind CSS, composants style shadcn/ui, Prisma, MySQL et NextAuth.

## Documentation

- Guide d'installation en francais: [MANUEL_INSTALLATION_FR.md](./MANUEL_INSTALLATION_FR.md)

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Prisma + MySQL
- NextAuth Credentials
- Recharts
- Zod

## Modules couverts

- Pages publiques: accueil, participation, signalement, themes, rapports, cadre legal, engagement de confidentialite, statistiques
- Auth: inscription participation, inscription signalement, login, verification e-mail, 2FA, reset password
- Espace citoyen: dashboard, profil, propositions, signalements, notifications
- Back office president: propositions, signalements, detail de traitement
- Back office rapporteur: decisions finales et plan d'action
- Administration: comptes citoyens, profils internes, referentiels, mappings, moderation, audit, statistiques

## Demarrage rapide

1. Installer les dependances

```bash
npm install
```

2. Copier l'environnement

```bash
copy .env.example .env
```

3. Renseigner `DATABASE_URL`, `NEXTAUTH_SECRET` et `NEXTAUTH_URL`

4. Generer Prisma

```bash
npm run prisma:generate
```

5. Appliquer le schema

Si votre utilisateur MySQL peut creer une shadow database:

```bash
npm run prisma:migrate
```

Sinon, utilisez:

```bash
npm run prisma:db-push
```

6. Charger les donnees initiales

```bash
npm run prisma:seed
```

7. Backfill des liens signalement -> proposition generee

```bash
npm run prisma:backfill-report-links
```

8. Demarrer le projet

```bash
npm run dev
```

## Comptes de demonstration

- `citizen@cdc.dz` / `demo12345`
- `org@cdc.dz` / `demo12345`
- `president@cdc.dz` / `demo12345`
- `rapporteur@cdc.dz` / `demo12345`
- `admin@cdc.dz` / `demo12345`

## Verification

```bash
npm run lint
npm run test
npm run build
```
