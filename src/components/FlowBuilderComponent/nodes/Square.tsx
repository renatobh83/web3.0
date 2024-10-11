import { Box, Typography } from "@mui/material"
import { type NodeProps, Handle, Position, useReactFlow } from "@xyflow/react"
import { useEffect, useState } from "react"

export const Square = (props: NodeProps) => {
    const { setNodes, getEdges, setEdges } = useReactFlow()
    const [label, setLabel] = useState(props.data.label)

    useEffect(() => {
        setLabel(props.data.label)
    }, [props.data.label])
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e?.key.toLowerCase()
            switch (true) {
                case key === 'delete': {
                    setNodes(prevNodes => prevNodes.filter(node => {
                        if (node.selected) {
                            const connectionEdges = getEdges()
                            const filteredData = connectionEdges.filter(
                                item => item.source !== node.id && item.target !== node.id
                            )
                            setEdges(filteredData)
                        }
                        return !node.selected
                    }))
                    break
                }
                default:
                    break
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])
    return (
        <Box sx={{ backgroundColor: 'background.paper', width: 150, p: '10px', border: '1px solid black', borderRadius: '3px', textAlign: 'center' }}
        >
            <Typography sx={{ fontSize: '12px' }}>{label}</Typography>
            <Handle id="right" position={Position.Right} type="source" style={{ right: -4, width: 6, height: 6, opacity: 0.5 }} />
            <Handle id="left" position={Position.Left} type="target" style={{ left: -4, width: 6, height: 6, opacity: 0.5 }} />
        </Box>
    )
}