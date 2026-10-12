# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Deploying to Firebase Hosting

Build the site and deploy it from the project root:

```sh
npm run build
firebase login
firebase deploy --only hosting
```

Firebase Hosting serves the Vite build from `dist` and rewrites routes to `index.html`.

The Firebase client configuration lives in `src/firebase/`. Submitted assessments
are written to Firestore's `assessments` collection. Optional image/PDF attachments
are uploaded to Cloud Storage and referenced by storage path. Before attachments
can be submitted, initialize the project's Storage bucket in the Firebase Console
and deploy its rules with `firebase deploy --only storage`.

Firestore and Storage rules restrict respondents to creating submissions and
uploading supported attachments. Admin access and Excel export require a separate
authenticated admin workflow; they are not exposed to public respondents. These
public create-only rules do not provide rate limiting; use App Check and/or a
validated server-side submission endpoint to mitigate automated abuse.
