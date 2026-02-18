-- Comprehensive SQL migration for 6-step matrimonial registration
-- Ensure all necessary columns exist in profiles table
alter table public.profiles 
add column if not exists religion_name text,
add column if not exists caste_name text,
add column if not exists sub_caste_name text,
add column if not exists city text,
add column if not exists state text,
add column if not exists country text,
add column if not exists photos text[],
add column if not exists photo_url text, -- Main profile picture
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
add column if not exists about_family text,
add column if not exists is_phone_verified boolean default false;

-- Completely replace the handle_new_user trigger to map ALL fields
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    first_name, 
    last_name, 
    email, -- Ensure email is also synced if column exists, otherwise remove
    gender,
    date_of_birth,
    height,
    weight,
    body_type,
    blood_group,
    complexion,
    marital_status,
    mother_tongue,
    religion_name, -- Text
    caste_name,    -- Text
    sub_caste_name, -- Text
    city,
    state,
    country,
    degree,
    employed_in,
    occupation,
    annual_income,
    
    managed_by,
    manglik,
    horoscope_url,
    family_type,
    father_occupation,
    mother_occupation,
    brothers_total,
    brothers_married,
    sisters_total,
    sisters_married,
    native_city,
    family_location,
    about_family,
    about_me,
    phone,
    photos,
    photo_url,
    status
  )
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email, -- standard auth email
    new.raw_user_meta_data->>'gender',
    (new.raw_user_meta_data->>'date_of_birth')::date,
    (new.raw_user_meta_data->>'height')::numeric,
    (new.raw_user_meta_data->>'weight')::numeric,
    new.raw_user_meta_data->>'body_type',
    new.raw_user_meta_data->>'blood_group',
    new.raw_user_meta_data->>'complexion',
    new.raw_user_meta_data->>'marital_status',
    new.raw_user_meta_data->>'mother_tongue',
    new.raw_user_meta_data->>'religion_name',
    new.raw_user_meta_data->>'caste_name',
    new.raw_user_meta_data->>'sub_caste_name',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'state',
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'degree',
    new.raw_user_meta_data->>'employed_in',
    new.raw_user_meta_data->>'occupation',
    (new.raw_user_meta_data->>'annual_income')::numeric,
    
    new.raw_user_meta_data->>'managed_by',
    new.raw_user_meta_data->>'manglik',
    new.raw_user_meta_data->>'horoscope_url',
    new.raw_user_meta_data->>'family_type',
    new.raw_user_meta_data->>'father_occupation',
    new.raw_user_meta_data->>'mother_occupation',
    (new.raw_user_meta_data->>'brothers_total')::integer,
    (new.raw_user_meta_data->>'brothers_married')::integer,
    (new.raw_user_meta_data->>'sisters_total')::integer,
    (new.raw_user_meta_data->>'sisters_married')::integer,
    new.raw_user_meta_data->>'native_city',
    new.raw_user_meta_data->>'family_location',
    new.raw_user_meta_data->>'about_family',
    new.raw_user_meta_data->>'about_me',
    new.raw_user_meta_data->>'phone',
    
    -- Handle photos array safely. nullif to handle empty/null
    array(select jsonb_array_elements_text( coalesce(new.raw_user_meta_data->'photos', '[]'::jsonb) )),
    
    new.raw_user_meta_data->>'photo_url',
    'pending'
  );
  return new;
end;
$$ language plpgsql security definer;
