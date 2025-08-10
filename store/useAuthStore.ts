// app/store/useAuthStore.ts
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

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
  accessToken: string | null;

  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  getRefreshToken: () => Promise<string | null>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user: user }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  accessToken: "",

  setTokens: async (accessToken, refreshToken) => {
    set({ accessToken });
    await SecureStore.setItemAsync("refreshToken", refreshToken);
  },

  getRefreshToken: async () => {
    return await SecureStore.getItemAsync("refreshToken");
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("refreshToken");

    set({ accessToken: null, user: null });
  },
}));
