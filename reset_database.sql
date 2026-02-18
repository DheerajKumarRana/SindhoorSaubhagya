-- Clean up profiles (public data)
DELETE FROM public.profiles;

-- Clean up auth users (internal Supabase auth - requires superadmin/service_role in SQL editor)
-- WARNING: This deletes ALL users from the authentication system.
DELETE FROM auth.users;
