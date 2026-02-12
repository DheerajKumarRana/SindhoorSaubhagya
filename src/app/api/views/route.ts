import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const viewProfileSchema = z.object({
    viewedProfileId: z.string().uuid()
});

export async function POST(request: Request) {
    // Record a view
    try {
        const body = await request.json();
        const { viewedProfileId } = viewProfileSchema.parse(body);

        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', session.user.id).single();
        if (!profile) return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });

        // Don't record self-views
        if (profile.id === viewedProfileId) {
            return NextResponse.json({ success: true, ignored: true });
        }

        // Insert view (Ignore duplicates if needed, or update timestamp if schema supports it)
        // Schema has UNIQUE(viewer_id, viewed_id, viewed_at) but viewed_at includes time.
        // Usually we want to dedupe views within a timeframe or just insert.
        // For now, let's insert functionality.

        const { error } = await supabase
            .from('profile_views')
            .insert({
                viewer_id: profile.id,
                viewed_id: viewedProfileId
            });

        if (error) {
            console.error("View Error", error);
            // Ignore duplicate errors silently if constraint exists
            // But schema uses timestamps so uniqueness is unlikely to trigger unless rapid fire
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    // Get profiles who viewed ME
    // Query param ?type=by_me to get profiles I viewed
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'by_me' or default 'who_viewed_me'

        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', session.user.id).single();
        if (!profile) return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });

        let query;

        if (type === 'by_me') {
            // Profiles I viewed
            query = supabase
                .from('profile_views')
                .select(`
                    viewed_at,
                    viewed_profile:viewed_id (
                        id, first_name, last_name, gender, age,
                        profile_photos(photo_url, is_primary)
                    )
                `) // Nested select requires correct FK relation name, Supabase infers it usually
                .eq('viewer_id', profile.id)
                .order('viewed_at', { ascending: false });
        } else {
            // Who viewed me
            query = supabase
                .from('profile_views')
                .select(`
                    viewed_at,
                    viewer_profile:viewer_id (
                        id, first_name, last_name, gender,
                        profile_photos(photo_url, is_primary)
                    )
                `)
                .eq('viewed_id', profile.id)
                .order('viewed_at', { ascending: false });
        }

        const { data, error } = await query;
        if (error) throw error;

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
