# Besoins utilisateurs et workflows détaillés

---

## 1. Rôles

### 1.1 Citoyen
**Ce qu’il veut**
- créer un compte simplement ;
- proposer un thème de contrôle ;
- signaler une irrégularité avec preuves ;
- suivre l’évolution de ses soumissions ;
- recevoir des notifications ;
- préserver la confidentialité de ses données ;
- interagir avec des thèmes via likes et commentaires.

### 1.2 Organisation de la société civile
**Ce qu’elle veut**
- faire les mêmes actions qu’un citoyen ;
- être identifiée comme organisation ;
- afficher le nom de son organisation lors de l’inscription.

### 1.3 Président de chambre
**Ce qu’il veut**
- recevoir automatiquement les propositions et signalements relevant de son portefeuille ;
- filtrer les soumissions non pertinentes ;
- mettre à jour les statuts ;
- reformuler les thèmes ;
- supprimer des soumissions ;
- publier des synthèses et éventuellement les rapports finaux ;
- disposer de statistiques sur son périmètre.

### 1.4 Rapporteur général
**Ce qu’il veut**
- consulter les propositions transmises ;
- prendre la décision finale acceptée/rejetée ;
- reporter une proposition non actualisée ;
- intégrer les propositions validées au plan d’action annuel/final.

### 1.5 Administrateur
**Ce qu’il veut**
- valider les comptes ;
- gérer les profils internes ;
- paramétrer les référentiels ;
- bloquer les comptes abusifs ;
- surveiller les usages ;
- consulter les logs ;
- produire des statistiques ;
- garantir sécurité, conformité et traçabilité.

---

## 2. Workflow — Participation citoyenne

### 2.1 Préconditions
- l’utilisateur a un compte ;
- l’utilisateur est connecté ;
- le compte est actif ;
- la fenêtre annuelle de soumission est ouverte ;
- les référentiels (catégories, wilayas) sont configurés.

### 2.2 Étapes métier
1. Le citoyen accède à son tableau de bord.
2. Il ouvre le formulaire de proposition.
3. Il saisit titre FR/AR, description FR/AR, catégorie, pièces jointes.
4. Le système affecte automatiquement l’exercice à **n+1**.
5. Le système enregistre et confirme la réception.
6. Le système oriente la proposition vers le président de chambre compétent selon la catégorie.
7. Le président examine et met le statut à **en cours d’analyse**.
8. Le président transmet au rapporteur général.
9. Le rapporteur général décide : **acceptée**, **rejetée** ou **non actualisée**.
10. Le citoyen reçoit des notifications à chaque étape.

### 2.3 Statuts métier
- `RECU`
- `EN_COURS_ANALYSE`
- `ACCEPTEE`
- `REJETEE`
- `NON_ACTUALISEE`

### 2.4 Règles métier critiques
- soumission fermée hors période annuelle ;
- exercice forcé à l’année suivante ;
- catégories reliées à des chambres ;
- proposition consultable dans l’historique citoyen ;
- transmission et décision doivent être tracées.

---

## 3. Workflow — Signalement

### 3.1 Préconditions
- l’utilisateur possède un compte vérifié ;
- l’identité réelle est connue de l’administration ;
- le citoyen a pris connaissance de l’avertissement juridique.

### 3.2 Étapes métier
1. Le citoyen se connecte.
2. Il ouvre le module de signalement.
3. Il lit l’avertissement et accepte la poursuite.
4. Il remplit le formulaire détaillé.
5. Il dépose ses preuves.
6. Le système enregistre le dossier.
7. Le système génère un accusé de réception.
8. Le système oriente le dossier vers le président de chambre compétent selon l’administration centrale ou la collectivité locale.
9. Le président examine le signalement.
10. Le président met le statut : **non traité**, **rejeté** ou **converti en thème**.
11. Le citoyen reçoit des mises à jour.

### 3.3 Statuts métier
- `NON_TRAITE`
- `REJETE`
- `CONVERTI_EN_THEME`

### 3.4 Règles métier critiques
- anonymat public autorisé, mais pas anonymat vis-à-vis de l’administration ;
- pièces jointes obligatoires ;
- nature de l’entité pilote le champ conditionnel central/local ;
- administration centrale et collectivité locale doivent être paramétrables ;
- toutes les consultations/téléchargements doivent être journalisés.

---

## 4. Workflow — Validation de compte

1. L’utilisateur remplit son formulaire d’inscription.
2. Il reçoit un e-mail de confirmation.
3. Il valide son adresse e-mail.
4. L’administrateur vérifie le compte selon les règles internes.
5. Le compte passe à `EN_ATTENTE`, `ACTIF`, `REFUSE` ou `BLOQUE`.

---

## 5. Workflow — Blocage de compte citoyen

1. Un comportement abusif est détecté.
2. L’administrateur ouvre le dossier du compte.
3. Il consigne motif, date, opérateur et durée du blocage.
4. Le système suspend ou bloque le compte.
5. Le citoyen reçoit une notification expliquant la raison du blocage.
6. L’action est tracée dans les logs d’audit.

---

## 6. Workflow — Publication d’un rapport final

1. Un thème est retenu et traité.
2. Le président de chambre ou le profil interne habilité ouvre le dossier du thème.
3. Il téléverse le rapport final PDF.
4. Il publie éventuellement une synthèse.
5. Le thème apparaît dans la liste publique des rapports.

---

## 7. Workflow — Statistiques

### 7.1 Administrateur
- visualise des tableaux de bord complets ;
- exporte en PDF et Excel ;
- filtre par période, wilaya, catégorie, statut.

### 7.2 Public
- voit une version simplifiée ;
- consulte les indicateurs clés sans accéder aux données sensibles.

