# Stable Shield Solutions

The Angular application is the sole website implementation in this repository. It uses Angular 20 standalone components and lazy-loaded routes.

## Structure

- `src/app/shared/` — reusable site header and footer.
- `src/app/pages/` — standalone page components with separate templates.
- `src/app/core/` — shared site effects and typed open-roles data service.
- `src/styles/legacy/` — retained original site stylesheets, imported locally by Angular.
- `src/site-overrides.css` — narrowly scoped additions for the light-mode hero control and new pages.
- `public/assets/` and `public/data/` — website images and careers data.

## Run and test

```sh
npm install
npm start
```

Open `http://localhost:4200/`. Routes use clean paths, including `/apply`, `/login`, and `/unauthorized`; unmatched paths display the themed 404 page. Legacy `.html` paths redirect to their clean equivalents. The login page is a UI-only preview and does not authenticate or transmit credentials. Run `npm run build` for a production build and `npm run test -- --watch=false` for unit tests.

Forms retain their Netlify attributes; actual delivery depends on the deployed site's form configuration. The careers form is available on `/careers` and `/apply`.
