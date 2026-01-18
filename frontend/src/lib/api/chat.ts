interface ChatMessageDto {
    role: string;
    message: string;
}

export interface ChatRequestData {
    threadId: string;
    message: string;
    chatHistory: ChatMessageDto[];
    apiKey: string;
}

export async function chat(data: ChatRequestData) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        (error as Error & { status: number }).status = response.status;
        throw error;
    }

    return await response.text();
}