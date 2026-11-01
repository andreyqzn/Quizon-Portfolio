# Andrey Quizon — Portfolio

Employment-ready personal portfolio for **Andrey C. Quizon**, Frontend Developer (Pampanga, Philippines).

**Live:** [https://andrey-quizon-portfolio-delta.vercel.app](https://andrey-quizon-portfolio-delta.vercel.app)  
**GitHub:** [andreyqzn/Quizon-Portfolio](https://github.com/andreyqzn/Quizon-Portfolio)

**Stack:** Vite · React · TypeScript · Tailwind CSS · Supabase  
**Features:** Dark / light mode, private `/admin` CMS, selected projects, resume download

## Local development

```bash
npm install
cp .env.example .env.local   # fill Supabase URL + anon key
npm run dev
```

```bash
npm run build
npm run preview
```

## Admin CMS (Supabase)

Content (text, socials, projects, CV, photo) is editable at **`/admin`** without redeploying.

1. Follow **[supabase/SETUP.md](supabase/SETUP.md)** to create the project, admin user, and run [`supabase/schema.sql`](supabase/schema.sql).
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` and in Vercel → Environment Variables.
3. Open `/admin/login` with your admin email/password.

Until Supabase is configured, the site uses static fallback content from `src/data/content.ts`.

## Deploy on Vercel

1. Push to `andreyqzn/Quizon-Portfolio`.
2. Ensure Vercel env vars for Supabase are set (Production + Preview).
3. Framework: **Vite** · Build: `npm run build` · Output: `dist`.
4. SPA routes (`/admin`) are covered by `vercel.json` rewrites.

## Project structure

```
src/
  components/        # Public UI + ProtectedRoute
  context/           # AuthProvider
  data/content.ts    # Static seed / fallback
  hooks/             # useTheme, usePortfolioContent
  lib/               # supabase client, uploads
  pages/             # Portfolio, Admin login, Admin dashboard
supabase/
  schema.sql         # Tables, RLS, storage, seed
  SETUP.md           # Dashboard setup checklist
public/
  assets/ documents/ demos/
```
