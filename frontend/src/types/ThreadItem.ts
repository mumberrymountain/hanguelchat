import ChatMessage from "./ChatMessage";

interface ThreadItem {
  id: string;
  fileName: string;
  uploadDate: string;
  fileSize: number;
  chatHistory: ChatMessage[];
  isActive?: boolean;
}

export default ThreadItem;