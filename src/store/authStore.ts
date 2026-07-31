import { Preferences } from "@capacitor/preferences";
import { create } from "zustand";
import type { StateStorage } from "zustand/middleware";
import { createJSONStorage, persist } from "zustand/middleware";

// 1. Create the native Capacitor storage adapter
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

interface AuthStore {
  phoneNumber: string | null;
  token: string | null;
  temporaryToken: string | null;
  setPhoneNumber: (num: string) => void;
  clearPhoneNumber: () => void;
  setToken: (token: string) => void;
  clearToken: () => void;
  setTemporayToken: (temporaryToken: string) => void;
  clearTemporaryToken: () => void;
  logout: () => void; // Convenient single action to reset auth state
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial States
      phoneNumber: null,
      token: null,
      temporaryToken: null,

      // Phone Actions
      setPhoneNumber: (num) => set({ phoneNumber: num }),
      clearPhoneNumber: () => set({ phoneNumber: null }),

      // Token Actions
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
      setTemporayToken: (temporaryToken) => set({ temporaryToken }),
      clearTemporaryToken: () => set({ temporaryToken: null }),

      // Logout Action
      logout: () =>
        set({
          phoneNumber: null,
          token: null,
          temporaryToken: null,
        }),
    }),
    {
      name: "auth-storage", // Key used in native Preferences
      storage: createJSONStorage(() => capacitorStorage), // Plug in Capacitor storage
      partialize: (state) => ({
        phoneNumber: state.phoneNumber,
        token: state.token,
        temporaryToken: state.temporaryToken,
      }),
    },
  ),
);
