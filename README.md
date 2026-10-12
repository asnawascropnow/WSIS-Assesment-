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

## Supabase setup

The browser client reads `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY` from the environment. Copy `.env.example` to
`.env.local` for local development. Publishable keys are intended for client
apps; never use a secret or service-role key in frontend code.

Submissions are sent through the Vercel Edge Function at `/api/submissions`.
It validates all questionnaire answers and attachment references before using
`@supabase/server`'s server-only admin client to insert the record. The
publishable key is checked at the API boundary; file uploads continue to use
the browser's publishable client.

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel for the
browser, plus `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and
`SUPABASE_SECRET_KEY` for the server function. The secret key must be a newly
rotated value because the previously shared key was exposed. Store it only as
the server-side `SUPABASE_SECRET_KEY`; never use a `VITE_` prefix. `npm run dev`
uses the same API handler locally and requires these server variables in
`.env.local`. The `SUPABASE_JWKS_URL` is not needed until endpoints validate
user JWTs.

Run the updated [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase
SQL Editor. It removes direct table insert access from `anon` and
`authenticated` and grants insert access to `service_role` only, so production
submissions must pass through the validated server endpoint. The Supabase
server package requires Node.js 22 or later. The script creates the three
category tables and private attachment buckets, copies compatible records from
the legacy `assessments` table when present, and revokes public access to that
legacy table without deleting it.

All questions and table cells must be completed. Use `-`, `none`, or `nil` when a
value is not applicable or unavailable; file questions can instead be marked as
having no attachment. Responses preserve the questionnaire section and question
IDs in the `answers` JSON column, and each assessment table row stores an
`attachments` manifest with the original filename, category bucket, storage path,
question reference, content type, and size.

Attachments are uploaded under `<assessment-uuid>/<file-uuid>_<original-name>` in
the matching private bucket. To download them, use the Supabase dashboard's
Storage browser, open the category bucket and assessment UUID folder, and download
the file. Each table's `attachments` column identifies which folder/file belongs
to which question. The public client cannot read submissions or download files;
admin access and an in-app download/export workflow require a separate
authenticated admin feature. If a database insert fails after file upload, its
unreferenced private files may need cleanup from Storage.

The app is a static Vite site; build it with `npm run build` and publish the
generated `dist` folder using your hosting provider.
