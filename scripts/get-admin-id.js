const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getAdminId() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@sindoor.com',
        password: 'secure_admin_password_123',
    });

    if (error) {
        console.error('Login failed:', error.message);
        return;
    }

    console.log('Admin ID:', data.user.id);
}

getAdminId();
