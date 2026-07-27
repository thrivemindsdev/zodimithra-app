// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface AuthStore {
//   phoneNumber: string | null;
//   token: string | null;
//   hasOnboarded: boolean;
//   setPhoneNumber: (num: string) => void;
//   clearPhoneNumber: () => void;
//   setToken: (token: string) => void;
//   clearToken: () => void;
//   setOnboarded: (status: boolean) => void;
//   clearOnboarded: () => void;
// }

// export const useAuthStore = create<AuthStore>()(
//   persist(
//     (set) => ({
//       // Initial States
//       phoneNumber: null,
//       token: null,
//       hasOnboarded: false,

//       // Phone Actions
//       setPhoneNumber: (num) => set({ phoneNumber: num }),
//       clearPhoneNumber: () => set({ phoneNumber: null }),

//       // Token Actions
//       setToken: (token) => set({ token }),
//       clearToken: () => set({ token: null }),

//       // Onboarding Actions
//       setOnboarded: (status) => set({ hasOnboarded: status }),
//       clearOnboarded: () => set({ hasOnboarded: false }),
//     }),
//     {
//       name: "auth-storage",
//       // Whitelist only the data properties we want to persist in local storage
//       partialize: (state) => ({
//         phoneNumber: state.phoneNumber,
//         token: state.token,
//         hasOnboarded: state.hasOnboarded,
//       }),
//     },
//   ),
// );

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";
import { Preferences } from "@capacitor/preferences";

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
  hasOnboarded: boolean;
  setPhoneNumber: (num: string) => void;
  clearPhoneNumber: () => void;
  setToken: (token: string) => void;
  clearToken: () => void;
  setOnboarded: (status: boolean) => void;
  clearOnboarded: () => void;
  logout: () => void; // Convenient single action to reset auth state
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial States
      phoneNumber: null,
      token: null,
      hasOnboarded: false,

      // Phone Actions
      setPhoneNumber: (num) => set({ phoneNumber: num }),
      clearPhoneNumber: () => set({ phoneNumber: null }),

      // Token Actions
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),

      // Onboarding Actions
      setOnboarded: (status) => set({ hasOnboarded: status }),
      clearOnboarded: () => set({ hasOnboarded: false }),

      // Logout Action
      logout: () =>
        set({
          phoneNumber: null,
          token: null,
          hasOnboarded: false,
        }),
    }),
    {
      name: "auth-storage", // Key used in native Preferences
      storage: createJSONStorage(() => capacitorStorage), // Plug in Capacitor storage
      partialize: (state) => ({
        phoneNumber: state.phoneNumber,
        token: state.token,
        hasOnboarded: state.hasOnboarded,
      }),
    },
  ),
);
