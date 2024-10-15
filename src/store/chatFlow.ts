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
  position: { x: number; y: number }; // Adicionando posição ao Node
  selected?: boolean; // Adicionei selected aqui
}
// Definindo o store com Zustand
interface EdgeStore {
  edges: Edge[];
  nodes: Node[];
  selectedNode: Node | undefined;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodes: (nodes: Node[]) => void;
  updateEdges: (nodes: Edge[]) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (node: Node | undefined) => void;
  getEdgesByNodeId: (nodeId: string) => { asSource: Edge[]; asTarget: Edge[] };
  getLabelByTarget: (targetId: string) => string | undefined;
  reconnectEdge: (oldEdge: Edge, newEdge: Edge) => void;
  updatePositionArr: (nodeId: string, newPosition: any[], type: string) => void;
  updateNodeData: (nodeId: string, newEntry: any, type: string) => void;
  removeEdge: (edgeId: string) => void;
  removeSelectedNodesAndEdges: () => void; // Função que iremos criar
  addNode: (node: Node) => void;
  updateNodePosition: (
    nodeId: string,
    position: { x: number; y: number }
  ) => void;
  addInteracaoToNode: (
    nodeId: string,
    interaction: { id: string; type: string }
  ) => void;
  updateNode: (updatedNode: Node) => void;
}
interface FlowState {
  flow: Record<string, any>;
  usuarios: any[];
  filas: any[];
  setFlowData: (payload: {
    flow: Record<string, any>;
    usuarios: any[];
    filas: any[];
    nodes: Node[];
    edges: Edge[];
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
  selectedNode: undefined,
  updateNodes: (updatedNodes) =>
    set(() => ({
      nodes: updatedNodes,
    })),
  updateEdges: (edges: Edge[]) => {
    set({ edges });
  },
  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    })),
  setSelectedNode: (nodeId) =>
    set(() => ({
      selectedNode: nodeId,
    })),
  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },
  updateNode: (updatedNode) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === updatedNode.id ? updatedNode : node
      ),
    }));
    // console.log(get().nodes);
  },
  updatePositionArr: (nodeId, newEntry, type) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                [type]: newEntry,
              },
            }
          : node
      ),
    }));
  },

  updateNodeData: (nodeId, newEntry, type) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                [type]: updateOrRemoveEntry(node.data[type], newEntry, true), // Chama a função aqui
              },
            }
          : node
      ),
    }));
  },
  addNode: (newNode) =>
    set((state) => ({
      nodes: [...state.nodes, newNode],
    })),

  addInteracaoToNode: (nodeId, interaction) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                interactions: [...(node.data.interactions || []), interaction],
              },
            }
          : node
      ),
    })),
  updateNodePosition: (nodeId, position) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      ),
    })),

  // Função para buscar edges filtradas por nodeId
  getEdgesByNodeId: (nodeId: string) => {
    const edges = get().edges;

    if (!Array.isArray(edges)) {
      console.error("edges não é um array", edges);
      return { asSource: [], asTarget: [] }; // Retorne arrays vazios
    }

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
  setFlowData: (payload) => {
    set({
      flow: payload.flow,
      usuarios: payload.usuarios,
      filas: payload.filas,
      nodes: payload.flow.flow.nodeList,
      edges: payload.flow.flow.lineList,
    });
  },
  reconnectEdge: (oldEdge, newConnection) =>
    set((state) => ({
      edges: state.edges.map((edge) => {
        if (edge.id === oldEdge.id) {
          return { ...edge, ...newConnection };
        }
        return edge;
      }),
    })),
  removeSelectedNodesAndEdges: () => {
    const { nodes, edges, setNodes, setEdges } = get();

    // Filtrar nós que NÃO estão selecionados
    const remainingNodes = nodes.filter(
      (node) => node.id !== get().nodeSelect?.id
    );

    // Filtrar arestas que NÃO estão conectadas aos nós selecionados
    const remainingEdges = edges.filter(
      (edge) =>
        !nodes.some(
          (node) =>
            get().nodeSelect?.id &&
            (edge.source === node.id || edge.target === node.id)
        )
    );

    // Atualizar o estado no Zustand
    setNodes(remainingNodes);
    // setEdges(remainingEdges);
  },

  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    })),
  resetFlowData: () =>
    set({
      flow: {},
      usuarios: [],
      filas: [],
    }),
}));
const updateOrRemoveEntry = (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  array: any[],
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  newEntry: any,
  removeIfMissing = false
) => {
  // Verifica se o id já existe no array
  const index = array.findIndex((item) => item.id === newEntry.id);

  if (index !== -1) {
    if (removeIfMissing && newEntry.shouldRemove) {
      // Remove o item se a flag `shouldRemove` estiver ativa
      return array.filter((item) => item.id !== newEntry.id);
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      // Se encontrar o id, substitui o item no array com o novo objeto
      array[index] = newEntry;
    }
  } else if (removeIfMissing && !newEntry.shouldRemove) {
    // Se não encontrar e a remoção não for ativada, adiciona o novo objeto ao final do array
    array.push(newEntry);
  }

  return array; // Retorna o array atualizado
};
export default useChatFlowStore;
