-- Final verification and column addition for 8-step registration
alter table public.profiles 
add column if not exists phone text,
add column if not exists religion_name text,
add column if not exists caste_name text,
add column if not exists sub_caste_name text,
add column if not exists degree text,
add column if not exists occupation text,
add column if not exists country text default 'India',
add column if not exists state text,
add column if not exists city text,
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
add column if not exists profile_for text,
add column if not exists looking_for text,
add column if not exists annual_income numeric,
add column if not exists weight numeric,
add column if not exists body_type text,
add column if not exists complexion text,
add column if not exists blood_group text,
add column if not exists photos text[],
add column if not exists about_me text;

-- Update the handle_new_user trigger to map metadata correctly
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
    weight,
    body_type,
    complexion,
    blood_group,
    marital_status,
    mother_tongue,
    religion_name,
    caste_name,
    sub_caste_name,
    managed_by,
    manglik,
    employed_in,
    degree,
    occupation,
    annual_income,
    country,
    state,
    city,
    family_type,
    father_occupation,
    mother_occupation,
    brothers_total,
    brothers_married,
    sisters_total,
    sisters_married,
    native_city,
    family_location,
    profile_for,
    looking_for,
    about_me,
    phone,
    horoscope_url,
    photos,
    status
  )
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'gender',
    case 
      when new.raw_user_meta_data->>'date_of_birth' is not null 
      then (new.raw_user_meta_data->>'date_of_birth')::date 
      else null 
    end,
    (new.raw_user_meta_data->>'height')::numeric,
    (new.raw_user_meta_data->>'weight')::numeric,
    new.raw_user_meta_data->>'body_type',
    new.raw_user_meta_data->>'complexion',
    new.raw_user_meta_data->>'blood_group',
    new.raw_user_meta_data->>'marital_status',
    new.raw_user_meta_data->>'mother_tongue',
    new.raw_user_meta_data->>'religion_name',
    new.raw_user_meta_data->>'caste_name',
    new.raw_user_meta_data->>'sub_caste_name',
    new.raw_user_meta_data->>'managed_by',
    new.raw_user_meta_data->>'manglik',
    new.raw_user_meta_data->>'employed_in',
    new.raw_user_meta_data->>'degree',
    new.raw_user_meta_data->>'occupation',
    (new.raw_user_meta_data->>'annual_income')::numeric,
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'state',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'family_type',
    new.raw_user_meta_data->>'father_occupation',
    new.raw_user_meta_data->>'mother_occupation',
    (new.raw_user_meta_data->>'brothers_total')::integer,
    (new.raw_user_meta_data->>'brothers_married')::integer,
    (new.raw_user_meta_data->>'sisters_total')::integer,
    (new.raw_user_meta_data->>'sisters_married')::integer,
    new.raw_user_meta_data->>'native_city',
    new.raw_user_meta_data->>'family_location',
    new.raw_user_meta_data->>'profile_for',
    new.raw_user_meta_data->>'looking_for',
    new.raw_user_meta_data->>'about_me',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'horoscope_file',
    case
        when new.raw_user_meta_data->>'photos' is not null
        then array(select jsonb_array_elements_text(new.raw_user_meta_data->'photos'))
        else null
    end,
    'pending',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Add email column if not exists
alter table public.profiles add column if not exists email text unique;
