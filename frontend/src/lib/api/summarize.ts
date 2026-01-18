export async function summarize(formData: FormData) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/summarize`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        (error as Error & { status: number }).status = response.status;
        throw error;
    }

    return await response.text();
}