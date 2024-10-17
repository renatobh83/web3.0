import { Box, Typography } from "@mui/material"
import { type NodeProps, Handle, Position } from "@xyflow/react"

export const Configuracoes = (props: NodeProps) => {

    return (
        <Box sx={{ backgroundColor: 'background.paper', width: 150, p: '10px', border: '1px solid #ccc', borderRadius: '3px', textAlign: 'center' }}
        >
            <Typography sx={{ fontSize: '12px' }}>Configurações</Typography>
        </Box>
    )
}