# Stable Shield Solutions website

This repository contains the Angular application for the Stable Shield Solutions website. The former static HTML, JavaScript and CSS site has been removed; run and deploy `angular-app/`.

## Included pages
- Home, about, services, products, industries, resources, support, careers, partners, contact and staff portal pages
- A job application page at `/apply` and a UI-only sign-in preview at `/login`
- School Silo, Office Silo and Training Silo product pages
- Privacy, terms and accessibility pages
- The older alternate home page is available at `/index-copy.html` and its original encoded path `/index%20copy.html`

Each page is represented by its own standalone, lazy-loaded Angular page component. The app uses clean paths such as `/about`, `/products`, and `/careers`; legacy `.html` URLs redirect to those clean paths. Shared navigation and footer components are in `angular-app/src/app/shared/`; the jobs data is served from `angular-app/public/data/jobs.json`. Original styles are retained under `angular-app/src/styles/legacy/`, and images are preserved in the app's public assets.

## Preview locally
Run:

```sh
cd angular-app
npm install
npm start
```

Open `http://localhost:4200/`. Angular Router supports clean paths such as `/about` and `/products`; legacy `.html` paths redirect to their clean equivalents. `angular-app/public/_redirects` provides the single-page-app fallback for Netlify direct-route requests. Bootstrap 5.3.8, Bootstrap Icons and Google Fonts are retained from their CDNs. Original page CSS and image assets are preserved. Until the Laravel API is connected, forms open the visitor's email app with their details pre-filled (see below). The login page is a UI preview only; authentication is not implemented.

Build and run the Angular tests with `npm run build` and `npm test -- --watch=false` from `angular-app/`.

## Forms and the Laravel backend
Every form is sent by `FormSubmitDirective` (`angular-app/src/app/shared/form-submit.directive.ts`) through `FormSubmissionService`. Endpoints live in `angular-app/src/app/core/form-api.config.ts`:

| Form | Endpoint |
| --- | --- |
| Project enquiry (Home, Contact) | `POST /api/enquiries` |
| Meeting request | `POST /api/meeting-requests` |
| Support request | `POST /api/support-tickets` |
| Product demo | `POST /api/demo-requests` |
| Staff application (Careers, /apply) | `POST /api/staff-applications` |
| Partner application | `POST /api/partner-applications` |

- While `apiBaseUrl` is empty, forms validate and then open the visitor's email app with a pre-filled message (routing in `mailFallback`: enquiries, meetings and demos → sales@, support → support@, job applications → info@, partner applications → info@ cc legal@). Files (CV, screenshots) can't be attached automatically, so the message asks the visitor to attach them.
- When the API is live, set `apiBaseUrl`. Forms post `multipart/form-data` with `Accept: application/json`; field `name`s (snake_case) are the request contract. Array fields use `name[]` (e.g. `products[]`).
- Laravel should return 201 on success and the standard 422 `{ message, errors }` on validation failure; errors are shown under the matching fields.
- `website_hp` is a honeypot: the frontend drops filled submissions, and the API should reject them too.
- File limits (CV, screenshots) and staff-application stages (applied → screening → interview → offer → staff account) are enforced by the backend.

The company phone numbers, support and sales emails, corporate-relations emails and address have been added to the Contact page and shared footer. Social profiles, client references, certifications and case-study results have not been invented.

## Before public launch
- Confirm the published company contact details and business hours are current.
- Confirm the legal company name and any registration details the company chooses to publish.
- Replace the draft Privacy Notice and Terms with reviewed documents matching real practices and applicable law.
- Confirm current product availability and features, particularly Office Silo and Training Silo.
- Add only approved client logos, testimonials, project evidence and team biographies.
- Check the actual form delivery path and privacy notice.
- Test accessibility, browser compatibility, responsive layout, page speed, SEO metadata, analytics and security headers.
- Replace starter resource topics with reviewed articles before representing them as a live knowledge base.

## Brand palette
- Primary navy sampled from `assets/logo-1.png` and `assets/logo-2.png`: `#133255`
- Brand red sampled from the logo: `#D51730`
- Home page supporting background: `#F5F7FA`
- Home page typography: Space Grotesk headings and Inter body/navigation text
