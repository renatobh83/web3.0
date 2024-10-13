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
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  getEdgesByNodeId: (nodeId: string) => { asSource: Edge[]; asTarget: Edge[] }
  getLabelByTarget: (targetId: string) => string | undefined

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
    nodes: Node[]
    edges: Edge[]
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
  setNodes: (nodes: Node[]) => set({ nodes }),
  setEdges: (edges: Edge[]) => set({ edges }),
  updateNode: updatedNode =>
    set(state => ({
      nodes: state.nodes.map(node =>
        node.id === updatedNode.id ? updatedNode : node
      ),
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

  // Função para buscar edges filtradas por nodeId
  getEdgesByNodeId: (nodeId: string) => {
    const edges = get().edges

    if (!Array.isArray(edges)) {
      console.error('edges não é um array', edges)
      return { asSource: [], asTarget: [] } // Retorne arrays vazios
    }

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
  setFlowData: payload => {
    set({
      flow: payload.flow,
      usuarios: payload.usuarios,
      filas: payload.filas,
      nodes: payload.flow.flow.nodeList,
      edges: payload.flow.flow.lineList,
    })
  },

  resetFlowData: () =>
    set({
      flow: {},
      usuarios: [],
      filas: [],
    }),
}))

export default useChatFlowStore
