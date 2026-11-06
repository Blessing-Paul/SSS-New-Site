# Stable Shield: Developer Handover & Training Guide

You're taking over the Stable Shield website and staff portal. Work through this guide top to bottom once, with the app running beside you. Each part ends with a short "try it" exercise. By the end you should be able to explain how anything in the product works, change it safely, and connect it to the Laravel backend.

Companion document: [backend-api-spec.md](backend-api-spec.md). That one is for whoever builds the API; this one is for you.

---

## Part 1: What the product is

There are two products in one Angular app:

| | Who uses it | URL | Purpose |
|---|---|---|---|
| **Public website** | Prospective clients, partners, job seekers | `/`, `/services`, `/products`, `/contact`, … | Marketing, plus six forms that capture leads, tickets and applications |
| **Staff portal** | Stable Shield staff | `/portal/...` (sign in at `/login`) | Where those submissions are handled: reply to customers, run hiring, manage staff |

The flow that ties them together:

```
Visitor fills a form ─► (today) their email app opens, addressed to the right team
                     └► (with backend) Laravel saves it ─► appears in a portal inbox ─► staff reply / assign / resolve
Job applicant ─► Staff applications ─► screening → interview → offer ─► Hire ─► becomes a staff account ─► can sign in to the portal
```

**Current state:** the frontend is complete. **There is no backend yet.**
- Website forms validate input, then open the visitor's email app with a pre-filled message.
- The portal runs entirely on sample data held in browser memory. Reloading the page resets it.

---

## Part 2: Getting it running

Requirements: Node 20+ and npm. Angular 20 is installed locally, so there's nothing to install globally.

```bash
cd angular-app
npm install
npm start                     # http://localhost:4200
npm run build                 # production build → dist/angular-app/browser
npm test -- --watch=false     # unit tests (Karma + Chrome)
```

Hosting is a static single-page app. `public/_redirects` sends every path to `index.html`; that's the Netlify syntax. On another host, configure the same fallback (Apache `.htaccess`, an nginx `try_files`, or the host's SPA setting).

> **Try it:** run `npm start`, open the home page, toggle dark mode in the header, then open `/login`.

---

## Part 3: Code map

```
angular-app/src/
├── index.html                 Shell page (fonts, Bootstrap Icons CDN)
├── styles.css                 Imports the global CSS below
├── styles/legacy/             Website design system (global CSS)
│   ├── styles.css, home.css, theme.css   base, home page, dark theme
│   └── pages.css              inner pages + all website form styles (.form-p)
└── app/
    ├── app.routes.ts          EVERY route lives here (website + portal)
    ├── app.ts / app.html      Root shell: hides website header/footer inside /portal
    ├── app.config.ts          Router (component input binding on), HttpClient
    ├── core/                  Website data & services
    │   ├── services.data.ts       ★ the 13 services (one source of truth)
    │   ├── products.data.ts       ★ the 14 Silo products
    │   ├── jobs.service.ts        reads public/data/jobs.json (open roles)
    │   ├── form-api.config.ts     ★ where forms go (API endpoints + email fallback)
    │   ├── form-submission.service.ts  sends a form (API or email app)
    │   └── site-effects.service.ts     scroll reveals, counters, tabs, ?service= prefill
    ├── shared/
    │   ├── site-header/, site-footer/
    │   ├── form-submit.directive.ts      ★ appFormSubmit: makes any <form> submit properly
    │   ├── project-enquiry-form/         reusable enquiry form (Home + Contact)
    │   └── job-application-form/         reusable staff application form (Careers + /apply)
    ├── pages/                 One folder per website page
    └── portal/                ★ the staff portal
        ├── core/
        │   ├── models.ts              types, roles, disciplines, inbox config, stages
        │   ├── auth.service.ts        sign-in (mock now)
        │   ├── auth.guard.ts          must be signed in + have route roles
        │   ├── inbox.guard.ts         checks the inbox kind and role
        │   ├── portal-data.service.ts ★ every portal read/write (mock now)
        │   ├── mock-data.ts           sample staff, inbox items, applications
        │   └── format.ts              timeAgo(), initials()
        ├── layout/                sidebar + top bar shell, portal.css (portal styles)
        └── pages/                 dashboard, inbox-list, inbox-detail, applications,
                                   application-detail, staff, staff-detail (also profile)
```

