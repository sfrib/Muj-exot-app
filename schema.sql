create extension if not exists "uuid-ossp";

create or replace function auth_uid() returns uuid
language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claim.sub', true), ''), '00000000-0000-0000-0000-000000000000')::uuid;
$$;

create table if not exists public.users (
  id uuid primary key default auth_uid(),
  email text,
  full_name text,
  is_premium boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.species (
  id uuid primary key default uuid_generate_v4(),
  common_name text not null,
  scientific_name text,
  origin text,
  temp_min numeric,
  temp_max numeric,
  humidity_min numeric,
  humidity_max numeric,
  uvb_need text,
  enclosure_notes text,
  wild_diet text,
  captive_diet text
);

create type husbandry_type as enum ('feed','shed','weigh','uvb_change','clean','medication');

create table if not exists public.animals (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null default auth_uid(),
  species_id uuid references public.species(id) on delete set null,
  name text not null,
  sex text check (sex in ('male','female','unknown')) default 'unknown',
  birth_date date,
  tags text[] default '{}',
  acute_note text,
  photo_url text,
  created_at timestamptz default now()
);

create table if not exists public.husbandry_logs (
  id uuid primary key default uuid_generate_v4(),
  animal_id uuid not null references public.animals(id) on delete cascade,
  type husbandry_type not null,
  note text,
  quantity numeric,
  unit text,
  event_at timestamptz not null default now(),
  created_at timestamptz default now(),
  created_by uuid not null default auth_uid()
);

create table if not exists public.qr_links (
  id uuid primary key default uuid_generate_v4(),
  animal_id uuid not null references public.animals(id) on delete cascade,
  public_slug text unique not null,
  created_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null default auth_uid(),
  animal_id uuid references public.animals(id) on delete cascade,
  title text not null,
  due_at timestamptz not null,
  done_at timestamptz,
  created_at timestamptz default now()
);

alter table public.animals enable row level security;
alter table public.husbandry_logs enable row level security;
alter table public.qr_links enable row level security;
alter table public.notifications enable row level security;
alter table public.species enable row level security;

create policy "owners_read_own_animals"
on public.animals for select using (owner_id = auth_uid());

create policy "owners_modify_own_animals"
on public.animals for all
using (owner_id = auth_uid())
with check (owner_id = auth_uid());

create policy "logs_read_animal_owner"
on public.husbandry_logs for select using (
  exists (select 1 from public.animals a where a.id = husbandry_logs.animal_id and a.owner_id = auth_uid())
);

create policy "logs_modify_animal_owner"
on public.husbandry_logs for all using (
  exists (select 1 from public.animals a where a.id = husbandry_logs.animal_id and a.owner_id = auth_uid())
) with check (
  exists (select 1 from public.animals a where a.id = husbandry_logs.animal_id and a.owner_id = auth_uid())
);

create policy "qr_read_owner_only"
on public.qr_links for select using (
  exists (select 1 from public.animals a where a.id = qr_links.animal_id and a.owner_id = auth_uid())
);

create policy "qr_modify_owner_only"
on public.qr_links for all using (
  exists (select 1 from public.animals a where a.id = qr_links.animal_id and a.owner_id = auth_uid())
) with check (
  exists (select 1 from public.animals a where a.id = qr_links.animal_id and a.owner_id = auth_uid())
);

create policy "notifications_read_own"
on public.notifications for select using (user_id = auth_uid());

create policy "notifications_modify_own"
on public.notifications for all using (user_id = auth_uid()) with check (user_id = auth_uid());

create policy "species_read_all"
on public.species for select using (true);
