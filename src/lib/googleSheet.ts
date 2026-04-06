const DEFAULT_GOOGLE_SHEET_WEBHOOK_URL =
    'https://script.google.com/macros/s/AKfycbz0GynOM8OnThBLPXIhBmcwul8ghzX-toB4nQW5BJofPvCNaZIctto2hgxa3o7YezvJ/exec';

export const getGoogleSheetWebhookUrl = () =>
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL || DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;

export const sendToGoogleSheet = async (payload: Record<string, unknown>) => {
    const webhookUrl = getGoogleSheetWebhookUrl();
    if (!webhookUrl) return;

    const body = JSON.stringify(payload);

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([body], { type: 'text/plain' });
        const queued = navigator.sendBeacon(webhookUrl, blob);
        if (queued) return;
    }

    await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: {
            'Content-Type': 'text/plain',
        },
        body,
    });
};

export const sendToGoogleSheetServer = async (payload: Record<string, unknown>) => {
    const webhookUrl = getGoogleSheetWebhookUrl();
    if (!webhookUrl) return;

    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Google Sheet webhook failed with status ${response.status}`);
    }
};
