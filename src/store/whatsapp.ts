import { create } from "zustand";

interface State {
  whatsApps: any[];
  chatFlows: any[];
  loadChatFlows: (payload: any[]) => void;
  loadWhatsApps: (payload: any[]) => void;
  updateWhatsApps: (payload: any) => void;
  updateSession: (payload: any) => void;
  deleteWhatsApp: (id: number) => void;
  resetWhatsApps: () => void;
}

export const useWhatsappStore = create<State>((set) => ({
  whatsApps: [],
  chatFlows: [],
  loadWhatsApps: (payload) =>
    set(() => ({
      whatsApps: payload,
    })),
  loadChatFlows: (payload) => set(() => ({ chatFlows: payload })),
  updateWhatsApps: (payload) =>
    set((state) => {
      console.log(payload);
      const whatsApp = payload;
      let newWhats = [...state.whatsApps];
      const whatsAppIndex = newWhats.findIndex((s) => s.id === whatsApp.id);
      if (whatsAppIndex !== -1) {
        newWhats[whatsAppIndex] = whatsApp;
      } else {
        newWhats = [whatsApp, ...newWhats];
      }
      state.whatsApps = [...newWhats];
      const exists = state.whatsApps.some((w) => w.id === payload.id);
      const updatedWhatsApps = exists
        ? state.whatsApps.map((w) => (w.id === payload.id ? payload : w))
        : [payload, ...state.whatsApps];
      return { whatsApps: updatedWhatsApps };
    }),

  updateSession: (payload) =>
    set((state) => {
      const updatedWhatsApps = state.whatsApps.map((w) =>
        w.id === payload.id ? { ...w, ...payload } : w
      );
      return { whatsApps: updatedWhatsApps };
    }),

  deleteWhatsApp: (id) =>
    set((state) => ({
      whatsApps: state.whatsApps.filter((w) => w.id !== id),
    })),

  resetWhatsApps: () =>
    set(() => ({
      whatsApps: [],
    })),
}));
