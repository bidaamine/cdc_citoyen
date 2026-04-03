# Modèle de données logique et RBAC

## 1. Tables principales

### users
- id
- user_type: `CITIZEN` | `CIVIL_SOCIETY_ORG` | `INTERNAL`
- first_name
- last_name
- pseudonym
- email
- phone
- nin_nullable
- password_hash
- sex
- age_range
- professional_status_id
- wilaya_id
- organization_name_nullable
- email_verified_at
- two_factor_enabled
- account_status: `PENDING` | `ACTIVE` | `REFUSED` | `BLOCKED` | `SUSPENDED`
- created_at
- updated_at

### roles
- id
- code: `CITIZEN`, `ORG`, `PRESIDENT`, `RAPPORTEUR_GENERAL`, `ADMIN`
- label

### user_roles
- user_id
- role_id

### chambers
- id
- name_fr
- name_ar
- scope_type

### theme_categories
- id
- name_fr
- name_ar
- chamber_id
- is_active

### report_categories
- id
- name_fr
- name_ar
- is_active

### wilayas
- id
- code
- name_fr
- name_ar
- is_active

### professional_statuses
- id
- name_fr
- name_ar
- is_active

### central_administrations
- id
- name_fr
- name_ar
- chamber_id
- is_active

### local_collectivities
- id
- name_fr
- name_ar
- wilaya_id
- chamber_id
- is_active

---

## 2. Participation citoyenne

### proposals
- id
- submitted_by_user_id
- title_fr
- title_ar
- description_fr
- description_ar
- category_id
- exercise_year
- current_status: `RECU` | `EN_COURS_ANALYSE` | `ACCEPTEE` | `REJETEE` | `NON_ACTUALISEE`
- assigned_chamber_id
- assigned_president_user_id_nullable
- transmitted_to_rapporteur_at_nullable
- final_decided_by_user_id_nullable
- final_decision_at_nullable
- created_at
- updated_at

### proposal_attachments
- id
- proposal_id
- file_name
- mime_type
- file_size
- storage_path
- uploaded_by_user_id
- created_at

### proposal_comments
- id
- proposal_id
- user_id
- body
- is_public
- created_at

### proposal_likes
- id
- proposal_id
- user_id
- created_at

### proposal_status_history
- id
- proposal_id
- from_status_nullable
- to_status
- changed_by_user_id
- note_nullable
- created_at

### proposal_summaries
- id
- proposal_id
- summary_text
- published_by_user_id
- published_at

### proposal_final_reports
- id
- proposal_id
- file_name
- storage_path
- uploaded_by_user_id
- published_at

---

## 3. Signalements

### reports
- id
- submitted_by_user_id
- subject
- target_entity_name
- target_entity_type: `CENTRAL` | `LOCAL`
- central_administration_id_nullable
- local_collectivity_id_nullable
- address
- relation_to_entity
- circumstance
- facts_location
- facts_periodicity
- irregularity_description
- report_category_id
- report_date
- current_status: `NON_TRAITE` | `REJETE` | `CONVERTI_EN_THEME`
- assigned_chamber_id
- assigned_president_user_id_nullable
- acknowledgement_number
- created_at
- updated_at

### report_attachments
- id
- report_id
- file_name
- mime_type
- file_size
- storage_path
- uploaded_by_user_id
- created_at

### report_status_history
- id
- report_id
- from_status_nullable
- to_status
- changed_by_user_id
- note_nullable
- created_at

---

## 4. Notifications et audit

### notifications
- id
- user_id
- type
- title
- body
- channel: `IN_APP` | `EMAIL`
- is_read
- created_at

### audit_logs
- id
- actor_user_id_nullable
- action
- resource_type
- resource_id
- metadata_json
- ip_address_nullable
- user_agent_nullable
- created_at

### account_blocks
- id
- user_id
- blocked_by_user_id
- reason
- starts_at
- ends_at_nullable
- is_permanent
- created_at

---

## 5. Permissions recommandées

### Citizen / Org
- create own proposal
- read own proposals
- create own report
- read own reports
- update own profile
- comment public themes
- like public themes

### President
- read proposals in scope
- update proposal status in scope
- reformulate proposal title
- delete proposal in scope
- publish summary
- upload final report
- read reports in scope
- validate/reject/convert report
- delete report in scope

### Rapporteur général
- read transmitted proposals
- set final proposal decision
- mark proposal non actualisée
- add to annual action plan
- publish final action plan entries

### Admin
- manage citizen accounts
- block/unblock accounts
- manage internal users
- manage settings lists
- manage mappings
- read all statistics
- export reports
- read audit logs

