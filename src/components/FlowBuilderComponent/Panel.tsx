import {
  Box,
  Button,
  Divider,
  FormControl,
  TextField,
  Typography,
} from '@mui/material'
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useEdgesState,
  reconnectEdge,
  useNodesState,
  ConnectionMode,
  type Connection,
  Panel,
  type Edge,
  type Node,
  MarkerType,
  useReactFlow,
  applyNodeChanges,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Square } from './nodes/Square'
import { DefaultEdge } from './edges/DefaultEdges'
import { ConnectionLine } from './edges/ConnectionLine'
import {
  Add,
  LtePlusMobiledataTwoTone,
  PlusOne,
  SaveRounded,
} from '@mui/icons-material'
import { Configuracoes } from './nodes/Configuracoes'
import useChatFlowStore from '../../store/chatFlow'
import { UpdateChatFlow } from '../../services/chatflow'
import { Start } from './nodes/Start'
import { BoasVindas } from './nodes/BoasVindas'
import { TabsDetails } from './TabsDetails'
import { Navigate, useNavigate } from 'react-router-dom'
import { debounce } from 'lodash'
import { useFlowStore } from '../../store/flowStore'

const INITIAL_NODES: Node[] = []
const INITIAL_EDGES: Edge[] = []

const EDGE_TYPES = {
  default: DefaultEdge,
}
const NODE_TYPES = {
  square: Square,
  configuracao: Configuracoes,
  start: Start,
  boasVindas: BoasVindas,
}
export const PanelChatFlow = () => {
  const { flow: chatFlow } = useChatFlowStore()

  // Zustate Store
  const { nodes, edges, setNodes, setEdges } = useFlowStore()
  // Hooks do React Flow para controle local de nodes e edges
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(
    chatFlow.flow.lineList || []
  )
  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(
    chatFlow.flow.nodeList || []
  )
  // Atualize o estado do Zustand quando o estado local mudar
  useEffect(() => {
    setNodes(localNodes)
  }, [localNodes, setNodes])

  useEffect(() => {
    setEdges(localEdges)
  }, [localEdges, setEdges])

  const edgeReconnectSuccessful = useRef(false)

  const onReconnectStart = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      edgeReconnectSuccessful.current = false
    },
    []
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      const nodeA = 'start'
      const nodeB = 'nodeC'
      if (oldEdge.source === nodeA && oldEdge.target === nodeB) {
        return
      }
      edgeReconnectSuccessful.current = true

      setLocalEdges(els => reconnectEdge(oldEdge, newConnection, els))
    },
    []
  )

  const onReconnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      const nodeA = 'start'
      const nodeB = 'nodeC'

      if (edge.source === nodeA && edge.target === nodeB) {
        return
      }

      if (!edgeReconnectSuccessful.current) {
        setLocalEdges(eds => eds.filter(e => e.id !== edge.id))
      }
      edgeReconnectSuccessful.current = true
    },
    []
  )
  const onConnect = useCallback((params: Connection) => {
    setLocalEdges(eds => addEdge(params, eds))
  }, [])
  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 80px)',
        display: { sm: 'none', xs: 'none', md: 'flex' },
      }}
    >
      <Box
        sx={{ width: '100%', height: '100%', maxWidth: 'calc(100% - 390px)' }}
      >
        <ReactFlow
          nodes={localNodes}
          edges={localEdges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          defaultEdgeOptions={{ type: 'default' }}
          connectionLineComponent={ConnectionLine}
          onNodesChange={onNodesChange}
          // onNodeDragStart={(_, node) => console.log('Drag started:', node)} // Debug
          // onNodeDragStop={(_, node) => console.log('Drag stopped:', node)}
          onEdgesChange={onEdgesChange}
          snapToGrid={false}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          onConnect={onConnect}
          fitView
          // onNodeClick={onNodeClick}
          // onPaneClick={onPanelClick}
          attributionPosition="top-right"
        >
          <Panel
            position="top-right"
            style={{
              border: '1px solid #ccc',
              padding: 12,
              borderRadius: 12,
              background: 'white',
            }}
          >
            {chatFlow.name}
          </Panel>
          <Background gap={12} size={2} color="#ddd" />
          <Controls />
        </ReactFlow>
      </Box>
    </Box>
  )
}