★ = files you'll touch most.

**Patterns used throughout:**
- **Standalone components** with lazy-loaded routes (`loadComponent`). There are no NgModules.
- **Signals** for portal state (`signal`, `computed`, `input()`). Templates use the new `@if`, `@for` control flow.
- **Route params arrive as component inputs.** `withComponentInputBinding()` is enabled, so `:kind` and `:id` become `kind()` and `id()`.
- Website styles are **global legacy CSS**. Portal styles live in `portal/layout/portal.css`, which is loaded only with the portal so public pages stay fast.

---

## Part 4: The public website

### 4.1 Pages

Routes: Home, About, Services, Products (plus `/products/:slug` for each product), Industries, Partners, Careers, `/apply`, Contact, Support, Resources, Privacy, Terms, Accessibility, `/access` (webmail and sign-in help), `/login`, `/unauthorized`, and a 404 page.

Old `.html` URLs and the old silo pages (`/school-silo` etc.) redirect to their new addresses (see the bottom of `app.routes.ts`). The tests in `app.spec.ts` guard these.

### 4.2 The services catalogue: change it in ONE place

`core/services.data.ts` feeds:
- the Services page sub-menu, and the "Thirteen capabilities" / "13 services" text;
- the "What do you need?" dropdown on every enquiry form, grouped Build / Infrastructure / Transform / Advise & support;
- the service-group checkboxes on the partner form.

Each service's `slug` must equal its section `id` on the Services page. The "Talk to us" link in that section goes to `/contact?service=<slug>#enquiry`, which pre-selects the dropdown.

> **Try it:** open `/services`, click "contact" on the Cloud section, and watch the Contact form open with Cloud selected.

### 4.3 The six forms

| Form | Where | Component / location | Sent as |
|---|---|---|---|
| Project enquiry | Home, Contact | `shared/project-enquiry-form` | `project-enquiry` |
| Meeting request | Contact | inline in `pages/contact` | `meeting-request` |
| Product demo | Products | inline in `pages/products` | `product-demo` |
| Support request | Support | inline in `pages/support` | `support-request` |
| Staff application | Careers, `/apply` | `shared/job-application-form` | `staff-application` |
| Partner application | Partners (5-step wizard) | inline in `pages/partners` | `partner-application` |

**How a submission works:** follow this once in the code; it's the core of the site.

1. The form tag has `appFormSubmit="project-enquiry"`. That's `shared/form-submit.directive.ts`.
2. On submit, the directive:
   1. stops the browser's own submit;
   2. runs the browser's built-in validation and highlights bad fields;
   3. drops the submission if the hidden honeypot field `website_hp` was filled (bots fill it);
   4. reads each field's **label and value** to build a readable summary;
   5. calls `FormSubmissionService.submit(key, formData, lines)`.
3. `FormSubmissionService` looks at `FORM_API.apiBaseUrl` in `core/form-api.config.ts`:
   - **Empty (today):** it builds a `mailto:` link to the right team (the `mailFallback` table), with the subject "Project enquiry from {name}" and every answer in the body, then opens the visitor's email app. Files can't be attached through a `mailto:` link, so the message asks the visitor to attach them.
   - **Set (later):** it POSTs `multipart/form-data` to the endpoint. A Laravel `422` response shows its error messages under the matching fields.
4. The status line (`[data-form-status]`) shows the result.

Email routing today: enquiries, meetings and demos go to `sales@`; support to `support@`; job applications to `info@`; partner applications to `info@` with `legal@` in cc.

