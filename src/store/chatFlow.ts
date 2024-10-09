import { create } from 'zustand';

interface FlowState {
  flow: Record<string, any>;
  usuarios: any[];
  filas: any[];
  setFlowData: (payload: { flow: Record<string, any>, usuarios: any[], filas: any[] }) => void;
  resetFlowData: () => void;
}

const useChatFlowStore = create<FlowState>((set) => ({
  flow: {},
  usuarios: [],
  filas: [],

  setFlowData: (payload) => set({
    flow: payload.flow,
    usuarios: payload.usuarios,
    filas: payload.filas,
  }),

  resetFlowData: () => set({
    flow: {},
    usuarios: [],
    filas: [],
  }),
}));

export default useChatFlowStore;