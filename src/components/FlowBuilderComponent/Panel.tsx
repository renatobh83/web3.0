import { Box, Button, Divider } from "@mui/material"
import {
    ReactFlow, Background, Controls, addEdge,
    useEdgesState, reconnectEdge, useNodesState,
    ConnectionMode, type Connection, Panel, type Edge, type Node,
    MarkerType,
    useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useRef, useState } from "react";
import { Square } from "./nodes/Square";
import { DefaultEdge } from "./edges/DefaultEdges";
import { ConnectionLine } from "./edges/ConnectionLine";
import { Add, LtePlusMobiledataTwoTone, PlusOne, SaveRounded } from "@mui/icons-material";
import { Configuracoes } from "./nodes/Configuracoes";
import useChatFlowStore from "../../store/chatFlow";
import { UpdateChatFlow } from "../../services/chatflow";
import { Start } from "./nodes/Start";
import { BoasVindas } from "./nodes/BoasVindas";


const INITIAL_NODES: Node[] = [];
const INITIAL_EDGES: Edge[] = [];

const EDGE_TYPES = {
    default: DefaultEdge
}
const NODE_TYPES = {
    square: Square,
    configuracao: Configuracoes,
    start: Start,
    boasVindas: BoasVindas
}
export const PanelChatFlow = () => {

    const { flow: chatFlow } = useChatFlowStore()
    const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
    const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (chatFlow) {

            setNodes(chatFlow.flow.nodeList)
            setEdges(chatFlow.flow.lineList)
        }
    }, [chatFlow])

    const edgeReconnectSuccessful = useRef(false);



    const onReconnectStart = useCallback((_: MouseEvent | TouchEvent, edge: Edge) => {

        edgeReconnectSuccessful.current = false;
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
        const nodeA = "start";
        const nodeB = "nodeC";
        if (
            (oldEdge.source === nodeA && oldEdge.target === nodeB)
        ) {
            return;
        }
        edgeReconnectSuccessful.current = true;

        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const onReconnectEnd = useCallback((_: MouseEvent | TouchEvent, edge: Edge) => {
        const nodeA = "start";
        const nodeB = "nodeC";

        if (
            (edge.source === nodeA && edge.target === nodeB)
        ) {
            return;
        }

        if (!edgeReconnectSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
        edgeReconnectSuccessful.current = true;
    }, []);


    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const onConnect = useCallback(
        (params: Connection) => {

            setEdges((eds) => addEdge(params, eds))
        },
        [],
    );

    const onSavePanel = () => {
        const flow = {
            nodeList: nodes,
            lineList: edges
        }
        const data = {
            ...chatFlow,
            flow
        }

        UpdateChatFlow(data).then(data => console.log(data))
    }
    const [selectedNode, setSelectedNode] = useState<Node | undefined>()

    const onNodeClick = (_event: React.MouseEvent<Element>, node: Node) => {
        setSelectedNode(node)
    }
    const onPanelClick = () => {
        setSelectedNode(undefined)
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        setSelectedNode(undefined)
    }, [edges])

    const [valueX, setValuex] = useState(0)
    function addSquareNode() {
        setNodes(nodes => [...nodes, {
            id: crypto.randomUUID(),
            type: 'square',
            position: {
                x: valueX,
                y: 150
            },
            data: {
                total: 10,
                label: 'data'
            }
        }])
        setValuex(v => v + 10)
    }

    return (
        <Box sx={{ width: '100%', height: 'calc(100vh - 80px)', display: { sm: 'none', xs: 'none', md: 'flex' } }}>
            <Box sx={{ width: '100%', height: '100%', maxWidth: 'calc(100% - 380px)' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={NODE_TYPES}
                    edgeTypes={EDGE_TYPES}
                    defaultEdgeOptions={{ type: 'default' }}
                    connectionLineComponent={ConnectionLine}
                    // connectionMode={ConnectionMode.Loose}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    snapToGrid

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
                    <Background
                        gap={12}
                        size={2}
                        color="#ddd"
                    />
                    <Controls />
                </ReactFlow>
            </Box>
            <Box sx={{ flexGrow: 1, }}>
                <Box sx={{ px: 2, py: 1, height: '100%' }}>
                    <Box id='header-node' sx={{ mb: 1, alignItems: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <Button onClick={onSavePanel}
                            variant="contained"
                            color="success"
                        // sx={{ width: 0, height: 0, padding: 0, }}
                        >
                            <SaveRounded sx={{ mr: 1 }} />
                            Salvar
                        </Button>

                        <Button
                            variant="contained"
                            color="info"
                            onClick={() => {
                                addSquareNode()
                            }}

                        ><Add />Nova Etapa</Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, borderRadius: '0.4rem', border: '1px solid', height: '92%' }}>
                        {selectedNode?.id}
                    </Box>
                </Box>
            </Box>
        </Box >
    )
}