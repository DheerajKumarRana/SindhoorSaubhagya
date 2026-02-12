-- Ensure RLS is enabled
alter table public.profiles enable row level security;

-- Drop existing update policy if it exists to avoid conflicts
drop policy if exists "Users can update own profile" on public.profiles;

-- Create the policy to allow users to update their own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  using ( auth.uid() = id )
  with check ( auth.uid() = id );
