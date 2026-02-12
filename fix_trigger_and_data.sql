-- 1. Update the Trigger Function to capture all metadata
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
    mobile_number, 
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
    new.raw_user_meta_data->>'phone',
    'pending'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Backfill existing profiles with missing data from auth.users
-- This block uses a DO block to execute procedural SQL
do $$
declare
  user_rec record;
  r_id uuid;
  c_id uuid;
begin
  for user_rec in select * from auth.users loop
    -- Resolve IDs
    select id into r_id from public.religions where name = user_rec.raw_user_meta_data->>'religion';
    select id into c_id from public.castes where name = user_rec.raw_user_meta_data->>'caste';

    -- Update profile
    update public.profiles
    set
      gender = COALESCE(gender, user_rec.raw_user_meta_data->>'gender'),
      date_of_birth = COALESCE(date_of_birth, (user_rec.raw_user_meta_data->>'date_of_birth')::date),
      religion_id = COALESCE(religion_id, r_id),
      caste_id = COALESCE(caste_id, c_id),
      first_name = COALESCE(first_name, user_rec.raw_user_meta_data->>'first_name'),
      last_name = COALESCE(last_name, user_rec.raw_user_meta_data->>'last_name')
    where id = user_rec.id;
  end loop;
end;
$$;
