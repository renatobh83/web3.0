import { create } from "zustand";

interface AtendimentoStore {
  drawerWidth: number;
  isClosing: boolean;
  isContactInfo: boolean;
  mobileOpen: boolean;
  setMobileOpen: (mobileOpen: boolean) => void;
  setIsClosing: (isClosing: boolean) => void;
  setIsContactInfo: (isClosing: boolean) => void;
}
export const useAtendimentoStore = create<AtendimentoStore>((set, get) => ({
  drawerWidth: 380,
  isClosing: false,
  mobileOpen: false,
  isContactInfo: false,
  setMobileOpen: () => set({ mobileOpen: !get().mobileOpen }),
  setIsClosing: (isClosing) => set({ isClosing }),
  setIsContactInfo: (isContactInfo) => set({ isContactInfo }),
}));
