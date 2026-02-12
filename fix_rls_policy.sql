-- Allow users to view their own profile regardless of status (pending/approved)
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );
