import { create } from "zustand";

interface Edge {
  id: string;
  source: string;
  target: string;
}
// Definindo o store com Zustand
interface EdgeStore {
  edges: Edge[];
  setEdgesStore: (edges: Edge[]) => void;
  getEdgesByNodeId: (nodeId: string) => { asSource: Edge[]; asTarget: Edge[] };
}

interface FlowState {
  flow: Record<string, any>;
  usuarios: any[];
  filas: any[];
  setFlowData: (payload: {
    flow: Record<string, any>;
    usuarios: any[];
    filas: any[];
  }) => void;
  resetFlowData: () => void;
}
interface CombinedState extends FlowState, EdgeStore {}
const useChatFlowStore = create<CombinedState>((set, get) => ({
  flow: {},
  usuarios: [],
  filas: [],
  edges: [],
  // Função para setar as edges no estado
  setEdgesStore: (edges: Edge[]) => set({ edges }),
  // Função para buscar edges filtradas por nodeId
  getEdgesByNodeId: (nodeId: string) => {
    const edges = get().edges;

    // Filtrando as edges onde o nodeId é source ou target
    const asSource = edges.filter((edge) => edge.source === nodeId);
    const asTarget = edges.filter((edge) => edge.target === nodeId);

    return { asSource, asTarget };
  },
  setFlowData: (payload) =>
    set({
      flow: payload.flow,
      usuarios: payload.usuarios,
      filas: payload.filas,
    }),

  resetFlowData: () =>
    set({
      flow: {},
      usuarios: [],
      filas: [],
    }),
}));

export default useChatFlowStore;
