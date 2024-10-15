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
  const { nodes, edges, deleteNode, updateNodePosition, setEdges,
    removeEdge, reconnectEdge, addNode, updateEdges, updateNodes, nodeSelect } =
    useChatFlowStore()

  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges)
  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes)
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined)

  const edgeReconnectSuccessful = useRef(false)
  useEffect(() => {
    if (selectedNode?.id) {
      nodes.find(node => { if (node.id === selectedNode.id) setSelectedNode(node) })

    }
    setLocalNodes(nodes)
    updateNodes(nodes)
    updateEdges(localEdges)
  }, [nodes])

  useEffect(() => {
    setLocalEdges(edges)
  }, [edges])


  const onNodeDragStop = (_, node) => {
    updateNodePosition(node.id, node.position);
  };

  const onReconnectStart = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      edgeReconnectSuccessful.current = false
      setSelectedNode(undefined)
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
      setLocalEdges(els => reconnectEdge(oldEdge, newConnection, els))
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
        removeEdge(edge.id)
        setLocalEdges(eds => eds.filter(e => e.id !== edge.id))
      }
      edgeReconnectSuccessful.current = true
    },
    [removeEdge]
  )
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
    // setLocalNodes(prevNodes => [...prevNodes, newNode])
    addNode(newNode)
  }

  const onNodeClick = (_event: React.MouseEvent<Element>, node: Node) => {
    setSelectedNode(node)
  }
  const onPanelClick = () => {
    setSelectedNode(undefined)

  }
  const [labelNode, setLabelNode] = useState('')

  const handleLabelData = newLabel => {
    if (selectedNode) {
      selectedNode.data.label = newLabel
      setLabelNode(newLabel)
    }
  }
  const handleSavePanel = async () => {
    const flow = {
      nodeList: localNodes,
      lineList: localEdges,
    }
    const data = {
      ...chatFlow,
      flow,
    }
    console.log(data, localNodes, nodes)
    await UpdateChatFlow(data)
  }

  const onConnect = (params: Connection | Edge) => {
    const updatedEdges = addEdge(params, localEdges)
    setLocalEdges(updatedEdges) // Atualiza os edges locais
    setEdges(updatedEdges) // Atualiza os edges no Zustand
  }
  const handleDeleteNode = (nodeId: string) => {
    toast.info(
      `Atenção!! Deseja realmente deletar o node "${selectedNode?.data.label}"?`,
      {
        position: "top-center",
        cancel: {
          label: "Cancel",
          onClick: () => console.log("Cancel!"),
        },
        action: {
          label: "Confirma",
          onClick: () => {
            deleteNode(nodeId)
            setSelectedNode(undefined)
          },
        },
      },
    );

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
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          snapToGrid={false}
          onNodeDragStop={onNodeDragStop}
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
            <Button
              onClick={handleSavePanel}
              variant="contained" color="success">
              <SaveRounded sx={{ mr: 1 }} />
              Salvar
            </Button>
            <Button
              variant="contained"
              color="warning"
              disabled={!selectedNode?.id || selectedNode.type !== "square"}
              onClick={() => {
                handleDeleteNode(selectedNode.id)
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
                  value={selectedNode ? selectedNode?.data?.label : labelNode}
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
