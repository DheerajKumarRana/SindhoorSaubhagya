-- Add photo_url column to profiles table to store the main avatar URL
alter table public.profiles 
add column if not exists photo_url text;

-- Optional: If you want to sync it with existing data or profile_photos table, this is where you would do it.
-- For now, just adding the column is enough to fix the error.
