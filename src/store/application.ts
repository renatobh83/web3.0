import { create } from "zustand";

interface Campanha {
  id: number;
  nome: string;
  [key: string]: any;
}

interface ApplicationStore {

  profileUser: string | null;
  campanhas: any[]
  setCampanhas: (campanha: []) => void
  setProfileUser: (user: string) => void;
  updateCampanha: (id: number, dadosAtualizados: Partial<Campanha>) => void;
  themeMode: "light" | "dark" | "system";
  toggleThemeMode: () => void;
}

export const useApplicationStore = create<ApplicationStore>((set) => ({
  profileUser: null,
  campanhas: [],
  setCampanhas: (campanha: []) => set({campanhas: campanha}) ,
  setProfileUser: (user: string) => set({ profileUser: user }),
  updateCampanha: (id, dadosAtualizados) =>
    set((state) => ({
      campanhas: state.campanhas.map((camp) =>
        camp.id === id ? { ...camp, ...dadosAtualizados } : camp
      ),
    })),
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
