import { create } from 'zustand';
import ThreadState from '@/types/ThreadState';
import ThreadItem from '@/types/ThreadItem';

/*
기본 데이터 모델
{
  id: '26da3ad0-791d-4ffa-973d-2a6b46e7aeee',
  fileName: "test1.hwpx",
  uploadDate: "2025-01-15T10:30:00Z",
  fileSize: 2048576,
  isActive: true,
  chatHistory: [ 
    {
        id: '83b30d42-eff9-43a4-957d-b2e3c1c85a08',
        role: "user",
        message: "이 문서에 대해 질문이 있습니다.",
        timestamp: "2025-01-15T10:35:00Z"
    },
    {
        id: '8d50cd43-af6c-4a53-b647-637a31c4577f',
        role: "assistant",
        message: "네, 문서 내용에 대해 도움을 드리겠습니다.",
        timestamp: "2025-01-15T10:35:15Z"
    }
  ],
}
*/

export const useThreadStore = create<ThreadState>((set, get) => ({
  threads: [],
  isLoading: false,
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  addThread: (thread, threadId?) => set((state) => {
    const newThreadId = threadId ?? crypto.randomUUID();
    return {
      threads: [
        ...state.threads.map(t => ({ ...t, isActive: false })),
        { ...thread, id: newThreadId, isActive: true }
      ]
    };
  }),
  
  updateThread: (id, updates) => set((state) => ({
    threads: state.threads.map(thread => 
      thread.id === id ? { ...thread, ...updates } : thread
    )
  })),
  
  setActiveThread: (id) => set((state) => ({
    threads: state.threads.map(thread => ({
      ...thread,
      isActive: thread.id === id ? true : false
    }))
  })),
  
  getActiveThread: () => {
    const { threads } = get();
    return threads.find(thread => thread.isActive);
  },

  addChatMessage: (threadId, message) => set((state) => ({
    threads: state.threads.map(thread =>
      thread.id === threadId
        ? {
            ...thread,
            chatHistory: [...thread.chatHistory, { ...message, id: crypto.randomUUID() }]
          }
        : thread
    )
  })),

  // 스트리밍 메시지 추가 (빈 메시지로 시작)
  addStreamingMessage: (threadId) => {
    const messageId = crypto.randomUUID();
    set((state) => ({
      threads: state.threads.map(thread =>
        thread.id === threadId
          ? {
              ...thread,
              chatHistory: [...thread.chatHistory, { 
                id: messageId,
                role: 'assistant',
                message: '',
                timestamp: new Date().toISOString()
              }]
            }
          : thread
      )
    }));
    return messageId;
  },

  // 스트리밍 메시지 업데이트 (청크 추가)
  updateStreamingMessage: (threadId, messageId, chunk) => set((state) => ({
    threads: state.threads.map(thread =>
      thread.id === threadId
        ? {
            ...thread,
            chatHistory: thread.chatHistory.map(msg =>
              msg.id === messageId
                ? { ...msg, message: msg.message + chunk }
                : msg
            )
          }
        : thread
    )
  })),

  // 스트리밍 메시지의 최종 내용 가져오기
  getStreamingMessage: (threadId, messageId) => {
    const { threads } = get();
    const thread = threads.find(t => t.id === threadId);
    return thread?.chatHistory.find(msg => msg.id === messageId)?.message || '';
  },

  removeThread: (id) => set((state) => ({
    threads: state.threads.filter(thread => thread.id !== id)
  })),

  loadThreads: (threads: ThreadItem[]) => set({ threads: threads.length > 0 ? threads.map((t, index) => ({ ...t, isActive: index === 0 })) : [] }),

  clearThreads: () => set({ threads: [] })
}));