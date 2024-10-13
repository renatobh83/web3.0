import { create } from 'zustand'

interface Edge {
  id: string
  source: string
  target: string
  label?: string
}
interface NodeData {
  label?: string
  [key: string]: any
}

interface Node {
  id: string
  data: NodeData
}
// Definindo o store com Zustand
interface EdgeStore {
  edges: Edge[]
  nodes: Node[]
  setEdgesStore: (edges: Edge[]) => void
  setNodesStore: (nodes: Node[]) => void
  getEdgesByNodeId: (nodeId: string) => { asSource: Edge[]; asTarget: Edge[] }
  getLabelByTarget: (targetId: string) => string | undefined
  addEdge: (edge: Edge) => void
  reconnectEdge: (oldEdge: Edge, newEdge: Edge) => void
  removeEdge: (edgeId: string) => void
  addInteracaoToNode: (
    nodeId: string,
    interaction: { id: string; type: string }
  ) => void
  updateNode: (updatedNode: Node) => void
}
interface FlowState {
  flow: Record<string, any>
  usuarios: any[]
  filas: any[]
  setFlowData: (payload: {
    flow: Record<string, any>
    usuarios: any[]
    filas: any[]
  }) => void
  resetFlowData: () => void
}
interface CombinedState extends FlowState, EdgeStore {}
const useChatFlowStore = create<CombinedState>((set, get) => ({
  flow: {},
  usuarios: [],
  filas: [],
  edges: [],
  nodes: [],

  updateNode: updatedNode =>
    set(state => ({
      nodes: state.nodes.map(node =>
        node.id === updatedNode.id ? updatedNode : node
      ),
    })),
  addEdge: newEdge => set(state => ({ edges: [...state.edges, newEdge] })),
  reconnectEdge: (oldEdge, newConnection) =>
    set(state => ({
      edges: state.edges.map(edge => {
        if (edge.id === oldEdge.id) {
          return { ...edge, ...newConnection }
        }
        return edge
      }),
    })),
  removeEdge: edgeId =>
    set(state => ({
      edges: state.edges.filter(edge => edge.id !== edgeId),
    })),
  addInteracaoToNode: (nodeId, interaction) =>
    set(state => ({
      nodes: state.nodes.map(node =>
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
  // Função para setar as edges no estado
  setEdgesStore: (edges: Edge[]) => set({ edges }),
  setNodesStore: nodes => set({ nodes }),
  // Função para buscar edges filtradas por nodeId
  getEdgesByNodeId: (nodeId: string) => {
    const edges = get().edges

    // Filtrando as edges onde o nodeId é source ou target
    const asSource = edges.filter(edge => edge.source === nodeId)
    const asTarget = edges.filter(edge => edge.target === nodeId)

    return { asSource, asTarget }
  },
  getLabelByTarget: (targetId: string) => {
    // Procura pela edge que tem o targetId fornecido
    const targetEdge = get().edges.find(edge => edge.target === targetId)
    // Se a edge foi encontrada, procura o node associado ao targetId
    if (targetEdge) {
      const targetNode = get().nodes.find(node => node.id === targetId)

      // Retorna a label do node se ela existir
      return targetNode?.data?.label
    }

    // Retorna undefined se não encontrar
    return undefined
  },
  setFlowData: payload =>
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
}))

export default useChatFlowStore
