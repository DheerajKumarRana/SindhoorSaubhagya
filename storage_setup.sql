-- Create the storage bucket for profile photos if it doesn't exist
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

-- Set up security policies for the 'profile-photos' bucket

-- Allow public read access to all files in the bucket
create policy "Give public access to profile-photos"
on storage.objects for select
using ( bucket_id = 'profile-photos' );

-- Allow authenticated users to upload files to the bucket
create policy "Allow authenticated uploads"
on storage.objects for insert
with check (
  bucket_id = 'profile-photos'
  and auth.role() = 'authenticated'
);

-- Allow users to update their own files (optional, simpler to just allow insert for now or check owner)
-- For simplicity in MVP, we might rely on unique filenames or user-prefixed paths.
-- Let's add an update policy just in case
create policy "Allow users to update own files"
on storage.objects for update
using ( bucket_id = 'profile-photos' and auth.uid() = owner )
with check ( bucket_id = 'profile-photos' and auth.uid() = owner );

-- Allow users to delete their own files
create policy "Allow users to delete own files"
on storage.objects for delete
using ( bucket_id = 'profile-photos' and auth.uid() = owner );
