const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Note: For admin creation without email confirmation, strictly we might need service_role_key 
// but we will try with anon key and standard signup, then user manually runs SQL to promote.
// Actually, to insert into admin_users, we need RLS bypass or existing admin.
// Strategy: This script creates the Auth User. The SQL Trigger (or manual SQL) promotes them.

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = 'admin@sindoor.com';
const ADMIN_PASSWORD = 'secure_admin_password_123'; // Change this!

async function createSupremeAdmin() {
    console.log(`Creating Supreme Admin: ${ADMIN_EMAIL}`);

    // 1. Sign Up
    const { data, error } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        options: {
            data: {
                first_name: 'Supreme',
                last_name: 'Admin',
            }
        }
    });

    if (error) {
        console.error('Error creating auth user:', error.message);
        return;
    }

    const userId = data.user?.id;

    if (!userId) {
        console.error('User created but no ID returned (Encryption/Confirmation pending?)');
        return;
    }

    console.log('Auth User Created. ID:', userId);
    console.log('\n--- IMPORTANT ---');
    console.log('Run the following SQL in your Supabase SQL Editor to promote this user:');
    console.log(`
    INSERT INTO public.admin_users (user_id, email, role, is_active)
    VALUES ('${userId}', '${ADMIN_EMAIL}', 'super_admin', true);
  `);
    console.log('-----------------');
}

createSupremeAdmin();
