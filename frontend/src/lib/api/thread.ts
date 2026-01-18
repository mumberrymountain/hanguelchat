interface ThreadRequest {
    fileName: string;
    fileSize: number;
    uploadDate: string;
    documentContent?: string;
}

interface ChatMessageRequest {
    role: 'user' | 'assistant';
    message: string;
    timestamp: string;
}

interface ChatMessageResponse {
    id: string;
    role: 'user' | 'assistant';
    message: string;
    timestamp: string;
}

interface ThreadResponse {
    id: string;
    fileName: string;
    fileSize: number;
    uploadDate: string;
    createdAt: string;
    chatMessages: ChatMessageResponse[];
}

export async function createThread(
    userId: number,
    threadId: string,
    data: ThreadRequest
): Promise<ThreadResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHAT_API_URL}/threads?threadId=${threadId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': userId.toString(),
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        (error as Error & { status: number }).status = response.status;
        throw error;
    }

    return await response.json();
}

export async function getUserThreads(userId: number): Promise<ThreadResponse[]> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHAT_API_URL}/threads`,
        {
            method: 'GET',
            headers: {
                'X-User-Id': userId.toString(),
            },
        }
    );

    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        (error as Error & { status: number }).status = response.status;
        throw error;
    }

    return await response.json();
}

export async function updateThread(
    userId: number,
    threadId: string,
    fileName: string
): Promise<ThreadResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHAT_API_URL}/threads/${threadId}/update?fileName=${encodeURIComponent(fileName)}`,
        {
            method: 'POST',
            headers: {
                'X-User-Id': userId.toString(),
            },
        }
    );

    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        (error as Error & { status: number }).status = response.status;
        throw error;
    }

    return await response.json();
}

export async function deleteThread(
    userId: number,
    threadId: string
): Promise<void> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHAT_API_URL}/threads/${threadId}`,
        {
            method: 'DELETE',
            headers: {
                'X-User-Id': userId.toString(),
            },
        }
    );

    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        (error as Error & { status: number }).status = response.status;
        throw error;
    }
}

export async function addChatMessage(
    userId: number,
    threadId: string,
    data: ChatMessageRequest
): Promise<ChatMessageResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHAT_API_URL}/threads/${threadId}/messages`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': userId.toString(),
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        (error as Error & { status: number }).status = response.status;
        throw error;
    }

    return await response.json();
}

