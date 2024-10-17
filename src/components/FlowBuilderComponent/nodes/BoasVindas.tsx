import { Box, Typography } from "@mui/material"
import { type NodeProps, Handle, Position } from "@xyflow/react"

export const BoasVindas = (props: NodeProps) => {

    return (
        <Box sx={{
            backgroundColor: 'background.paper',
            width: 150, p: '10px', border: '1px solid #ccc', borderRadius: '3px', textAlign: 'center'
        }}
        >
            <Typography sx={{ fontSize: '12px' }}>Boas vindas!</Typography>
            <Handle position={Position.Left} type="target" isConnectable={false} isConnectableEnd={false} style={{ left: -4, width: 6, height: 6, opacity: 0.5 }} />
            <Handle position={Position.Right} type="source" style={{ right: -4, width: 6, height: 6, opacity: 0.5 }} />
        </Box>
    )
}