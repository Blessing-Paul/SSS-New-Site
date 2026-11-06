# Stable Shield: Backend API Specification (Laravel)

**For:** the backend developer(s) building the Laravel API behind stableshield.com and the staff portal.
**Frontend:** Angular app in `angular-app/`. It already sends the requests and renders the responses described here, using sample data until the API exists.

Contents
1. Conventions
2. Authentication & roles
3. Database schema
4. Public form endpoints (website)
5. Portal endpoints (staff only)
6. Workflows
7. Email notifications
8. Files
9. Security checklist
10. Wiring the frontend

---

## 1. Conventions

| Topic | Rule |
|---|---|
| Base URL | `https://api.stableshield.com` (or same domain under `/api`). Set in `angular-app/src/app/core/form-api.config.ts` → `apiBaseUrl`. |
| Format | JSON responses. Request and response keys are **snake_case**. |
| Public forms | Sent as `multipart/form-data` (some include files). Array fields are named `field[]`. |
| Success | `201 Created` for creates, `200 OK` for reads and updates, `204 No Content` for deletes and logout. |
| Validation | Laravel's default `422` shape: `{ "message": "...", "errors": { "field": ["msg"] } }`. The frontend shows `errors[field][0]` under the matching input, so use the same field names as the request. |
| Lists | Laravel paginator shape (`data`, `meta.current_page`, `meta.last_page`, `meta.total`). Query params: `page`, `per_page` (max 100), `search`, plus the filters listed per endpoint. |
| Dates | ISO 8601 in UTC (`2026-11-05T09:15:00Z`). Pure dates are `YYYY-MM-DD`. |
| IDs | Use ULIDs or UUIDs in URLs. Don't expose auto-increment IDs. |
| References | Human-readable codes shown to staff and customers: `ENQ-1042`, `MTG-311`, `DEM-208`, `SUP-2201`, `PTR-057`, `APP-0315`. Generate them sequentially per type. |

---

## 2. Authentication & roles

Use **Laravel Sanctum, SPA (cookie) authentication**.

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/sanctum/csrf-cookie` | Call before logging in. |
| POST | `/api/auth/login` | `{ email, password, remember }` → `200` with the user resource (§3.1). On failure, `422` with `errors.email`. A deactivated account also gets `422`, with the message "This account has been deactivated." |
| POST | `/api/auth/logout` | `204` |
| GET | `/api/auth/me` | The current user resource, or `401` |
| POST | `/api/auth/forgot-password` | `{ email }` → always `200` (don't reveal whether the account exists) |
| POST | `/api/auth/reset-password` | `{ token, email, password, password_confirmation }` |

Rate-limit login to 5 attempts per minute per email+IP.

### Roles (what someone can access)

A user can have **several** roles. `admin` passes every check.

| Role | Can access |
|---|---|
| `admin` | Everything, including managing staff and roles |
| `hr` | Staff applications (hiring), staff directory management (create, edit, deactivate) |
| `sales` | Project enquiries, meeting requests, demo requests, partner applications |
| `support` | Support tickets |
| `staff` | Dashboard, staff directory (read-only), own profile (phone and location only) |

### Disciplines (what someone does)

A discipline is a job attribute, **not** a permission. One per staff member.

| Value | Label |
|---|---|
| `frontend` | Frontend developer |
| `backend` | Backend developer |
| `fullstack` | Full-stack developer |
| `mobile` | Mobile developer |
| `devops` | DevOps engineer |
| `infrastructure` | Systems & infrastructure engineer *(servers, data centre, hosting)* |
| `network` | Network engineer |
| `security` | Cybersecurity analyst |
| `qa` | QA / test engineer |
| `uiux` | UI/UX designer |
| `project` | Project manager |
| `support` | IT support specialist |
| `sales` | Sales & account manager |
| `hr` | HR & people officer |
| `admin` | Operations & administration |
| `other` | Other |

**Departments:** Engineering, Infrastructure, Design, Support, Sales, People, Operations. Store these in a `departments` table so they can be edited later.

---

## 3. Database schema

### 3.1 `users` (staff accounts)

| Column | Type | Notes |
|---|---|---|
| id | ulid PK | |
| name | string(120) | |
| email | string unique | Company email, used to sign in |
| password | string | Hashed. Null until the user sets it from the welcome email. |
| phone | string(30) nullable | |
| location | string(120) nullable | |
| job_title | string(120) | |
| discipline | enum (§2) | |
| department_id | FK departments | |
| started_at | date | |
| is_active | boolean, default true | Deactivated users can't sign in. Never hard-delete a user. |
| staff_application_id | FK nullable | Set when the user was hired through the pipeline |
| email_verified_at, remember_token, timestamps | | |

`role_user` pivot (`user_id`, `role` enum), or `spatie/laravel-permission`.

**User resource:**

```json
{ "id": "...", "name": "...", "email": "...", "phone": "...", "location": "...",
  "job_title": "...", "discipline": "fullstack", "department": "Engineering",
  "roles": ["staff", "support"], "is_active": true, "started_at": "2024-03-07",
  "staff_application_id": null }
