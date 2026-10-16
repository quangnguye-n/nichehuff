-- Huff initial schema. The API connects with the Supabase service role.
-- Row level security is on and there are no policies, and the anon and
-- authenticated roles have no grants, so the public keys cannot touch these tables.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  timezone text not null default 'UTC',
  expo_push_token text,
  created_at timestamptz not null default now()
);

create table public.strava_tokens (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  athlete_id bigint not null unique,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create table public.runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  strava_activity_id bigint not null unique,
  distance_meters double precision not null check (distance_meters >= 0),
  started_at timestamptz not null
);

create index runs_user_started_at_idx
  on public.runs (user_id, started_at desc);

create table public.cigarette_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  logged_at timestamptz not null default now(),
  count integer not null check (count > 0)
);

create index cigarette_logs_user_logged_at_idx
  on public.cigarette_logs (user_id, logged_at desc);

create table public.daily_budgets (
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  earned_km numeric not null default 0 check (earned_km >= 0),
  allowance integer not null default 0 check (allowance >= 0),
  cigarettes_used integer not null default 0 check (cigarettes_used >= 0),
  primary key (user_id, date)
);

-- The 10 km cap is applied in the app, not in this table.
create table public.debts (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  km_owed numeric not null default 0 check (km_owed >= 0),
  updated_at timestamptz not null default now()
);

create table public.streaks (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  current_streak integer not null default 0 check (current_streak >= 0),
  last_success_date date
);

create table public.notification_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('midday_no_run', 'budget_low', 'night_debt')),
  local_date date not null,
  sent_at timestamptz not null default now(),
  unique (user_id, kind, local_date)
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

revoke all on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to supabase_auth_admin;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'strava_tokens',
    'runs',
    'cigarette_logs',
    'daily_budgets',
    'debts',
    'streaks',
    'notification_log'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format(
      'revoke all on table public.%I from public, anon, authenticated',
      table_name
    );
    execute format('grant all on table public.%I to service_role', table_name);
  end loop;
end;
$$;
