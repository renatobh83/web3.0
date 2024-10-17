import { Box, Typography, useTheme } from '@mui/material'
import { type NodeProps, Handle, Position, useReactFlow } from '@xyflow/react'
import { useEffect, useState } from 'react'
import useChatFlowStore from '../../../store/chatFlow'

export const Node = (props: NodeProps) => {
  const [label, setLabel] = useState(props.data.label)
  const nodeSelect = useChatFlowStore(state => state.selectedNode)
  const setNodeSelect = useChatFlowStore(state => state.setSelectedNode)
  const theme = useTheme(); // Obtém o tema atual

  // Verifica se o modo é escuro
  const isDarkMode = theme.palette.mode === 'dark';
  useEffect(() => {
    setLabel(props.data.label)
  }, [props.data.label])


  return (
    <Box
      onClick={() => setNodeSelect(props.id)}
      id={props.id}
      sx={{
        backgroundColor: nodeSelect?.id !== props.id ? 'background.paper' : isDarkMode ? theme.palette.grey[500] // Cor de fundo para tema escuro
          : '#cccddd',
        width: 150,
        p: '10px',
        border: '1px solid #ccc',
        borderRadius: '3px',
        textAlign: 'center',
      }}
    >
      <Typography sx={{ fontSize: '12px' }}>{label}</Typography>
      <Handle
        id="right"
        position={Position.Right}
        type="source"
        style={{ right: -4, width: 6, height: 6, opacity: 0.5 }}
      />
      <Handle
        id="left"
        position={Position.Left}
        type="target"
        style={{ left: -4, width: 6, height: 6, opacity: 0.5 }}
      />
    </Box>
  )
}
