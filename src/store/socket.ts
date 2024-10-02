import { create } from "zustand";

interface webSocketStaoreProps {
  ws: WebSocket | null;
  setWs: (ws: WebSocket) => void;
  getWs: () => WebSocket | null;
  resetWs: () => void;
}
export const useWebSocketStore = create<webSocketStaoreProps>((set, get) => ({
  ws: null as WebSocket | null,
  setWs: (ws: WebSocket) => set({ ws }),
  getWs: () => get().ws, // Função para obter a instância atual
  resetWs: () => set({ ws: null }),
}));
