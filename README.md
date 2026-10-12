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
`.env.local` for local development and add your Supabase publishable key.
Publishable keys are intended for client apps; never use a secret or service-role
key in this frontend.

Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor to
create separate `university_assessments`, `industry_assessments`, and
`organization_assessments` tables, enable insert-only row-level security, and
create one private attachment bucket for each category. The script also copies
records from the previous combined `assessments` table when it exists, and
revokes public access to that legacy table without deleting it.

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
