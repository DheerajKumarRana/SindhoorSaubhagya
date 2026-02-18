const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use Service Role to bypass RLS
);

async function debug() {
    console.log("--- Debugging DB ---");

    // 1. Check Auth Users
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) console.error("Auth Error:", userError);
    console.log(`Found ${users?.users.length || 0} users in auth.users`);

    // 2. Check Profiles
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*');

    if (profileError) console.error("Profile Error:", profileError);
    console.log(`Found ${profiles?.length || 0} profiles in public.profiles`);

    // 3. Match them up
    if (users && users.users) {
        users.users.forEach(u => {
            const profile = profiles?.find(p => p.id === u.id);
            console.log(`\nUser: ${u.email} (ID: ${u.id})`);
            if (profile) {
                console.log(`  ✅ Profile Found:`);
                console.log(`     - Name: ${profile.first_name} ${profile.last_name}`);
                console.log(`     - Status: ${profile.status}`);
                console.log(`     - Religion: ${profile.religion_name}`);
                console.log(`     - Photo URL: ${profile.photo_url}`);
                console.log(`     - Photos: ${JSON.stringify(profile.photos)}`);
            } else {
                console.log(`  ❌ NO PROFILE FOUND`);
            }
            console.log(`  - Metadata:`, JSON.stringify(u.user_metadata, null, 2));
        });
    }
}

debug();
