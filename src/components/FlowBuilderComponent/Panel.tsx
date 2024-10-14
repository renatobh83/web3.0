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
function deepEqual(obj1, obj2, specificKey) {
  // Verifica se ambos os objetos são iguais
  if (obj1 === obj2) return true;

  // Verifica se são objetos e não nulos
  if (obj1 == null || obj2 == null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }

  // Obtem as chaves dos objetos
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Verifica se o número de chaves é diferente
  if (keys1.length !== keys2.length) return false;

  // Compara as chaves e valores
  for (const key of keys1) {
    // Se a chave específica foi fornecida, verifica apenas essa chave
    if (specificKey === key) {

      // Verifica se os valores são diferentes
      if (!deepEqual(obj1[key], obj2[key], specificKey)) {
        return true
        return {
          key: key,
          oldValue: obj1[key],
          newValue: obj2[key],
        };
      }
    } else {
      // Se a chave não for a específica, verifica normalmente
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key], specificKey)) {
        return false;
      }
    }
  }
  return true;
}
export const PanelChatFlow = () => {
  const { flow: chatFlow } = useChatFlowStore()
  if (!chatFlow.id) {
    return <Navigate to="/chat-flow" />
  }
  const { nodes, edges, clearNodeSelection, setEdges, removeEdge, reconnectEdge, setNodes, addNode, updateEdges, updateNodes } =
    useChatFlowStore()
  const [nodeSelect, setNodeSelect] = useState<Node | undefined>()

  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges)
  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes)

  const edgeReconnectSuccessful = useRef(false)
  useEffect(() => {
    console.log(nodes)
    setLocalNodes(nodes)
    nodes.forEach((nodeZ, idx) => {
      const nodeL = localNodes[idx]
      if (!deepEqual(nodeZ, nodeL, 'position')) {
        updateNodes(localNodes)
        updateEdges(localEdges)
      }
    })
  }, [nodes])

  useEffect(() => {
    setLocalEdges(edges)
  }, [edges])

  const onReconnectStart = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      edgeReconnectSuccessful.current = false
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
    setLocalNodes(prevNodes => [...prevNodes, newNode])
    // addNode(newNode)
  }

  const onNodeClick = (_event: React.MouseEvent<Element>, node: Node) => {
    setNodeSelect(node)
  }
  const onPanelClick = () => {
    setNodeSelect(undefined)

  }
  const [labelNode, setLabelNode] = useState('')

  const handleLabelData = newLabel => {
    if (nodeSelect) {
      nodeSelect.data.label = newLabel
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
    updateNodes(localNodes)
    updateEdges(localEdges)
    console.log(nodes)
    // await UpdateChatFlow(data)
  }

  const onConnect = (params: Connection | Edge) => {
    const updatedEdges = addEdge(params, localEdges)
    setLocalEdges(updatedEdges) // Atualiza os edges locais
    setEdges(updatedEdges) // Atualiza os edges no Zustand
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
            // disabled={!selectedNode?.id && selectedNode?.type === 'square'}
            // onClick={() => {
            //   handleApagarNode()
            // }}
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
                  value={nodeSelect ? nodeSelect?.data?.label : ''}
                  onChange={e => {
                    handleLabelData(e.target.value)
                  }}
                  focused
                />
              </FormControl>
              {nodeSelect && (
                <TabsDetails node={nodeSelect} atualizarNode={() => { }} />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
