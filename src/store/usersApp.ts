import { create } from "zustand";

interface UsersApp {
  usersApp: any[];
  setUsersApp: (data: any[]) => void;
}

export const useUsersAppStore = create<UsersApp>((set) => ({
  usersApp: [],
  setUsersApp: (payload) => set(() => ({ usersApp: payload })),
}));
