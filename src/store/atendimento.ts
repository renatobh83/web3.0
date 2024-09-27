import { create } from "zustand";

interface AtendimentoStore {
  drawerWidth: number;
  isClosing: boolean;
  isContactInfo: boolean;
  mobileOpen: boolean;
  modalAgendamento: boolean;
  setMobileOpen: (mobileOpen: boolean) => void;
  setModalAgendamento: () => void;
  setIsClosing: (isClosing: boolean) => void;
  setIsContactInfo: (isClosing: boolean) => void;
}
export const useAtendimentoStore = create<AtendimentoStore>((set, get) => ({
  drawerWidth: 380,
  isClosing: false,
  modalAgendamento: false,
  mobileOpen: false,
  isContactInfo: false,
  setMobileOpen: () => set({ mobileOpen: !get().mobileOpen }),
  setModalAgendamento: () => set({ modalAgendamento: !get().modalAgendamento }),
  setIsClosing: (isClosing) => set({ isClosing }),
  setIsContactInfo: (isContactInfo) => set({ isContactInfo }),
}));