**Rules for form fields:**
- The `name` attribute is the API contract. Use snake_case, and `field[]` for checkbox groups. Rename a field only if you update the backend spec too.
- Put the visible label text **first** inside its `<label>`. The email summary, and the partner wizard's review step, read the label from there.
- Give the form a status element: `<p class="f-status" role="status" aria-live="polite" data-form-status></p>`.

> **Try it:** submit the Contact enquiry form empty (fields turn red), then fill it in properly. Your email app opens addressed to sales@ with all the answers listed.

### 4.4 Partner wizard specifics

`pages/partners/partners-page.ts` handles step navigation and validates each step. Which fields appear depends on the partnership type:

| Type | Extra fields shown |
|---|---|
| Reseller | Customer base, sales team, current portfolio |
| Implementation | Technical staff, delivery capacity, certifications |
| Technology | Product, URL, integration type, API availability |
| Co-development | Project description, stage, tech stack, support needed, project **budget** |

The capabilities, regions and sectors fields are hidden for co-development. Hidden fields are skipped by validation and left out of the email. Pressing Enter on an early step moves to the next step instead of submitting.

> **Try it:** `/partners?type=co-development#apply` opens the wizard with Co-development pre-selected. Walk through all 5 steps and check the review screen.

### 4.5 Jobs

Open roles come from `public/data/jobs.json`. To post a job, add an object with `id, title, department, location, type, summary, responsibilities[], requirements[]`. It appears on Careers, and in the Role dropdown of the application form. Its `id` is sent as `job_id`.

---

## Part 5: The staff portal, end to end

### 5.1 Signing in

