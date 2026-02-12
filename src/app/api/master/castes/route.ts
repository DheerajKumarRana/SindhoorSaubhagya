import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const religionId = searchParams.get('religionId');

        const supabase = await createClient();

        let query = supabase
            .from('castes')
            .select('id, name, religion_id')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (religionId) {
            query = query.eq('religion_id', religionId);
        }

        const { data, error } = await query;

        if (error) {
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
