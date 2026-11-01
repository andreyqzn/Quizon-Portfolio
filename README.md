# Andrey Quizon — Portfolio

Employment-ready personal portfolio for **Andrey C. Quizon**, Frontend Developer (Pampanga, Philippines).

**Live:** [https://andrey-quizon-portfolio-delta.vercel.app](https://andrey-quizon-portfolio-delta.vercel.app)  
**GitHub:** [andreyqzn/Quizon-Portfolio](https://github.com/andreyqzn/Quizon-Portfolio)

**Stack:** Vite · React · TypeScript · Tailwind CSS  
**Features:** Dark / light mode, selected projects (Smart Queue, Dina's Mami House), resume download

## Local development

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Deploy on Vercel (Phase A)

1. Push this repo to GitHub (`andreyqzn/Quizon-Portfolio`).
2. Sign in at [vercel.com](https://vercel.com) with your personal GitHub/Vercel account.
3. **Add New Project** → Import this repository.
4. Framework preset: **Vite** (or rely on `vercel.json`).
5. Build command: `npm run build` · Output: `dist`.
6. Deploy and save the `*.vercel.app` URL for applications / LinkedIn.

## Move to a professional GitHub account (Phase B)

Keep the **same Vercel project** so the production URL stays stable.

### Preferred: transfer the repository

1. Create your professional GitHub account.
2. On the school repo: **Settings → General → Danger Zone → Transfer ownership** → new account.
3. In Vercel → Project → **Settings → Git**: reconnect the repo under the new GitHub identity if the link breaks.
4. Update your local remote:

```bash
git remote set-url origin git@github.com:NEWUSER/REPO.git
```

5. Push a small commit and confirm Vercel rebuilds successfully.

### Alternative: mirror to a new repo

1. Create an empty repo on the professional account.
2. Push all branches/tags to the new remote.
3. In Vercel, point the project at the new repository (same Vercel project).
4. Archive or privatize the school repo; leave a short README pointer if needed.

## Project structure

```
src/
  components/     # Header, sections, ThemeToggle
  data/content.ts # Copy, experience, projects, stack
  hooks/useTheme.ts
public/
  assets/         # Photo, icons, project images
  documents/      # Resume PDF
  demos/          # Static demos (e.g. Dina's Mami House)
```

Update portfolio copy and projects in `src/data/content.ts`. Replace `/public/assets/img/smart-queue-placeholder.svg` with real Smart Queue screenshots when ready, and add `liveUrl` / `repoUrl` in the projects data.
