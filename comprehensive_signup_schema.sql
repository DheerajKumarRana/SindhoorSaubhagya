-- Comprehensive SQL migration for 6-step matrimonial registration
alter table public.profiles 
add column if not exists managed_by text,
add column if not exists manglik text,
add column if not exists horoscope_url text,
add column if not exists employed_in text,
add column if not exists family_type text,
add column if not exists father_occupation text,
add column if not exists mother_occupation text,
add column if not exists brothers_total integer default 0,
add column if not exists brothers_married integer default 0,
add column if not exists sisters_total integer default 0,
add column if not exists sisters_married integer default 0,
add column if not exists native_city text,
add column if not exists family_location text,
add column if not exists is_phone_verified boolean default false;

-- Update the handle_new_user trigger to include all new metadata fields
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    first_name, 
    last_name, 
    gender,
    date_of_birth,
    height,
    marital_status,
    mother_tongue,
    religion_id,
    caste_id,
    sub_caste_id,
    managed_by,
    manglik,
    horoscope_url,
    employed_in,
    family_type,
    father_occupation,
    mother_occupation,
    brothers_total,
    brothers_married,
    sisters_total,
    sisters_married,
    native_city,
    family_location,
    phone,
    status
  )
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'gender',
    (new.raw_user_meta_data->>'dob')::date,
    (new.raw_user_meta_data->>'height')::numeric,
    new.raw_user_meta_data->>'marital_status',
    new.raw_user_meta_data->>'mother_tongue',
    (new.raw_user_meta_data->>'religion_id')::uuid,
    (new.raw_user_meta_data->>'caste_id')::uuid,
    (new.raw_user_meta_data->>'sub_caste_id')::uuid,
    new.raw_user_meta_data->>'managed_by',
    new.raw_user_meta_data->>'manglik',
    new.raw_user_meta_data->>'horoscope_url',
    new.raw_user_meta_data->>'employed_in',
    new.raw_user_meta_data->>'family_type',
    new.raw_user_meta_data->>'father_occupation',
    new.raw_user_meta_data->>'mother_occupation',
    (new.raw_user_meta_data->>'brothers_total')::integer,
    (new.raw_user_meta_data->>'brothers_married')::integer,
    (new.raw_user_meta_data->>'sisters_total')::integer,
    (new.raw_user_meta_data->>'sisters_married')::integer,
    new.raw_user_meta_data->>'native_city',
    new.raw_user_meta_data->>'family_location',
    new.raw_user_meta_data->>'phone',
    'pending'
  );
  return new;
end;
$$ language plpgsql security definer;
