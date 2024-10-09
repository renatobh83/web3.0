import { Close } from "@mui/icons-material"
import { Box, Button, Typography } from "@mui/material"
import { NodeProps, Handle, Position, useReactFlow } from "@xyflow/react"

export const Square = (props: NodeProps) => {
    const { setNodes, getEdges, setEdges } = useReactFlow()


    function onRemoveNode() {
        const connectionEdes = getEdges()
        const filteredData = connectionEdes.filter(
            item => item.source !== props.id && item.target !== props.id
        );
        setNodes(prev => prev.filter(node => node.id !== props.id))
        setEdges(filteredData)
    }
    return (
        <Box sx={{ backgroundColor: '#fff', width: 150, p: '10px', border: '1px solid black', borderRadius: '3px', textAlign: 'center' }}
        >
            {/* <Button size="small" variant="text" onClick={onRemoveNode}
                sx={{ minHeight: 0, minWidth: 0, padding: 0 }}>
                <Close sx={{ fontSize: '8px' }} />
            </Button> */}
            <Typography sx={{ fontSize: '12px' }}>{props.data.label}</Typography>
            <Handle id="right" position={Position.Right} type="source" style={{ right: -4, width: 6, height: 6, opacity: 0.5 }} />
            <Handle id="left" position={Position.Left} type="source" style={{ left: -4, width: 6, height: 6, opacity: 0.5 }} />
        </Box>
    )
}