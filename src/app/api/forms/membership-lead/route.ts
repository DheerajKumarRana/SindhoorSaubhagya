import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendToGoogleSheetServer } from '@/lib/googleSheet';

const membershipLeadSchema = z.object({
    motherTongue: z.string().trim().min(1, 'Mother Tongue is required'),
    name: z.string().trim().min(1, 'Name is required'),
    phone: z
        .string()
        .trim()
        .transform((value) => value.replace(/\D/g, ''))
        .refine((value) => value.length >= 10 && value.length <= 15, {
            message: 'Phone must be 10 to 15 digits',
        }),
});

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const validated = membershipLeadSchema.parse(payload);

        await sendToGoogleSheetServer({
            formType: 'membership-hero-lead',
            event: 'membership_lead_submitted',
            pagePath: '/membership',
            submittedAt: new Date().toISOString(),
            name: validated.name,
            phone: validated.phone,
            email: '',
            message: JSON.stringify({
                mother_tongue: validated.motherTongue,
                source: 'membership-hero',
            }),
            fields: {
                motherTongue: validated.motherTongue,
                phone: validated.phone,
                name: validated.name,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Lead submitted successfully.',
        });
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.issues[0]?.message || 'Invalid form data.',
                    details: error.issues,
                },
                { status: 400 }
            );
        }

        console.error('Membership lead submit failed:', error);
        return NextResponse.json(
            { success: false, error: 'Unable to submit right now. Please try again in a moment.' },
            { status: 500 }
        );
    }
}
