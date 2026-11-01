# Supabase dashboard setup

Complete these steps once before (or while) using the admin CMS.

## 1. Create project

1. Go to [https://supabase.com](https://supabase.com) and sign in with your personal account.
2. **New project** → name `andrey-portfolio` → set a DB password → pick a nearby region.
3. Wait until the project is ready.

## 2. Auth (single admin)

1. **Authentication → Providers → Email** → enabled.
2. Disable public sign-ups (**Authentication → Providers → Email** or **Settings**: turn off “Allow new users to sign up”).
3. **Authentication → Users → Add user**:
   - Email: `canilaoquizonandrey@gmail.com`
   - Password: choose a strong password
   - Auto-confirm the user so you can log in immediately.

## 3. Schema, RLS, storage, seed

1. Open **SQL Editor**.
2. Paste and run the full contents of [`schema.sql`](./schema.sql).
3. Confirm tables exist under **Table Editor** and bucket `portfolio-assets` under **Storage**.

## 4. App environment variables

From **Project Settings → API**, copy:

- Project URL → `VITE_SUPABASE_URL`
- `anon` `public` key → `VITE_SUPABASE_ANON_KEY`

### Local

Copy [`.env.example`](../.env.example) to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### Vercel

Project → **Settings → Environment Variables** → add the same two keys for Production and Preview → redeploy.

## 5. Smoke check

1. Open the site → content should load (from Supabase or static fallback).
2. Visit `/admin/login` → sign in with the admin email/password.
3. Update a field and save → refresh the public home page (no redeploy needed).
