import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const profileIdToRemove = params.id;
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Get Current User Profile ID
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

        if (!profile) {
            return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
        }

        // Delete based on composite key (user_id + shortlisted_profile_id)
        // Matches the schema constraint
        const { error } = await supabase
            .from('shortlist')
            .delete()
            .eq('user_id', profile.id)
            .eq('shortlisted_profile_id', profileIdToRemove);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Removed from shortlist'
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
