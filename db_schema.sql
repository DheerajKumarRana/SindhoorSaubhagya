-- 1. Profiles Table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  first_name text,
  last_name text,
  gender text,
  date_of_birth date,
  religion_id uuid,
  caste_id uuid,
  sub_caste_id uuid,
  marital_status text,
  height numeric,
  weight numeric,
  complexion text,
  body_type text,
  blood_group text,
  mother_tongue text,
  education jsonb default '{}'::jsonb,
  profession jsonb default '{}'::jsonb,
  annual_income numeric,
  location jsonb default '{}'::jsonb,
  contact_info jsonb default '{}'::jsonb,
  family_details jsonb default '{}'::jsonb,
  partner_preferences jsonb default '{}'::jsonb,
  about_me text,
  horoscope jsonb default '{}'::jsonb,
  status text default 'pending'::text,
  is_verified boolean default false,
  is_premium boolean default false,
  approved_by uuid,
  approved_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (id)
);

alter table public.profiles enable row level security;

-- 2. Master Tables
create table public.religions (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table public.castes (
  id uuid default gen_random_uuid() primary key,
  religion_id uuid references public.religions(id),
  name text not null,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(religion_id, name)
);

create table public.sub_castes (
  id uuid default gen_random_uuid() primary key,
  caste_id uuid references public.castes(id),
  name text not null,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(caste_id, name)
);

-- Enable RLS on master tables
alter table public.religions enable row level security;
alter table public.castes enable row level security;
alter table public.sub_castes enable row level security;

-- Policies for master tables (Public Read)
create policy "Enable read access for all users" on public.religions for select using (true);
create policy "Enable read access for all users" on public.castes for select using (true);
create policy "Enable read access for all users" on public.sub_castes for select using (true);

-- 3. Profile Photos
create table public.profile_photos (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade,
  photo_url text not null,
  thumbnail_url text,
  is_primary boolean default false,
  is_approved boolean default false,
  approved_by uuid,
  approved_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profile_photos enable row level security;

-- 4. Triggers
-- Handle new user signup -> create profile
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
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Handle updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- 5. RLS Policies
-- Profiles: Public can view approved, Users can view own
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( status = 'approved' );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Photos: Public can view approved, Users can view own
create policy "Approved photos are viewable by everyone"
  on profile_photos for select
  using ( is_approved = true );

create policy "Users can view own photos"
  on profile_photos for select
  using ( auth.uid() = profile_id );

create policy "Users can upload own photos"
  on profile_photos for insert
  with check ( auth.uid() = profile_id );

create policy "Users can update own photos"
  on profile_photos for update
  using ( auth.uid() = profile_id );

create policy "Users can delete own photos"
  on profile_photos for delete
  using ( auth.uid() = profile_id );

-- 6. Insert Sample Data
insert into public.religions (name, display_order) values 
('Hindu', 1), ('Muslim', 2), ('Christian', 3), ('Sikh', 4), 
('Jain', 5), ('Buddhist', 6), ('Parsi', 7), ('Jewish', 8), ('Other', 9);
