import { create } from 'zustand'
import type { Node, Edge } from '@xyflow/react'

interface FlowStore {
  nodes: Node[]
  edges: Edge[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
}

export const useFlowStore = create<FlowStore>(set => ({
  nodes: [],
  edges: [],
  setNodes: (nodes: Node[]) => set({ nodes }),
  setEdges: (edges: Edge[]) => set({ edges }),
}))