```

### 3.2 `inbox_items` (one table for all five public request types)

| Column | Type | Notes |
|---|---|---|
| id | ulid PK | |
| kind | enum: `enquiries`, `meetings`, `demos`, `support`, `partners` | |
| reference | string unique | `ENQ-…`, `MTG-…`, `DEM-…`, `SUP-…`, `PTR-…` |
| subject | string | Generated on create. Examples: "Project enquiry: Networking & connectivity", "Support: School Silo, Error or bug". |
| contact_name, contact_email, contact_phone, contact_organization, contact_job_title | strings | Taken from the form |
| status | enum: `new`, `open`, `awaiting_customer`, `scheduled`, `resolved`, `closed` | Default `new` |
| priority | enum: `normal`, `high`, `critical` | Default `normal`. Support tickets use the submitted priority. |
| assignee_id | FK users nullable | |
| payload | json | **All** submitted form fields, stored exactly as received |
| source_ip, user_agent | strings | For abuse handling |
| timestamps, `last_activity_at` | | |

Indexes: `(kind, status)`, `assignee_id`, `last_activity_at`.

**Statuses allowed per kind:**

| Kind | Statuses |
|---|---|
| enquiries | new, open, awaiting_customer, resolved, closed |
| meetings | new, open, scheduled, closed |
| demos | new, open, scheduled, resolved, closed |
| support | new, open, awaiting_customer, resolved, closed |
| partners | new, open, awaiting_customer, resolved, closed |

### 3.3 `messages` (conversation and activity on inbox items and applications)

| Column | Type | Notes |
|---|---|---|
| id | ulid PK | |
| messageable_type, messageable_id | morph | `InboxItem` or `StaffApplication` |
| type | enum: `inbound`, `outbound`, `note`, `event` | `inbound` = from the customer or candidate. `outbound` = emailed to them. `note` = internal only. `event` = system log (status change, assignment). |
| author_id | FK users nullable | Null for inbound messages and system events |
| author_name | string | Kept so the history still reads correctly if the user is renamed |
| body | text | |
| email_message_id | string nullable | The `Message-ID` of the sent email, used for reply threading (§7) |
| created_at | | |

The first `inbound` message on an inbox item is the "message" or "project details" field from the form.

### 3.4 `staff_applications`

| Column | Type | Notes |
|---|---|---|
| id | ulid PK | |
| reference | string unique | `APP-0001` |
| name, email, phone, location | strings | |
| portfolio | url nullable | |
| role | string | Job title, or "General application" |
| job_id | string nullable | ID of the job posting (from `/data/jobs.json` today) |
| experience | string | One of the form options |
| availability | string | |
| work_eligibility | string | |
| work_arrangement | string | |
| message | text nullable | |
| cv_path | string | Private storage path (§8) |
| cv_original_name | string | |
| stage | enum: `applied`, `screening`, `interview`, `offer`, `accepted`, `rejected`, `withdrawn` | Default `applied` |
| rating | tinyint nullable | 1–5 |
| interview_at | datetime nullable | |
| user_id | FK users nullable | The staff account created when hired |
| timestamps | | |

### 3.5 `job_postings` (optional, recommended)

The site currently reads open roles from the static file `angular-app/public/data/jobs.json` (fields: `id, title, department, location, type, summary, responsibilities[], requirements[]`). Expose the same shape at `GET /api/jobs` and point `JobsService` at it when HR needs to manage postings themselves.

---

## 4. Public form endpoints (website)

No authentication. Every endpoint:
- Accepts `multipart/form-data`.
- Includes a honeypot field `website_hp`. If it has any value, return `201` and **discard** the submission.
- Is rate-limited to 5 requests per minute per IP.
- Returns `201 { "reference": "ENQ-1043" }` on success.
- Requires `consent` (`accepted`) where noted.
- Creates an `inbox_items` row (or a `staff_applications` row), adds the first `inbound` message, and sends the notifications in §7.

Field names below are exactly what the frontend sends.

### 4.1 `POST /api/enquiries`: project enquiry (Home page, Contact page) → kind `enquiries`

| Field | Rule |
|---|---|
| name | required, string, max 120 |
| email | required, email |
| phone | nullable, string, max 30 |
| job_title | nullable, string, max 120 |
| organization | nullable, string, max 160 |
| organization_type | nullable, in: Business / enterprise, Government institution, University / tertiary, School, NGO / non-profit, Faith-based organization, Healthcare, Agriculture, Other |
| service | required, in: `software`, `web`, `portals`, `infrastructure`, `cloud`, `security`, `networking`, `transformation`, `payments`, `data`, `consulting`, `support`, `training`, `silo-products`, `co-development`, `other` *(source of truth: `angular-app/src/app/core/services.data.ts`)* |
| timeline | nullable, in: As soon as possible, Within 1–3 months, Within 3–6 months, Later than 6 months |
| message | required, string, max 5000 |
| consent | required, accepted |

### 4.2 `POST /api/meeting-requests` (Contact page) → kind `meetings`

| Field | Rule |
|---|---|
| name | required, max 120 |
| email | required, email |
| phone | nullable, max 30. Required if `type` = Phone call. |
| timezone | nullable, in: West Africa Time (WAT, UTC+1), GMT / UTC, Other (tell us in the topic) |
| date | required, date, today or later |
| time | nullable, in: Morning (9am–12pm), Midday (12pm–2pm), Afternoon (2pm–5pm), Any time |
| type | nullable, in: Video call, Phone call, In person |
| topic | nullable, max 255 |

### 4.3 `POST /api/demo-requests` (Products page) → kind `demos`

| Field | Rule |
|---|---|
| name | required, max 120 |
| organization | required, max 160 |
| email | required, email |
| phone | nullable, max 30 |
| product | required. A Silo product name (see `angular-app/src/app/core/products.data.ts`) or "Several products / not sure yet". |
| users | nullable, in: Under 50, 50–250, 250–1,000, 1,000+ |
| message | nullable, max 5000 |
| consent | required, accepted |

### 4.4 `POST /api/support-tickets` (Support page) → kind `support`

| Field | Rule |
|---|---|
| name | required, max 120 |
| organization | required, max 160 |
| email | required, email |
| phone | nullable, max 30 |
| account_ref | nullable, max 60 |
| category | required, in: Can't sign in / access, Error or bug, Performance or outage, Data or report problem, Feature or change request, Training or how-to question, Other |
| system | required. A Silo product name, Custom application, Website, or one of the remaining options in the form. |
| system_version | nullable, max 120 |
| priority | nullable, in: Normal, High, Critical. Store lowercase in `inbox_items.priority`. |
| users_affected | nullable, in: Just me, A few users (2–10), A team or department, Everyone |
| impact | nullable, max 500 |
| message | required, max 5000 |
| steps | nullable, max 5000 |
| screenshot | nullable, file, mimes: jpg, jpeg, png, webp, gif, pdf, max 5 MB |

### 4.5 `POST /api/staff-applications` (Careers page, `/apply`) → `staff_applications`

| Field | Rule |
|---|---|
| job_id | nullable, string (hidden field, empty for general applications) |
| name | required, max 120 |
| email | required, email |
| phone | required, max 30 |
| location | required, max 120 |
| portfolio | nullable, url |
| role | required, max 160 |
| experience | required, in: Student / graduate, Less than 1 year, 1–3 years, 3–5 years, 5–10 years, 10+ years |
| availability | required, in: Immediately, 2 weeks, 1 month, 2–3 months, More than 3 months |
| work_eligibility | required, in: Yes, "No, I would need sponsorship" |
| work_arrangement | nullable, in: Any, On-site, Hybrid, Remote |
| cv | **required**, file, mimes: pdf, doc, docx, **max 8 MB** (the form tells applicants 8 MB) |
| message | nullable, max 5000 |
| consent | required, accepted |

The server sets `stage = applied`. Never accept `stage` from the request.

### 4.6 `POST /api/partner-applications` (Partners page, 5-step form) → kind `partners`

| Field | Rule |
|---|---|
| partnership_type | required, in: Reseller / referral, Implementation, Technology, Co-development (in-house project) |
| products[] | required, array, min 1. Silo product names, plus "Build services", "Infrastructure services", "Transform services", "Advise & support services", "My in-house project". |
| organization | required, max 160 |
| registration_number | nullable, max 60 |
| organization_type | required |
| team_size | required, in: 1–10, 11–50, 51–200, 201–1,000, 1,000+ |
| website | nullable, url |
| years_operating | nullable, integer, 0 or more |
| country | required |
| city | required |
| address | nullable |
| contact_name | required. Use as `contact_name` on the inbox item. |
| contact_title | required |
| contact_email | required, email |
| contact_phone | required |
| contact_method | nullable, in: Email, Phone call, WhatsApp, Video meeting |
| capabilities | required **unless** co-development |
| regions, sectors | nullable |
| customer_base | required if reseller. In: Under 20 organizations, 20–100 organizations, 100–500 organizations, 500+ organizations. |
| sales_team, current_portfolio | nullable (reseller) |
| technical_staff | required if implementation. In: 1–5, 6–20, 21–50, 50+. |
| delivery_capacity, certifications | nullable (implementation) |
| tech_product | required if technology |
| tech_url | nullable, url (technology) |
| integration_type | required if technology |
| api_available | nullable (technology) |
| project_description | required if co-development |
| project_stage, project_stack, project_support | nullable (co-development) |
| timeline | nullable |
| opportunity_value | nullable (non-co-development): "Expected annual business you could bring" |
| project_budget | nullable (co-development): "Budget for this project" |
| goals | required |
| source | nullable |
| consent | required, accepted |

---

## 5. Portal endpoints (staff only)

All require `auth:sanctum` and an active user. A role failure returns `403`.

### 5.1 Dashboard

`GET /api/portal/summary` → counts for the tiles, filtered to inboxes the user can access:

```json
{ "enquiries": { "open": 3, "new": 1 }, "meetings": {...}, "demos": {...}, "support": {...},
  "partners": {...}, "applications": { "open": 4, "new": 1 }, "staff": { "active": 7 } }
