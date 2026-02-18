-- 0. Clean cleanup to avoid schema conflicts
DROP TABLE IF EXISTS public.master_castes CASCADE;
DROP TABLE IF EXISTS public.master_religions CASCADE;
DROP TABLE IF EXISTS public.profile_photos CASCADE;

-- 1. Create Master Tables
CREATE TABLE public.master_religions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE public.master_castes (
    id SERIAL PRIMARY KEY,
    religion_id INTEGER REFERENCES public.master_religions(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

-- 2. Create Profile Photos Table
CREATE TABLE public.profile_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS for Masters (Public Read, Admin Write)
ALTER TABLE public.master_religions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_castes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read religions" ON public.master_religions FOR SELECT USING (true);
CREATE POLICY "Public read castes" ON public.master_castes FOR SELECT USING (true);

CREATE POLICY "Admins manage religions" ON public.master_religions FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = TRUE)
);

CREATE POLICY "Admins manage castes" ON public.master_castes FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = TRUE)
);

-- 4. RLS for Photos (Owner View, Admin View/Edit)
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own photos" ON public.profile_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own photos" ON public.profile_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own photos" ON public.profile_photos FOR DELETE USING (auth.uid() = user_id);

-- (Admin policies already in admin_schema, but ensuring 'is_approved' column exists is key)
-- Note: admin_schema.sql added policy "Admins can view and update all photos"

-- 5. Seed Initial Data
INSERT INTO public.master_religions (name) VALUES 
('Hindu'), ('Muslim'), ('Christian'), ('Sikh'), ('Jain'), ('Buddhist')
ON CONFLICT (name) DO NOTHING;
