import { Box, Typography } from '@mui/material'
import { type NodeProps, Handle, Position, useReactFlow } from '@xyflow/react'
import { useEffect, useState } from 'react'
import useChatFlowStore from '../../../store/chatFlow'

export const Square = (props: NodeProps) => {
  const [label, setLabel] = useState(props.data.label)
  const nodeSelect = useChatFlowStore(state => state.nodeSelect)
  const setNodeSelect = useChatFlowStore(state => state.setNodeSelect)

  useEffect(() => {
    setLabel(props.data.label)
  }, [props.data.label])


  return (
    <Box
      onClick={() => setNodeSelect(props.id)}
      id={props.id}
      sx={{
        backgroundColor: nodeSelect === props.id ? 'lightgrey' : 'background.paper',
        width: 150,
        p: '10px',
        border: '1px solid black',
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
