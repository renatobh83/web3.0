import { Box, Button } from "@mui/material"
import { ReactFlow, Background, Controls, applyEdgeChanges, applyNodeChanges, addEdge, useEdgesState, reconnectEdge, useNodesState, ConnectionMode, Connection, Panel, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useRef, useState } from "react";
import { Square } from "./nodes/Square";
import { DefaultEdge } from "./edges/DefaultEdges";
import { ConnectionLine } from "./edges/ConnectionLine";
import { SaveRounded } from "@mui/icons-material";

const INITIAL_NODES = [
    {
        id: 'nodeC',
        data: { label: 'Hello' },
        position: { x: 100, y: 0 },
        type: 'square',
    },
    {
        id: 'BoasVindas',
        data: { label: 'World' },
        position: { x: 100, y: 100 },
        type: 'square',

    },
    {
        id: '20',
        data: { label: 'World' },
        position: { x: 0, y: 0 },
        type: 'input'
    },
];
const EDGE_TYPES = {
    default: DefaultEdge
}
const initialEdges = [];

const NODE_TYPES = {
    square: Square
}
export const PanelChatFlow = () => {
    const edgeReconnectSuccessful = useRef(false);
    const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);


    const onReconnectStart = useCallback(() => {
        console.log('onReconnectStart')
        edgeReconnectSuccessful.current = false;
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const onReconnect = useCallback((oldEdge, newConnection) => {
        edgeReconnectSuccessful.current = true;
        console.log('onReconnect')
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const onReconnectEnd = useCallback((_: MouseEvent | TouchEvent, edge: Edge) => {
        console.log('onReconnectEnd')
        if (!edgeReconnectSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
        edgeReconnectSuccessful.current = true;
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [],
    );
    const onSavePanel = () => {
        console.log(nodes, edges)
    }
    const [selectedNode, setSelectedNode] = useState<Node | undefined>()

    const onNodeClick = (_event: React.MouseEvent<Element>, node: Node) => {
        console.log(node)
        selectedNode(node)
    }
    const onPanelClick = () => {
        setSelectedNode(undefined)
    }
    function addSquareNode() {
        setNodes(nodes => [...nodes, {
            id: crypto.randomUUID(),
            type: 'square',
            position: {
                x: 750,
                y: 350
            },
            data: {
                total: 10,
                label: 'data'
            }
        }])
    }
    return (
        <Box sx={{ width: '100%', height: '75vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={NODE_TYPES}
                edgeTypes={EDGE_TYPES}
                defaultEdgeOptions={{ type: 'default' }}
                connectionLineComponent={ConnectionLine}
                connectionMode={ConnectionMode.Loose}
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
                        width: 200
                    }}
                >
                    {selectedNode?.id}
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button onClick={onSavePanel} sx={{ width: 0, height: 0, padding: 0 }}> <SaveRounded /></Button>
                        <Button
                            onClick={() => {
                                addSquareNode()
                            }}

                        >Add node</Button>
                    </Box>
                </Panel>
                <Background
                    gap={12}
                    size={2}
                    color="#ddd"
                />
                <Controls />
            </ReactFlow>

        </Box>)
}