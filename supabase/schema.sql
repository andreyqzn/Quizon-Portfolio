-- Portfolio CMS schema, RLS, storage, and seed data
-- Run this entire file in Supabase → SQL Editor

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profile (
  id int primary key check (id = 1),
  name text not null,
  role text not null,
  location text not null,
  email text not null,
  resume_path text,
  photo_path text,
  instagram_url text,
  github_url text,
  linkedin_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.about (
  id int primary key check (id = 1),
  paragraphs text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  org text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.education (
  id int primary key check (id = 1),
  degree text not null,
  school text not null,
  detail text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.tech_stack (
  id int primary key check (id = 1),
  frontend text[] not null default '{}',
  backend text[] not null default '{}',
  tools text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.beyond_coding (
  id int primary key check (id = 1),
  body text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  tech text[] not null default '{}',
  image_path text,
  live_url text,
  repo_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Updated_at helper
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profile_updated_at on public.profile;
create trigger profile_updated_at before update on public.profile
for each row execute function public.set_updated_at();

drop trigger if exists about_updated_at on public.about;
create trigger about_updated_at before update on public.about
for each row execute function public.set_updated_at();

drop trigger if exists education_updated_at on public.education;
create trigger education_updated_at before update on public.education
for each row execute function public.set_updated_at();

drop trigger if exists tech_stack_updated_at on public.tech_stack;
create trigger tech_stack_updated_at before update on public.tech_stack
for each row execute function public.set_updated_at();

drop trigger if exists beyond_coding_updated_at on public.beyond_coding;
create trigger beyond_coding_updated_at before update on public.beyond_coding
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profile enable row level security;
alter table public.about enable row level security;
alter table public.experience enable row level security;
alter table public.education enable row level security;
alter table public.tech_stack enable row level security;
alter table public.beyond_coding enable row level security;
alter table public.projects enable row level security;

-- Public read
drop policy if exists "Public read profile" on public.profile;
create policy "Public read profile" on public.profile for select using (true);

drop policy if exists "Public read about" on public.about;
create policy "Public read about" on public.about for select using (true);

drop policy if exists "Public read experience" on public.experience;
create policy "Public read experience" on public.experience for select using (true);

drop policy if exists "Public read education" on public.education;
create policy "Public read education" on public.education for select using (true);

drop policy if exists "Public read tech_stack" on public.tech_stack;
create policy "Public read tech_stack" on public.tech_stack for select using (true);

drop policy if exists "Public read beyond_coding" on public.beyond_coding;
create policy "Public read beyond_coding" on public.beyond_coding for select using (true);

drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects" on public.projects for select using (true);

-- Authenticated write (single admin user; disable public signups in Auth settings)
drop policy if exists "Auth write profile" on public.profile;
create policy "Auth write profile" on public.profile for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Auth write about" on public.about;
create policy "Auth write about" on public.about for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Auth write experience" on public.experience;
create policy "Auth write experience" on public.experience for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Auth write education" on public.education;
create policy "Auth write education" on public.education for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Auth write tech_stack" on public.tech_stack;
create policy "Auth write tech_stack" on public.tech_stack for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Auth write beyond_coding" on public.beyond_coding;
create policy "Auth write beyond_coding" on public.beyond_coding for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Auth write projects" on public.projects;
create policy "Auth write projects" on public.projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Storage bucket + policies
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read portfolio assets" on storage.objects;
create policy "Public read portfolio assets"
  on storage.objects for select
  using (bucket_id = 'portfolio-assets');

drop policy if exists "Auth upload portfolio assets" on storage.objects;
create policy "Auth upload portfolio assets"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

drop policy if exists "Auth update portfolio assets" on storage.objects;
create policy "Auth update portfolio assets"
  on storage.objects for update
  using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

drop policy if exists "Auth delete portfolio assets" on storage.objects;
create policy "Auth delete portfolio assets"
  on storage.objects for delete
  using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Seed (upsert safe to re-run)
-- ---------------------------------------------------------------------------

insert into public.profile (
  id, name, role, location, email,
  resume_path, photo_path,
  instagram_url, github_url, linkedin_url
) values (
  1,
  'Andrey C. Quizon',
  'Frontend Developer',
  'Pampanga, Philippines',
  'canilaoquizonandrey@gmail.com',
  null,
  null,
  'https://www.instagram.com/heizzzx/',
  'https://github.com/andreyqzn',
  'https://www.linkedin.com/in/andrey-quizon-5a188a373/'
)
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  location = excluded.location,
  email = excluded.email,
  instagram_url = excluded.instagram_url,
  github_url = excluded.github_url,
  linkedin_url = excluded.linkedin_url;

insert into public.about (id, paragraphs) values (
  1,
  array[
    'I build clean, interactive interfaces that turn complex workflows into something people can actually use. My focus is frontend development — React, TypeScript, and thoughtful UI — with enough full-stack experience to ship end-to-end features when a product needs them.',
    'Recently I led development on a Smart Queue Management System for a pediatric clinic, with QR arrival validation, live line monitoring, push notifications, and role-based dashboards for parents, secretaries, and doctors. I care about bridging technical functionality and visual clarity so technology stays accessible.'
  ]
)
on conflict (id) do update set paragraphs = excluded.paragraphs;

insert into public.education (id, degree, school, detail) values (
  1,
  'Bachelor of Science in Information Technology',
  'Pampanga State Agricultural University (PSAU)',
  'Frontend-focused coursework in web systems and software development'
)
on conflict (id) do update set
  degree = excluded.degree,
  school = excluded.school,
  detail = excluded.detail;

insert into public.tech_stack (id, frontend, backend, tools) values (
  1,
  array['JavaScript', 'TypeScript', 'React', 'Vite', 'Tailwind CSS'],
  array['Node.js', 'Express.js', 'Firebase', 'MongoDB', 'PHP'],
  array['Git', 'GitHub', 'VS Code', 'Android Studio', 'Figma']
)
on conflict (id) do update set
  frontend = excluded.frontend,
  backend = excluded.backend,
  tools = excluded.tools;

insert into public.beyond_coding (id, body) values (
  1,
  'Outside of code, I work on graphic and poster design, which sharpens how I organize information visually. I play competitive online games that keep decision-making and teamwork sharp, and I practice guitar — a steady reminder that patience and repetition are how real skill compounds. Those habits carry into how I approach product UI.'
)
on conflict (id) do update set body = excluded.body;

-- Experience: clear and reseed for idempotent demo seed
delete from public.experience;
insert into public.experience (year, title, org, sort_order) values
  ('2026', 'Full-Stack Developer', 'Smart Queue — Pediatric Clinic', 0),
  ('2025', 'Frontend Developer', 'Client Web Project', 1),
  ('2025', 'Programmer', 'STI Code Fest', 2),
  ('2024', 'Full-Stack Developer', 'Enrollment System — Client Project', 3);

delete from public.projects where slug in ('smart-queue', 'dinas-mami-house');
insert into public.projects (
  slug, title, subtitle, description, tech, image_path, live_url, repo_url, featured, sort_order
) values
(
  'smart-queue',
  'Smart Queue Management System',
  'Pediatric Clinic',
  'Real-time queue system for a pediatric clinic with QR arrival validation, live line monitoring, Firebase Cloud Messaging, and role-based dashboards for parents, secretaries, and doctors.',
  array['React', 'Firebase', 'FCM', 'TypeScript'],
  null,
  null,
  null,
  true,
  0
),
(
  'dinas-mami-house',
  'Dina''s Mami House',
  'Restaurant Website',
  'Multi-page marketing site for a local Filipino comfort-food restaurant — homepage, menu, gallery, about, and contact — built to help customers explore the menu and reach the business easily.',
  array['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
  null,
  '/demos/dinas-mami-house/index.html',
  'https://github.com/andreyqzn/Quizon-Portfolio',
  false,
  1
);