```

The other dashboard lists reuse the endpoints below:
- `GET /api/inbox?assignee=me&status=active`
- `GET /api/inbox?assignee=none&per_page=6`
- `GET /api/staff-applications?stage=active&per_page=5`

### 5.2 Inbox

The roles required depend on `kind`: enquiries, meetings, demos and partners need `sales`; support needs `support`.

| Method | Endpoint | Body / query | Effect |
|---|---|---|---|
| GET | `/api/inbox` | `kind`, `status` (`active` = not resolved or closed), `assignee` (`me` \| `none` \| user id), `search` (matches reference, subject, contact name, email, organization), `sort=-last_activity_at` | Paginated list (no thread) |
| GET | `/api/inbox/{id}` | | Item with `contact`, `payload` (as `fields`), `assignee`, `thread` (messages ordered oldest first) |
| PATCH | `/api/inbox/{id}` | any of `status`, `priority`, `assignee_id` | Updates the item and writes an `event` message for each change ("Status changed to Resolved", "Assigned to Grace Okafor"). Assigning a `new` item moves it to `open`. |
| POST | `/api/inbox/{id}/replies` | `{ body, status_after }` | **Emails `body` to the contact** (§7), stores an `outbound` message, then sets `status_after` (default `awaiting_customer`) |
| POST | `/api/inbox/{id}/notes` | `{ body }` | Stores a `note`. Never emailed. |

The assignee dropdown only lists active users who hold the inbox's role or `admin`. Provide it as `GET /api/staff?role=sales&active=1`.

**Inbox item resource:**

```json
{ "id": "...", "reference": "SUP-2201", "kind": "support", "subject": "...",
  "contact": { "name": "...", "email": "...", "phone": "...", "organization": "...", "job_title": "..." },
  "status": "new", "priority": "critical", "assignee": { "id": "...", "name": "..." },
  "fields": { "Issue category": "Error or bug", "System": "School Silo" },
  "thread": [ { "id": "...", "type": "inbound", "author_name": "...", "body": "...", "created_at": "..." } ],
  "created_at": "...", "updated_at": "..." }
