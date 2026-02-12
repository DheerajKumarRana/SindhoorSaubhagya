-- Fix the trigger function to match the profiles table schema
-- Specifically, remove 'mobile_number' which does not exist in the table

create or replace function public.handle_new_user()
returns trigger as $$
declare
  r_id uuid;
  c_id uuid;
begin
  -- Try to find religion and caste IDs from names if provided
  select id into r_id from public.religions where name = new.raw_user_meta_data->>'religion';
  select id into c_id from public.castes where name = new.raw_user_meta_data->>'caste';

  insert into public.profiles (
    id, 
    first_name, 
    last_name, 
    gender, 
    date_of_birth, 
    religion_id, 
    caste_id,
    status
  )
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'gender',
    (new.raw_user_meta_data->>'date_of_birth')::date,
    r_id,
    c_id,
    'pending'
  );
  return new;
end;
$$ language plpgsql security definer;
