import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  Panel,
  type Edge,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { DefaultEdge } from './edges/DefaultEdges'
import { ConnectionLine } from './edges/ConnectionLine'
import {
  Add,
  ArrowLeft,
  SaveRounded,
} from '@mui/icons-material'
import { Configuracoes } from './nodes/Configuracoes'
import useChatFlowStore from '../../store/chatFlow'
import { UpdateChatFlow } from '../../services/chatflow'
import { Start } from './nodes/Start'
import { BoasVindas } from './nodes/BoasVindas'
import { TabsDetails } from './TabsDetails'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Node as NodeCustom } from './nodes/Node'
import { WebhookField } from './nodes/WebhookField'

const EDGE_TYPES = {
  default: DefaultEdge,
}
const NODE_TYPES = {
  node: NodeCustom,
  configurations: Configuracoes,
  start: Start,
  boasVindas: BoasVindas,

}

export const PanelChatFlow = () => {
  const { flow: chatFlow } = useChatFlowStore()

  const theme = useTheme(); // Obtém o tema do Material-UI
  const isDarkMode = theme.palette.mode === 'dark';
  const nav = useNavigate()
  if (!chatFlow.id) {
    return <Navigate to="/chat-flow" />
  }

  const { nodes, edges, deleteNode, updateNodePosition, setEdges,
    removeEdge, reconnectEdge, addNode, resetFlowData, updateEdges, updateNodes, setSelectedNode, selectedNode } =
    useChatFlowStore()
  const [hasChange, setHasChange] = useState(false)
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges)
  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes)
  // const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined)

  const edgeReconnectSuccessful = useRef(false)
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (selectedNode?.id) {
      nodes.find(node => { if (node.id === selectedNode.id) setSelectedNode(node) })

    }
    if (!hasChange) setHasChange(true)
    setLocalNodes(nodes)
    updateNodes(nodes)
    updateEdges(localEdges)

  }, [nodes])
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!hasChange) setHasChange(true)
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
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
  const handleSair = () => {
    resetFlowData()
    setSelectedNode(undefined)
    nav("/chat-flow")
    // if (hasChange) {
    //   toast.info('Salve o painel antes de sair', {
    //     position: 'top-center'
    //   })

    // } else {

    // }
  }
  const [valueX, setValuex] = useState(0)

  const addNewNode = () => {

    const newNode = {
      id: crypto.randomUUID(),
      type: 'node',
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
    console.log(nodes, data)
    setHasChange(false)
    await UpdateChatFlow(data)
  }

  const onConnect = (params: Connection | Edge) => {
    const updatedEdges = addEdge(params, localEdges)
    setLocalEdges(updatedEdges) // Atualiza os edges locais
    setEdges(updatedEdges) // Atualiza os edges no Zustand
  }
  const handleDeleteNode = (nodeId: string) => {
    toast.error(
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
              background: theme.palette.background.paper,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
              <IconButton onClick={() => handleSair()}><ArrowLeft /></IconButton>
              <Typography variant='subtitle2' >{(chatFlow.name).toUpperCase()}</Typography>
            </Box>
          </Panel>
          <Background gap={12} size={1} style={{
            color: isDarkMode ? theme.palette.grey[900] // Cor de fundo para tema escuro
              : '#000'
          }} />
          <Controls style={{
            color: isDarkMode ? theme.palette.grey[900] // Cor de fundo para tema escuro
              : '#000'
          }} />
        </ReactFlow>
      </Box>
      <Box sx={{ flexGrow: 1, background: theme.palette.background.paper }}>
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
              disabled={!selectedNode?.id || selectedNode.type !== "node"}
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
                backgroundColor: theme.palette.background.default,
                borderRadius: '0.4rem',
                // color: '#000',
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
                <TabsDetails node={selectedNode} />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box >
  )
}
