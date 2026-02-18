-- 1. Create the Trigger (It was missing!)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. (Optional) Cheat to backfill existing users who missed the trigger
-- We can't easily run the trigger retrospectively, so we will do a simplified insert for them.
-- Or better, we just rely on new signups working.

-- 3. Check if Admin needs a profile?
-- Ideally yes. But for now, let's focus on new users.
