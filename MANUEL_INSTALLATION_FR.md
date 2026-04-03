# Manuel d'installation

Ce guide explique comment installer et lancer la plateforme `cdc_citoyen` en local avec MySQL, Prisma et Next.js.

## 1. Prerequis

Installez les outils suivants:

- Node.js 20 ou plus recent
- npm
- MySQL 8 ou equivalent compatible
- Git

Sous Windows, verifiez rapidement:

```powershell
node -v
& "C:\Program Files\nodejs\npm.cmd" -v
mysql --version
```

## 2. Recuperer le projet

```powershell
git clone <url-du-repo>
cd cdc_citoyen
& "C:\Program Files\nodejs\npm.cmd" install
```

## 3. Configurer l'environnement

Copiez le fichier d'exemple:

```powershell
Copy-Item .env.example .env
```

Exemple minimal de `.env`:

```env
DATABASE_URL="mysql://cdc_user:cdc_pass_123@127.0.0.1:3306/cdc_citoyen"
NEXTAUTH_SECRET="remplacer-par-une-cle-longue-et-secrete"
NEXTAUTH_URL="http://localhost:3000"
```

Si votre MySQL local autorise un compte sans mot de passe, un format possible est:

```env
DATABASE_URL="mysql://root@127.0.0.1:3306/cdc_citoyen"
```

## 4. Creer la base MySQL

Si vous avez un utilisateur administrateur MySQL, vous pouvez creer la base et un utilisateur dedie:

```sql
CREATE DATABASE cdc_citoyen;
CREATE USER 'cdc_user'@'localhost' IDENTIFIED BY 'cdc_pass_123';
GRANT ALL PRIVILEGES ON cdc_citoyen.* TO 'cdc_user'@'localhost';
FLUSH PRIVILEGES;
```

Ensuite, placez ces identifiants dans `DATABASE_URL`.

## 5. Generer Prisma

```powershell
& "C:\Program Files\nodejs\npm.cmd" run prisma:generate
```

## 6. Creer les tables

### Cas A: votre utilisateur MySQL peut creer une shadow database

Utilisez la migration Prisma classique:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run prisma:migrate -- --name init
```

### Cas B: votre utilisateur MySQL n'a pas ce droit

Si vous obtenez une erreur `P3014` ou `P1010`, utilisez `db push` a la place:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run prisma:db-push
```

Ce mode est parfaitement adapte a un environnement local avec droits limites.

## 7. Charger les donnees initiales

Le projet contient un seed riche avec:

- referentiels
- comptes de demonstration
- propositions et signalements
- notifications
- rapports publics
- historiques et logs d'audit

Commande:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run prisma:seed
```

## 8. Backfill technique optionnel

Une commande existe pour rattacher les anciens signalements convertis a leur proposition generee:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run prisma:backfill-report-links
```

## 9. Lancer l'application

```powershell
& "C:\Program Files\nodejs\npm.cmd" run dev
```

Application disponible sur:

- [http://localhost:3000](http://localhost:3000)

## 10. Verifier la connexion base de donnees

Une fois l'application demarree, verifiez:

- [http://localhost:3000/api/health/db](http://localhost:3000/api/health/db)

Vous pouvez aussi inspecter les tables avec Prisma Studio:

```powershell
npx prisma studio
```

## 11. Comptes de demonstration

Apres le seed, vous pouvez vous connecter avec:

- `citizen@cdc.dz` / `demo12345`
- `org@cdc.dz` / `demo12345`
- `president@cdc.dz` / `demo12345`
- `president-local@cdc.dz` / `demo12345`
- `rapporteur@cdc.dz` / `demo12345`
- `admin@cdc.dz` / `demo12345`

## 12. Commandes utiles

```powershell
& "C:\Program Files\nodejs\npm.cmd" run prisma:generate
& "C:\Program Files\nodejs\npm.cmd" run prisma:db-push
& "C:\Program Files\nodejs\npm.cmd" run prisma:seed
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run test
& "C:\Program Files\nodejs\npm.cmd" run build
```

## 13. Depannage

### Erreur `P3014` pendant `prisma migrate`

Cause probable:

- l'utilisateur MySQL ne peut pas creer la base temporaire de migration

Solution:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run prisma:db-push
```

### Erreur `P2021` pendant le seed

Cause probable:

- les tables n'ont pas encore ete creees

Solution:

1. Executer `prisma:db-push` ou `prisma:migrate`
2. Relancer `prisma:seed`

### L'application reste en mode fallback

Verifiez:

- la valeur de `DATABASE_URL`
- que MySQL est demarre
- que `http://localhost:3000/api/health/db` repond correctement

## 14. Sequence recommandee sur Windows

Si vous voulez la sequence la plus simple, utilisez celle-ci:

```powershell
Copy-Item .env.example .env
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" run prisma:generate
& "C:\Program Files\nodejs\npm.cmd" run prisma:db-push
& "C:\Program Files\nodejs\npm.cmd" run prisma:seed
& "C:\Program Files\nodejs\npm.cmd" run dev
```

## 15. Etat attendu apres installation

Si tout est correct:

- la page d'accueil charge
- les pages publiques affichent des donnees venant de la base
- les inscriptions utilisent les referentiels MySQL
- les espaces citoyen, president, rapporteur et admin sont accessibles avec les comptes seedes
