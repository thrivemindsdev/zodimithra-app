import { Preferences } from "@capacitor/preferences";
import { create } from "zustand";
import type { StateStorage } from "zustand/middleware";
import { createJSONStorage, persist } from "zustand/middleware";

// Native Capacitor Preferences storage adapter for persistent mobile/web state
const capacitorStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const { value } = await Preferences.get({ key: name });
    return value ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await Preferences.set({ key: name, value });
  },
  removeItem: async (name: string): Promise<void> => {
    await Preferences.remove({ key: name });
  },
};

export interface AuthState {
  phoneNumber: string | null;
  token: string | null;
  isLoggedIn: boolean;

  // Actions
  setIsLoggedIn: (status: boolean) => void;
  clearIsLoggedIn: () => void;
  setPhoneNumber: (num: string) => void;
  clearPhoneNumber: () => void;
  setToken: (token: string) => void;
  clearToken: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial States
      phoneNumber: null,
      token: null,
      isLoggedIn: false,

      // Login Status Actions
      setIsLoggedIn: (status: boolean) => set({ isLoggedIn: status }),
      clearIsLoggedIn: () => set({ isLoggedIn: false }),

      // Phone Actions
      setPhoneNumber: (num: string) => set({ phoneNumber: num }),
      clearPhoneNumber: () => set({ phoneNumber: null }),

      // Token Actions
      setToken: (token: string) => set({ token }),
      clearToken: () => set({ token: null }),

      // Full Logout Action
      logout: () =>
        set({
          phoneNumber: null,
          token: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: "auth-storage", // Preference key in native storage
      storage: createJSONStorage(() => capacitorStorage),
      partialize: (state) => ({
        phoneNumber: state.phoneNumber,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);