```

`fields` uses the **human labels** as keys, in the same order as the form, because the portal shows them as-is. Build it from `payload` with a label map per kind.

### 5.3 Staff applications (`hr`)

| Method | Endpoint | Body / query | Effect |
|---|---|---|---|
| GET | `/api/staff-applications` | `stage` (`active` = not accepted, rejected or withdrawn), `search` | Paginated list, plus `meta.stage_counts` (`{ "applied": 2, ... }`) |
| GET | `/api/staff-applications/{id}` | | Full record, `cv_url` (signed link, §8), thread, linked `user` if hired |
| PATCH | `/api/staff-applications/{id}` | `stage` \| `rating` \| `interview_at` | Writes an `event` message. Setting `interview_at` while in applied or screening moves the stage to `interview`. You cannot set `stage` to `accepted` here; use `/accept`. |
| POST | `/api/staff-applications/{id}/notes` | `{ body }` | Internal note |
| POST | `/api/staff-applications/{id}/messages` | `{ body }` | Emails the candidate and stores an `outbound` message |
| POST | `/api/staff-applications/{id}/reject` | `{ message? }` | If `message` is present, emails it. Sets `stage = rejected` and logs an event. |
| POST | `/api/staff-applications/{id}/accept` | see §6.1 | Creates the staff account. Returns `{ application, user }`. |

### 5.4 Staff

| Method | Endpoint | Who | Body / query |
|---|---|---|---|
| GET | `/api/staff` | any staff | `search`, `department`, `role`, `active` (only `hr` can request `active=0`) |
| GET | `/api/staff/{id}` | any staff | |
| POST | `/api/staff` | hr | `name, email, job_title, discipline, department, start_date, phone?, location?, roles[]`. For existing employees not hired through the pipeline. Sends the welcome email (§7). |
| PATCH | `/api/staff/{id}` | hr: all fields. Self: `phone`, `location` only. | Ignore or reject other fields from non-HR users with `403`. |
| POST | `/api/staff/{id}/deactivate` | hr | Sets `is_active = false` and **revokes their sessions and tokens**. A user cannot deactivate themselves. |
| POST | `/api/staff/{id}/reactivate` | hr | |

Only `admin` may grant or remove the `admin` role.

---

## 6. Workflows

### 6.1 Applicant → staff (hiring pipeline)

```
Careers form ──► staff_applications (stage: applied)
                   │  HR: screening → interview (schedule) → offer
                   │  notes, ratings, emails to the candidate along the way
                   ├─► reject  (optional email) ──► stage: rejected
                   └─► accept  ──► creates users row ──► stage: accepted
