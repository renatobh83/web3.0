import { Box, Typography } from "@mui/material"
import { type NodeProps, Handle, Position } from "@xyflow/react"

export const Start = (props: NodeProps) => {

    return (
        <Box sx={{ backgroundColor: 'background.paper', width: 150, p: '10px', border: '1px solid #ccc', borderRadius: '3px', textAlign: 'center' }}
        >
            <Typography sx={{ fontSize: '12px' }}>Start</Typography>
            <Handle isConnectable={false} position={Position.Bottom} type="source" style={{ bottom: -4, width: 6, height: 6, opacity: 0.5 }} />
        </Box>
    )
}