Go to `/login` (the footer's "Staff login" link goes there too). Demo accounts, all with password `portal123`:

| Email | Person | Roles | Sees |
|---|---|---|---|
| admin@stableshield.com | Amaka Eze | Admin | Everything |
| hr@stableshield.com | Tunde Bello | HR, Staff | Applications, staff management |
| sales@stableshield.com | Grace Okafor | Sales, Staff | Enquiries, meetings, demos, partners |
| support@stableshield.com | Ibrahim Musa | Support, Staff | Support tickets |
| chidi@stableshield.com | Chidi Nwosu | Staff | Dashboard, directory, own profile |
| ngozi@stableshield.com | (deactivated) | | Sign-in refused on purpose |

How access control works:
- `auth.guard.ts` blocks `/portal/**` unless you're signed in, and sends you to `/login?returnUrl=…`.
- A route's `data.roles` lists the roles needed; without them you land on `/unauthorized`.
- `inbox.guard.ts` checks each inbox's roles, which are defined in `INBOXES` in `models.ts`.
- **Admin passes every check.**
- The sidebar uses the same rules (`auth.hasAnyRole`), so people never see links they can't open.

The session is kept in `sessionStorage`, so it lasts until the browser tab closes.

### 5.2 Layout tour

- **Sidebar:** sections Overview, Inboxes, People and Account. Red badges count **new** items. On small screens it becomes a slide-out menu (☰).
- **Top bar:** dark-mode toggle and user menu (your email, your roles, My profile, Sign out).
- **"View website"** at the bottom of the sidebar opens the public site in a new tab.

### 5.3 Walkthrough 1: Sales handles an enquiry

Sign in as **sales@**.

1. **Dashboard.** Tiles show open and new counts per inbox. "Assigned to me" is your queue. "Waiting for someone" lists unassigned items, with critical ones first.
2. Open **Project enquiries**. Search across reference, name, email and organization. The filter offers Active (the default), Unassigned, each status, or All. Bold rows are new.
3. Open **ENQ-1042 (Bright Future Schools)**:
   - **Right column:** the contact (click to email or call), **Manage** (status, priority, owner, "Assign to me"), and the customer's **submitted details**, exactly as they filled in the form.
   - **Left column:** the conversation. Plain white cards are from the customer, blue cards are our email replies, yellow dashed cards are internal notes, and small grey lines are system events.
4. Click **Assign to me**. The status jumps from New to In progress, and an event is logged.
5. **Reply tab:** it starts with "Hello Adaeze,". Write a reply, choose "Then set status" (Awaiting reply by default), and click **Send reply**. Once the backend exists, this emails the customer.
6. **Internal note tab:** "Spoke on phone, sending proposal Friday." Notes are never sent to the customer.
7. When the work is finished, set the status to **Resolved**, and later **Closed**.

Meeting and demo requests work the same way but also have a **Scheduled** status. Partner applications show all the wizard answers under "Submitted details".

### 5.4 Walkthrough 2: Support handles a critical ticket

Sign in as **support@**. The dashboard puts **SUP-2201 (Unity College, Critical)** at the top of "Waiting for someone". Open it. The submitted details include category, system, version, users affected, business impact and steps to reproduce. That's exactly what the support form now collects, so you have what you need to start on it. Assign it, reply, and resolve.

### 5.5 Walkthrough 3: HR hires someone (applicant → staff)

Sign in as **hr@**.

1. **Staff applications.** Stage chips (Applied, Screening, Interview, Offer, Hired, Rejected) filter the list and show counts.
2. Open **Kelechi Umeh (Applied)**. The step tracker at the top shows where they are.
3. Work the candidate:
   - **Move to Screening →**, then later Interview;
   - **Schedule interview**: pick a date and time. This also moves them to Interview;
   - **Rate** with the stars on the right;
   - **Add note** for the hiring panel, or **Email candidate**, which is logged as sent.
   - The CV card shows the file name. The download link works once the backend serves files.
4. Click **Hire** and fill in:
   - **Company email:** pre-filled as `kelechi@stableshield.com`. Edit it if needed.
   - **Job title:** taken from the role they applied for.
   - **Discipline:** for example Backend developer. **Department:** Engineering. **Start date.**
   - **Portal access:** Staff is ticked. Add Support or Sales if their job needs those inboxes.
5. Click **Hire and create account**. You land on their new **staff profile**, which shows a "Staff account created" banner and a link back to the original application. Their name, phone and location were copied from the application.
6. **Reject** instead opens an editable, polite rejection email. Sending it sets the stage to Rejected.

> With the backend, the new hire receives a "set your password" email and can then sign in. In the demo, new accounts can't sign in, because the mock only knows the sample accounts.

### 5.6 Walkthrough 4: Staff directory and profiles

- **Everyone:** sees the directory (search, department filter) and read-only profiles.
- **HR / admin:** **Add staff** for existing employees who didn't come through hiring, edit every field, change portal access, **Deactivate / Reactivate** someone (you can't deactivate yourself), and "Show deactivated" in the directory.
- **Any user → My profile:** can edit only their own phone and location. Everything else is managed by HR.

**Roles vs disciplines:** a **role** decides what someone can *access* (Admin, HR, Sales, Support, Staff). A **discipline** describes their *job* (Frontend, Backend, Full-stack, Mobile, DevOps, Systems & infrastructure engineer, Network, Cybersecurity, QA, UI/UX, Project manager, …). A DevOps engineer with the Support role can work support tickets; a designer with only Staff can't.

> **Try it:** sign in as chidi@, confirm the inboxes and applications are missing from the sidebar, then type `/portal/applications` in the address bar. You should be redirected to `/unauthorized`.

---

## Part 6: Common changes, recipe style

**Add a service:** add it to `SERVICES` in `core/services.data.ts`, then add a matching `<article class="sector" id="<slug>">` section on the Services page. The menu, counts and dropdowns update themselves.

**Add a form field:**
1. Add the input to the form, with a snake_case `name` and the label text first inside its `<label>`.
2. Add it to the matching table in `backend-api-spec.md` §4.
3. If the portal should show it, the backend includes it in the item's `fields`. No frontend change is needed, because the detail page lists whatever `fields` contains.

