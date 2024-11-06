import { create } from "zustand";

interface ApplicationStore {
  profileUser: string | null;
  setProfileUser: (user: string) => void;
  themeMode: "light" | "dark" | "system";
  toggleThemeMode: () => void;
}

export const useApplicationStore = create<ApplicationStore>((set) => ({
  profileUser: null,
  setProfileUser: (user: string) => set({ profileUser: user }),
  themeMode:
    (localStorage.getItem("themeMode") as "light" | "dark" | "system") ||
    "system", // Carrega do localStorage ou usa "light" por padrão
  toggleThemeMode: () => {
    set((state) => {
      const newMode = state.themeMode === "dark" ? "light" : "dark";
      localStorage.setItem("themeMode", newMode);
      return { themeMode: newMode };
    });
  },
}));
