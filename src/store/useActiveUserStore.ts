import { create } from "zustand";

export interface User {
  user_id: number;
  name: string;
  relation: string;
  date_of_birth: string;
  birth_time: string;
  birth_place: string;
  current_location: string | null;
  current_latitude: string | null;
  current_longitude: string | null;
  latitude: string;
  longitude: string;
  zodiac_sign: string;
  created_at: string;
  updated_at: string;
}

interface ActiveUserState {
  activeUser: User | null;
  setActiveUser: (user: User) => void;
  clearActiveUser: () => void;
}

export const useActiveUserStore = create<ActiveUserState>((set) => ({
  activeUser: null,

  setActiveUser: (user) =>
    set({
      activeUser: user,
    }),

  clearActiveUser: () =>
    set({
      activeUser: null,
    }),
}));
