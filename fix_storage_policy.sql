-- Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do update set public = true;

-- Ensure RLS is enabled on objects
alter table storage.objects enable row level security;

-- POLICY: Allow Public Read Access
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'profile-photos' );

-- POLICY: Allow Anonymous Uploads (Required for Registration)
create policy "Allow Anonymous Uploads"
on storage.objects for insert
with check ( bucket_id = 'profile-photos' );

-- POLICY: Allow Authenticated Users to Update/Delete their own files
create policy "Allow User Updates"
on storage.objects for update
using ( bucket_id = 'profile-photos' and auth.uid() = owner );

create policy "Allow User Deletes"
on storage.objects for delete
using ( bucket_id = 'profile-photos' and auth.uid() = owner );