**Add a new form type:**
1. Add a key to `FORM_API.endpoints` and to `mailFallback` in `form-api.config.ts`.
2. Put `appFormSubmit="<key>"` on the form, plus a `[data-form-status]` element.
3. Import `FormSubmitDirective` in the page component.

**Add a portal inbox:**
1. Extend the `InboxKind` type and add an entry to `INBOXES` in `models.ts` (title, icon, prefix, roles, statuses).
2. Add matching counts in `PortalDataService.counts`.

The sidebar, dashboard tile, list page, detail page and route guard pick it up automatically.

**Add a role:** extend `Role` and `ROLE_LABELS` in `models.ts`, use it in `INBOXES` or a route's `data.roles`, and add it to the roles table in the backend spec.

**Add a discipline or department:** edit `DISCIPLINE_LABELS` or `DEPARTMENTS` in `models.ts`.

**Change who gets form emails (before the backend):** edit `mailFallback` in `form-api.config.ts`.

---

## Part 7: Connecting the Laravel backend

Do it in this order; each step can ship on its own.

1. **Public forms:** set `apiBaseUrl` in `form-api.config.ts`. Forms then POST to the endpoints in spec §4. Test each form, including a deliberate `422` to see field errors.
2. **Authentication:** in `portal/core/auth.service.ts`:
   - `login()` → `GET /sanctum/csrf-cookie`, then `POST /api/auth/login`;
   - `logout()` → `POST /api/auth/logout`;
   - on startup, `GET /api/auth/me` replaces `restore()`.

   Requests need `withCredentials: true`. Map snake_case to camelCase (`job_title` → `jobTitle`).
3. **Portal data:** in `portal/core/portal-data.service.ts`, every public method has a comment naming its endpoint. Replace each in-memory body with an `HttpClient` call and keep the method signatures, so no page needs to change.
   - The cleanest approach is to keep the signals, load data into them from the API, and update them from the API responses.
   - List pages currently filter in the browser. Once data volume grows, pass `search` and `status` to the API instead.
4. **Clean-up:** delete `mock-data.ts`, the forgiving mock login (and its demo hint on `/login`), and the `auth.service.spec.ts` demo tests. Replace them with tests against a mocked HttpClient.

**Important:** today's role checks run in the browser only. They improve usability but **give no security**. The API must enforce every permission (spec §9).

---

## Part 8: Testing & quality

- `npm test -- --watch=false` runs the route tests (clean URLs, redirects, the 404 page) and the mock auth tests.
- `npm run build` must pass. It warns if the first page load goes over 550 kB or a component's styles go over 24 kB. Portal code is lazy-loaded; keep it that way, and don't import portal files from website pages.
- Manual check before releasing:
  - each of the six forms, valid and invalid;
  - dark mode on a few pages;
  - a mobile-width check of the portal sidebar and inbox pages;
  - one full hire walkthrough.

---

## Part 9: Known gaps & next steps

| Gap | Why | Next step |
|---|---|---|
| No backend | Out of scope for the frontend phase | Build to `backend-api-spec.md` |
| Portal data resets on reload | Sample data lives in memory | Connect the API |
| Newly hired staff can't sign in to the demo | The mock knows only the sample accounts | Fixed by real auth |
| Customer replies by email don't reach the portal yet | Needs inbound email | Spec §7, "phase 2" |
| CV download disabled in the portal | Needs signed file URLs | Spec §8 |
| No portal pages for HR self-service (leave, timesheets, announcements) | Not built yet; the `/access` page mentions them | Plan as the next modules |
| Webmail link on `/access` | Address not configured | Set the `href` in `pages/portal/portal-page.html` |
| `public/_redirects` is Netlify syntax | Hosting not decided | Replace if you host elsewhere |

Welcome aboard. If something in this guide no longer matches the code, update the guide in the same commit.
