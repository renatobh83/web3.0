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
  NodeChange,
  OnNodesChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Square } from './nodes/Node'
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
import { toast } from 'sonner'

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
  if (!chatFlow.id) {
    return <Navigate to="/chat-flow" />
  }

  // Zustate Store
  const { nodes, edges, clearNodeSelection, setEdges, removeEdge, reconnectEdge, addNode, setNodeSelect } =
    useChatFlowStore()
  const [selectedNode, setSelectedNode] = useState<Node | undefined>()
  // Hooks do React Flow para controle local de nodes e edges
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges)
  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes)
  // Atualize o estado do Zustand quando o estado local mudar
  // useEffect(() => {
  //   setNodes(localNodes)
  // }, [localNodes, setNodes])

  // useEffect(() => {
  //   setEdges(localEdges)
  // }, [localEdges, setEdges])
  // Sincronizar o estado local com o Zustand sempre que ele mudar

  const onNodeClick = (_event: React.MouseEvent<Element>, node: Node) => {
    setSelectedNode(node)
    setNodeSelect(node)
  }
  const onPanelClick = () => {
    setSelectedNode(undefined)
    setNodeSelect(undefined)

  }
  const [valueX, setValuex] = useState(0)
  const addNewNode = () => {
    const newNode = {
      id: crypto.randomUUID(),
      type: 'square',
      position: {
        x: valueX,
        y: 150,
      },
      data: {
        label: 'Nova etapa',
        interactions: [],
        conditions: [],
        actions: [],
      },
    }
    setValuex(v => v + 10)
    addNode(newNode)
    // Atualiza os nós no Zustand
    // setNodes(prevNodes => [...prevNodes, newNode])
  }

  //   atualizar label dos nodes
  const [labelNode, setLabelNode] = useState('')

  const handleLabelData = newLabel => {
    if (selectedNode) {
      selectedNode.data.label = newLabel
      setLabelNode(newLabel)
    }
  }
  useEffect(() => {
    // toast.message('load node local', {
    //   description: ' carregados',
    //   position: 'top-center',
    // })
    // console.log('Att local')
    setLocalNodes(nodes) // Atualiza os nodes locais quando os nodes no Zustand mudam
  }, [nodes, setLocalNodes])

  useEffect(() => {
    // toast.message('load edge local', {
    //   description: ' carregados',
    //   position: 'top-center',
    // })
    setLocalEdges(edges) // Atualiza os edges locais quando os edges no Zustand mudam
    setSelectedNode(undefined)
    setNodeSelect(undefined)
  }, [edges])

  const edgeReconnectSuccessful = useRef(false)

  const onSavePanel = async () => {
    const flow = {
      nodeList: nodes,
      lineList: edges,
    }
    const data = {
      ...chatFlow,

      flow,
    }
    console.log(flow, data, localNodes)
    await UpdateChatFlow(data)
  }
  const onReconnectStart = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      edgeReconnectSuccessful.current = false
      setSelectedNode(undefined)
      setNodeSelect(undefined)
    },
    []
  )

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      const nodeA = 'start'
      const nodeB = 'nodeC'
      if (oldEdge.source === nodeA && oldEdge.target === nodeB) {
        return
      }

      edgeReconnectSuccessful.current = true
      reconnectEdge(oldEdge, newConnection)
    },
    [reconnectEdge]
  )

  const onReconnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      const nodeA = 'start'
      const nodeB = 'nodeC'

      if (edge.source === nodeA && edge.target === nodeB) {
        return
      }
      if (!edgeReconnectSuccessful.current) {
        // Se a reconexão não foi bem-sucedida, remove a aresta
        // const newEdges = edges.filter(e => e.id !== edge.id)
        // setEdges(newEdges)
        removeEdge(edge.id)
      }
      edgeReconnectSuccessful.current = true
    },
    [removeEdge]
  )

  const onConnect = (params: Connection | Edge) => {
    const updatedEdges = addEdge(params, localEdges)
    setLocalEdges(updatedEdges) // Atualiza os edges locais
    setEdges(updatedEdges) // Atualiza os edges no Zustand
  }
  const updateNodePosition = useChatFlowStore((state) => state.updateNodePosition);


  const handleNodesChange = (changes: NodeChange[]) => {
    onNodesChange(changes);  // Atualiza o estado local no React Flow

    // Sincroniza as mudanças de posição dos nós no Zustand
    changes.forEach((change) => {
      if (change.type === 'position' && change.position) {
        updateNodePosition(change.id, change.position);  // Atualiza a posição no Zustand
      }
    });

  };
  const handleApagarNode = () => {
    console.log(selectedNode)
  }
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
          onNodesChange={handleNodesChange}
          // onNodeDragStart={(_, node) => console.log('Drag started:', node)} // Debug
          // onNodeDragStop={(_, node) => console.log('Drag stopped:', node)}
          onEdgesChange={onEdgesChange}
          snapToGrid={false}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          onConnect={onConnect}
          fitView
          onNodeClick={onNodeClick}
          onPaneClick={onPanelClick}
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
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ px: 2, py: 1, height: '100%' }}>
          <Box
            id="header-node"
            sx={{
              mb: 1,
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Button onClick={onSavePanel} variant="contained" color="success">
              <SaveRounded sx={{ mr: 1 }} />
              Salvar
            </Button>
            <Button
              variant="contained"
              color="warning"
              disabled={!selectedNode?.id && selectedNode?.type === 'square'}
              onClick={() => {
                handleApagarNode()
              }}
            >
              {/* <Add /> */}
              Apagar Node
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                addNewNode()
              }}
            >
              <Add />
              Nova Etapa
            </Button>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              maxWidth: '400px',
              minWidth: '400px',
              borderRadius: '0.4rem',
              border: '1px solid #ccdd',
              height: '92%',
            }}
          >
            <Box
              sx={{
                height: '32px',
                pl: '12px',
                backgroundColor: '#f1f3f4',
                color: '#000',
              }}
            >
              <Typography variant="subtitle2" sx={{ lineHeight: '32px' }}>
                {' '}
                Configuração do fluxo{' '}
              </Typography>
              <Divider />
              <FormControl sx={{ width: '100%' }}>
                <TextField
                  sx={{ padding: 1 }}
                  fullWidth
                  name="label"
                  variant="filled"
                  label="Nome"
                  value={selectedNode ? labelNode : ''}
                  onChange={e => {
                    handleLabelData(e.target.value)
                  }}
                  focused
                />
              </FormControl>
              {selectedNode && (
                <TabsDetails node={selectedNode} atualizarNode={() => { }} />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
