-- 1. Fix RLS on Master Tables (Religions, Castes, Sub-castes)
-- Enable RLS (just in case it's not enabled)
alter table public.religions enable row level security;
alter table public.castes enable row level security;
alter table public.sub_castes enable row level security;

-- Add policies to allow everyone (public) to READ this data
-- (Since these are reference tables for dropdowns, everyone needs to see them)
create policy "Enable read access for all users" on public.religions for select using (true);
create policy "Enable read access for all users" on public.castes for select using (true);
create policy "Enable read access for all users" on public.sub_castes for select using (true);

-- 2. Fix Function Search Paths (Security Best Practice)
-- Update handle_new_user to set search_path
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, status)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    'pending'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Update update_updated_at_column to set search_path
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;
