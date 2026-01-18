import { createThread, addChatMessage } from '@/lib/api/thread';
import ThreadItem from '@/types/ThreadItem';

interface User {
    id: number;
    username: string;
    email: string;
}

interface DoFileProcessParams {
    file: File;
    apiKey: string;
    user: User | null;
    addThread: (thread: Omit<ThreadItem, 'id'>, threadId: string) => void;
    addStreamingMessage: (threadId: string) => string;
    updateStreamingMessage: (threadId: string, messageId: string, chunk: string) => void;
    getStreamingMessage: (threadId: string, messageId: string) => string;
    setIsLoading: (loading: boolean) => void;
    onError: (message: string) => void;
}

export async function doFileProcess({
    file,
    apiKey,
    user,
    addThread,
    addStreamingMessage,
    updateStreamingMessage,
    getStreamingMessage,
    setIsLoading,
    onError,
}: DoFileProcessParams): Promise<void> {
    const threadId = crypto.randomUUID();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('threadId', threadId);
    formData.append('apiKey', apiKey);

    setIsLoading(true);

    // 생성한 threadId로 스레드 추가 (빈 chatHistory로 먼저 생성)
    addThread({
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        fileSize: file.size,
        chatHistory: [],
    }, threadId);

    // 스트리밍 메시지 추가 (빈 메시지로 시작)
    const streamingMessageId = addStreamingMessage(threadId);

    // 로그인 상태일 때 서버에 Thread 저장
    if (user) {
        try {
            await createThread(user.id, threadId, {
                fileName: file.name,
                fileSize: file.size,
                uploadDate: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Failed to save thread to server:', error);
            onError('unknownServerException');
        }
    }

    // 스트리밍 API 호출
    await processStream(
        `${process.env.NEXT_PUBLIC_CHAT_API_URL}/summarize/stream`,
        formData,
        undefined, // FormData는 자동으로 Content-Type을 설정하므로 헤더 불필요
        // onChunk: 청크가 들어올 때마다 메시지 업데이트
        (chunk) => {
            updateStreamingMessage(threadId, streamingMessageId, chunk);
        },
        // onComplete: 스트리밍 완료
        async () => {
            setIsLoading(false);

            // 로그인 상태일 때 서버에 AI 응답 저장
            if (user) {
                try {
                    const finalMessage = getStreamingMessage(threadId, streamingMessageId);
                    await addChatMessage(user.id, threadId, {
                        role: 'assistant',
                        message: finalMessage,
                        timestamp: new Date().toISOString()
                    });
                } catch (error) {
                    console.error('Failed to save message to server:', error);
                    onError('unknownServerException');
                }
            }
        },
        // onError: 에러 발생
        (error) => {
            console.error('Failed to process file:', error);
            onError('unknownServerException');
            setIsLoading(false);
        }
    );
}

/**
 * SSE 스트림을 처리하는 공통 함수
 * @param url - 요청 URL
 * @param body - 요청 body (JSON 문자열 또는 FormData)
 * @param headers - 요청 헤더 (선택적)
 * @param onChunk - 청크를 받을 때 호출되는 콜백
 * @param onComplete - 스트림이 완료될 때 호출되는 콜백
 * @param onError - 에러가 발생할 때 호출되는 콜백
 */
export async function processStream(
    url: string,
    body: string | FormData,
    headers: Record<string, string> | undefined,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (!response.ok) {
            const error = new Error(`HTTP ${response.status}`);
            (error as Error & { status: number }).status = response.status;
            throw error;
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No reader available');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                // 남은 버퍼 처리
                if (buffer.trim()) {
                    const content = buffer.replace(/^data:/gm, '').trim();
                    if (content) {
                        onChunk(content);
                    }
                }
                onComplete();
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            
            // SSE 이벤트는 \n\n으로 구분됨
            const events = buffer.split('\n\n');
            // 마지막은 아직 완성되지 않은 이벤트일 수 있으므로 버퍼에 보관
            buffer = events.pop() || '';
            
            for (const event of events) {
                if (event.trim()) {
                    // 멀티라인 data: 처리 - 각 줄의 "data:" 제거하고 줄바꿈 유지
                    const content = event
                        .split('\n')
                        .map(line => line.startsWith('data:') ? line.slice(5) : line)
                        .join('\n');
                    if (content) {
                        onChunk(content);
                    }
                }
            }
        }
    } catch (error) {
        onError(error as Error);
    }
}
