import ThreadItem from "./ThreadItem";
import ChatMessage from "./ChatMessage";

interface ThreadState {
  threads: ThreadItem[];
  isLoading: boolean;
  addThread: (file: Omit<ThreadItem, 'id'>, threadId?: string) => void;
  updateThread: (id: string, updates: Partial<ThreadItem>) => void;
  setActiveThread: (id: string) => void;
  getActiveThread: () => ThreadItem | undefined;
  addChatMessage: (fileId: string, message: Omit<ChatMessage, 'id'>) => void;
  addStreamingMessage: (threadId: string) => string;
  updateStreamingMessage: (threadId: string, messageId: string, chunk: string) => void;
  getStreamingMessage: (threadId: string, messageId: string) => string;
  removeThread: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
  loadThreads: (threads: ThreadItem[]) => void;
  clearThreads: () => void;
}

export default ThreadState;