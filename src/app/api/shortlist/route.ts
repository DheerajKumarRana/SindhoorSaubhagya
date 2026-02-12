import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const addToShortlistSchema = z.object({
    profileId: z.string().uuid(),
    notes: z.string().optional()
});

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('shortlist')
            .select(`
        id,
        updated_at,
        notes,
        profiles!shortlisted_profile_id (
            id, first_name, last_name, gender, date_of_birth, 
            religion_id, religions(name),
            caste_id, castes(name),
            profile_photos(photo_url, is_primary)
        )
      `)
            .eq('user_id', session.user.id) // Assuming user_id in shortlist maps to auth.uid in RLS or trigger
        // Wait, in schema.sql: user_id REFERENCES profiles(id).
        // But typically auth.uid() handles auth. 
        // We need to fetch the PROFILE ID for the current user first if the foreign key is profiles(id).
        // However, usually we link shortlist to user's PROFILE not auth UAID directly if we want relational integrity with profiles table.
        // Let's check schema: user_id UUID REFERENCES public.profiles(id).
        // So we need to first get the profile ID for the current Auth User.

        // OPTIMIZATION: We can do a subquery or join if Supabase supports it, 
        // OR just fetch profile ID first.

        // Let's resolve Profile ID first.

        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

        if (!profile) {
            return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
        }

        const { data: shorlistData, error: shortlistError } = await supabase
            .from('shortlist')
            .select(`
            id,
            updated_at,
            notes,
            shortlisted_profile:shortlisted_profile_id (
                id, first_name, last_name, gender, date_of_birth, 
                religions(name),
                castes(name),
                profile_photos(photo_url, is_primary)
            )
        `) // Adjusted syntax for nested join with alias if needed, or simple FK join
            // Correct Supabase syntax: table!fk (columns) or table (columns) if unique FK.
            .eq('user_id', profile.id);

        if (shortlistError) {
            throw shortlistError;
        }

        return NextResponse.json({
            success: true,
            data: shorlistData
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = addToShortlistSchema.parse(body);

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

        const { data, error } = await supabase
            .from('shortlist')
            .insert({
                user_id: profile.id,
                shortlisted_profile_id: validatedData.profileId,
                notes: validatedData.notes
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Unique violation
                return NextResponse.json({ success: false, error: 'Already shortlisted' }, { status: 400 });
            }
            throw error;
        }

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
