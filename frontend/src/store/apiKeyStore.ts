import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApiKeyState {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set) => ({
      apiKey: '',
      setApiKey: (key: string) => set({ apiKey: key }),
    }),
    {
      name: 'api-key-storage', // localStorage 키 이름
    }
  )
);

