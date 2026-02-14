-- Add matrimonial-specific fields to profiles table
alter table public.profiles 
add column if not exists profile_for text,
add column if not exists looking_for text,
add column if not exists caste_no_bar boolean default false,
add column if not exists diet text,
add column if not exists phone text;

-- Update the handle_new_user trigger to include these fields from metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    first_name, 
    last_name, 
    gender,
    date_of_birth,
    religion_id,
    profile_for,
    looking_for,
    caste_no_bar,
    diet,
    phone,
    status
  )
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'gender',
    case when new.raw_user_meta_data->>'dob' is not null then (new.raw_user_meta_data->>'dob')::date else null end,
    null, -- religion_id (to be updated later or linked via name to uuid)
    new.raw_user_meta_data->>'profile_for',
    new.raw_user_meta_data->>'looking_for',
    case when new.raw_user_meta_data->>'caste_no_bar' = 'true' then true else false end,
    new.raw_user_meta_data->>'diet',
    new.raw_user_meta_data->>'phone',
    'pending'
  );
  return new;
end;
$$ language plpgsql security definer;
