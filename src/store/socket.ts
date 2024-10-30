import type { Socket } from "socket.io-client";
import { create } from "zustand";

interface webSocketStaoreProps {
  ws: Socket | null;
  setWs: (ws: Socket) => void;
  getWs: () => Socket | null;
  resetWs: () => void;
}
export const useWebSocketStore = create<webSocketStaoreProps>((set, get) => ({
  ws: null as Socket | null,
  setWs: (ws: Socket) => set({ ws }),
  getWs: () => get().ws, // Função para obter a instância atual
  resetWs: () => set({ ws: null }),
}));
