-- MATRIMONIAL APP SCHEMA

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUM TYPES
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
CREATE TYPE marital_status_enum AS ENUM ('never_married', 'divorced', 'widowed', 'separated');
CREATE TYPE complexion_enum AS ENUM ('very_fair', 'fair', 'wheatish', 'dark');
CREATE TYPE body_type_enum AS ENUM ('slim', 'athletic', 'average', 'heavy');
CREATE TYPE blood_group_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE profile_status_enum AS ENUM ('pending', 'approved', 'rejected', 'deactivated');
CREATE TYPE admin_role_enum AS ENUM ('super_admin', 'admin', 'moderator');
CREATE TYPE notification_type_enum AS ENUM ('profile_view', 'shortlist', 'profile_approved', 'message', 'system');

-- 2. MASTER DATA TABLES

-- Religions
CREATE TABLE public.religions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Castes
CREATE TABLE public.castes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    religion_id UUID NOT NULL REFERENCES public.religions(id),
    name VARCHAR(100) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(religion_id, name)
);

-- Sub-Castes
CREATE TABLE public.sub_castes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caste_id UUID NOT NULL REFERENCES public.castes(id),
    name VARCHAR(100) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(caste_id, name)
);

-- Seed Religions
INSERT INTO public.religions (name, display_order) VALUES 
    ('Hindu', 1), ('Muslim', 2), ('Christian', 3), ('Sikh', 4), 
    ('Jain', 5), ('Buddhist', 6), ('Parsi', 7), ('Jewish', 8), ('Other', 9);

-- 3. USERS & PROFILES

-- Admin Users
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role admin_role_enum DEFAULT 'moderator',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Basic Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender gender_enum, -- Made nullable for initial creation if needed, or enforce strict
    date_of_birth DATE,

    -- Religious Information
    religion_id UUID REFERENCES public.religions(id),
    caste_id UUID REFERENCES public.castes(id),
    sub_caste_id UUID REFERENCES public.sub_castes(id),

    -- Physical Attributes
    marital_status marital_status_enum,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    complexion complexion_enum,
    body_type body_type_enum,
    blood_group blood_group_enum,
    mother_tongue VARCHAR(100),

    -- Education & Career
    education JSONB DEFAULT '{}',
    profession JSONB DEFAULT '{}',
    annual_income DECIMAL(12,2),

    -- Location
    location JSONB DEFAULT '{}',

    -- Contact Information
    contact_info JSONB DEFAULT '{}',

    -- Family Details
    family_details JSONB DEFAULT '{}',

    -- Partner Preferences
    partner_preferences JSONB DEFAULT '{}',

    -- About & Horoscope
    about_me TEXT,
    horoscope JSONB DEFAULT '{}',

    -- Status & Verification
    status profile_status_enum DEFAULT 'pending',
    is_verified BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,

    -- Metadata
    approved_by UUID REFERENCES public.admin_users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_age CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '18 years')
);

-- Profile Photos
CREATE TABLE public.profile_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES public.admin_users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SOCIAL FEATURES

-- Shortlist
CREATE TABLE public.shortlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    shortlisted_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, shortlisted_profile_id),
    CONSTRAINT no_self_shortlist CHECK (user_id != shortlisted_profile_id)
);

-- Profile Views
CREATE TABLE public.profile_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    viewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    viewed_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(viewer_id, viewed_id, viewed_at)
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type notification_type_enum NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. INDEXES
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_profiles_religion ON public.profiles(religion_id);
CREATE INDEX idx_profiles_caste ON public.profiles(caste_id);
CREATE INDEX idx_profiles_gender ON public.profiles(gender);
CREATE INDEX idx_profiles_location ON public.profiles USING GIN(location);
CREATE INDEX idx_photos_profile_id ON public.profile_photos(profile_id);
CREATE INDEX idx_shortlist_user_id ON public.shortlist(user_id);
CREATE INDEX idx_profile_views_viewer ON public.profile_views(viewer_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);

-- 6. RLS POLICIES

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shortlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "View approved profiles" ON public.profiles
    FOR SELECT
    USING (
        status = 'approved' 
        OR auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "Update own profile" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Insert own profile" ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Profile Photos Policies
CREATE POLICY "View approved photos" ON public.profile_photos
    FOR SELECT
    USING (
        is_approved = TRUE 
        OR EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = profile_id AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Manage own photos" ON public.profile_photos
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = profile_id AND p.user_id = auth.uid()
        )
    );

-- Shortlist Policies
CREATE POLICY "View own shortlist" ON public.shortlist
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = shortlist.user_id AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Manage own shortlist" ON public.shortlist
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = shortlist.user_id AND p.user_id = auth.uid()
        )
    );

-- Notifications Policies
CREATE POLICY "View own notifications" ON public.notifications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = notifications.user_id AND p.user_id = auth.uid()
        )
    );

-- 7. TRIGGERS (Optional but recommended)
-- Auto-create profile on user signup (basic placeholder)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, gender, date_of_birth)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    (new.raw_user_meta_data->>'gender')::gender_enum,
    (new.raw_user_meta_data->>'date_of_birth')::date
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
