import { create } from "zustand";

export const useWebSocketStore = create((set, get) => ({
  ws: null as WebSocket | null,
  setWs: (ws: WebSocket) => set({ ws }),
  getWs: () => get().ws, // Função para obter a instância atual
}));
