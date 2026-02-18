const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debug() {
    console.log("--- Debugging DB ---");
    try {
        const { data: { users }, error } = await supabase.auth.admin.listUsers();
        if (error) throw error;
        console.log(`Auth Users: ${users.length}`);

        const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
        if (pError) throw pError;
        console.log(`Profiles: ${profiles.length}`);

        users.forEach(u => {
            const p = profiles.find(pr => pr.id === u.id);
            console.log(`${u.email} -> Profile: ${p ? '✅ Found' : '❌ MISSING'}`);
        });
    } catch (e) {
        console.error(e);
    }
}

debug();
