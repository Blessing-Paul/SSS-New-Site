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

Open `http://localhost:4200/`. Angular Router supports clean paths such as `/about` and `/products`; legacy `.html` paths redirect to their clean equivalents. `angular-app/public/_redirects` provides the single-page-app fallback for Netlify direct-route requests. Bootstrap 5.3.8, Bootstrap Icons and Google Fonts are retained from their CDNs. Original page CSS and image assets are preserved. Forms retain their Netlify attributes; local development shows a preview-only submission message. The login page is a UI preview only; authentication is not implemented.

Build and run the Angular tests with `npm run build` and `npm test -- --watch=false` from `angular-app/`.

The static Netlify form declarations in `angular-app/src/index.html` allow Netlify to discover forms compiled into Angular templates. Actual form delivery still depends on the deployed site's Netlify configuration and should be tested after deployment.

## Enable the contact form
The form is marked up for **Netlify Forms**. To receive submissions:
1. Deploy the folder to Netlify.
2. Confirm form detection is enabled and deploy once.
3. Submit a test enquiry and confirm it appears in Netlify Forms.
4. Configure notifications to an official company inbox and add a suitable spam-protection policy.
5. If deploying elsewhere, replace the form's `data-netlify` setup with your chosen backend/form endpoint and test it end-to-end.

No official email, telephone number, street address, social profiles, client references, certifications or case-study results were invented because they were not provided in the source blueprint.

## Before public launch
- Add verified company contact details and business hours.
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