```

`POST /api/staff-applications/{id}/accept` body:

| Field | Rule |
|---|---|
| email | required, email, unique:users. The company email (the UI suggests `firstname@stableshield.com`). |
| job_title | required |
| discipline | required, enum (§2) |
| department | required, exists |
| roles[] | array of roles, defaults to `[staff]`. Only `admin` may include `admin`. |
| start_date | required, date |

Run these steps in one transaction:
1. Create the user. Copy `name`, `phone` and `location` from the application, set `is_active = true`, `password = null`, and `staff_application_id`.
2. Set the application's `stage = accepted` and `user_id`, and log the event "Hired. Staff account created for …".
3. After commit, send the **welcome / set-password email** to the new company email (a password-reset token with a 72-hour expiry).
4. Return `409` if the application is already accepted.

### 6.2 Inbox lifecycle

`new` → (assigned) `open` → (reply sent) `awaiting_customer` → (customer replies) `open` → `resolved` → `closed`.
- Meetings and demos use `scheduled` once a time is agreed.
- Optional automation: if an item has been `awaiting_customer` for 7 days, move it to `resolved` and log an event.
- Optional automation: if an item has been `resolved` for 14 days, move it to `closed`.

---

## 7. Email notifications

Use queued mailables.

| Trigger | To | Content |
|---|---|---|
| Project enquiry, meeting request, demo request received | **sales@stableshield.com** | Summary, reference, link to `/portal/inbox/{kind}/{id}` |
| Support ticket received | **support@stableshield.com** | Same, with priority in the subject when High or Critical |
| Staff application received | **info@stableshield.com** (or an HR inbox) | Summary, link to `/portal/applications/{id}`. Do **not** attach the CV. |
| Partner application received | **info@stableshield.com**, cc **legal@stableshield.com** | Summary and link |
| Any public submission | The submitter | "We've received your {request}, reference XXX-123. We'll reply within 1–2 working days." *(company to confirm)* |
| Item assigned | The assignee | Link to the item |
| Reply sent from the portal (`/replies`, `/messages`, `/reject`) | Contact or candidate | The body text. From: the matching team address. Subject: `[REF] original subject`. Set a `Reply-To` that lets replies thread back (below). |
| Staff account created | The new user | Welcome email and set-password link |

This routing matches what the website uses today: until the API exists, the forms open the visitor's own email app addressed to these mailboxes (see `mailFallback` in `form-api.config.ts`).

**Customer replies (phase 2):** set `Reply-To: support+SUP-2201@stableshield.com`, or use an inbound-mail service (Mailgun or Postmark inbound webhooks). Match incoming mail to the item by reference, store it as an `inbound` message, and set the status back to `open`. Until then, staff copy customer replies in manually as notes.

---

## 8. Files

- Store CVs and screenshots on a **private** disk (`storage/app/private` or S3 without public access). Never store them in `public/`.
- Rename every stored file to a random name and keep the original name in the database.
- Serve files only through temporary signed URLs (`Storage::temporaryUrl`, 10 minutes), and only to users with access to the parent record. The portal shows `cv_url` as the "Download CV" link.
- Validate the MIME type by reading the file content, not the extension. Limits: CV 8 MB (pdf, doc, docx); screenshot 5 MB (images, pdf).
- Optional: virus-scan uploads (ClamAV) before attaching them to the record.
- Retention: delete CVs of rejected candidates after 12 months, unless the company decides otherwise. Update the privacy notice to match.

---

## 9. Security checklist

- Allow CORS and Sanctum stateful domains only for the site's own domains.
- Rate limits: public forms 5/min/IP; login 5/min/email+IP; portal API 120/min/user.
- Honeypot `website_hp`. Optionally add Cloudflare Turnstile to public forms later; the frontend can send its token as `cf_turnstile_response`.
- Enforce authorization with Policies on every portal route. **Don't rely on the frontend hiding things.**
- Keep an audit log of status, assignee, role and activation changes. The `event` messages cover inbox items and applications; add `activity_log` for user changes.
- Strip HTML from all free-text fields and send emails as plain text, or escape them in Blade.
- Deactivated users: block login and delete their sessions and tokens immediately.

---

## 10. Wiring the frontend

| What | File | Change |
|---|---|---|
| Public forms | `angular-app/src/app/core/form-api.config.ts` | Set `apiBaseUrl`. Endpoints are already mapped. |
| Login / session | `angular-app/src/app/portal/core/auth.service.ts` | Replace the mock `login()`, `logout()` and `restore()` with the §2 endpoints (call `withCredentials`, CSRF cookie first) |
| Portal data | `angular-app/src/app/portal/core/portal-data.service.ts` | Each method has a comment naming its endpoint. Replace the in-memory bodies with `HttpClient` calls. |
| Models | `angular-app/src/app/portal/core/models.ts` | Mirrors the resources above. The frontend uses camelCase internally; map snake_case to camelCase in the service, or use an HTTP interceptor. |
| Sample data | `angular-app/src/app/portal/core/mock-data.ts` | Delete once the API is live |

Demo sign-in (local development only): `admin@`, `hr@`, `sales@`, `support@` or `chidi@stableshield.com`, password `portal123`.
