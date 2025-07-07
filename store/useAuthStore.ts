// app/store/useAuthStore.ts
import { create } from "zustand";

type User = {
  accessToken?: string;
  username?: string;
  message?: string;
  id: string;
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user: user }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  logout: () => set({ user: null }),
}));
