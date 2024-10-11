import { create } from "zustand";

interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
}
interface NodeData {
  label?: string;
  [key: string]: any;
}

interface Node {
  id: string;
  data: NodeData;
}
// Definindo o store com Zustand
interface EdgeStore {
  edges: Edge[];
  nodes: Node[];
  setEdgesStore: (edges: Edge[]) => void;
  setNodesStore: (nodes: Node[]) => void;
  getEdgesByNodeId: (nodeId: string) => { asSource: Edge[]; asTarget: Edge[] };
  getLabelByTarget: (targetId: string) => string | undefined;
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
  nodes: [],
  // Função para setar as edges no estado
  setEdgesStore: (edges: Edge[]) => set({ edges }),
  setNodesStore: (nodes) => set({ nodes }),
  // Função para buscar edges filtradas por nodeId
  getEdgesByNodeId: (nodeId: string) => {
    const edges = get().edges;

    // Filtrando as edges onde o nodeId é source ou target
    const asSource = edges.filter((edge) => edge.source === nodeId);
    const asTarget = edges.filter((edge) => edge.target === nodeId);

    return { asSource, asTarget };
  },
  getLabelByTarget: (targetId: string) => {
    // Procura pela edge que tem o targetId fornecido
    const targetEdge = get().edges.find((edge) => edge.target === targetId);
    // Se a edge foi encontrada, procura o node associado ao targetId
    if (targetEdge) {
      const targetNode = get().nodes.find((node) => node.id === targetId);

      // Retorna a label do node se ela existir
      return targetNode?.data?.label;
    }

    // Retorna undefined se não encontrar
    return undefined;
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
