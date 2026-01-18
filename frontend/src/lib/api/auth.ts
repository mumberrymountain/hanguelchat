interface SignUpRequest {
    username: string;
    email: string;
    password: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface AuthResponse {
    id: number;
    username: string;
    email: string;
    token?: string;
}

export async function signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/auth/signup`, {
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

    return await response.json();
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/auth/login`, {
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

    return await response.json();
}

