import { create } from "zustand";

interface AtendimentoStore {
  drawerWidth: number;
  isClosing: boolean;
  mobileOpen: boolean;
  setMobileOpen: (mobileOpen: boolean) => void;
  setIsClosing: (isClosing: boolean) => void;
}
export const useAtendimentoStore = create<AtendimentoStore>((set, get) => ({
  drawerWidth: 380,
  isClosing: false,
  mobileOpen: false,
  setMobileOpen: () => set({ mobileOpen: !get().mobileOpen }),
  setIsClosing: (isClosing) => set({ isClosing }),
}));
