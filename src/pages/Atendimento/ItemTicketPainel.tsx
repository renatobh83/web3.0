import { Box, Card, Chip, Typography } from '@mui/material'
import { formatDistance, parseJSON } from 'date-fns'
import { useEffect, useState } from 'react'
import { ptBR } from 'date-fns/locale'
import { red } from '@mui/material/colors'
const borderColor = {
  open: '#1976d2',
  pending: '#c10015',
  closed: '#21ba45',
}

export const ItemTicketPainel = ({ ticket }) => {
  const dataInWords = (timestamp: string, updated: string) => {
    const data = timestamp ? new Date(Number(timestamp)) : parseJSON(updated)
    return formatDistance(data, new Date(), { locale: ptBR })
  }
  const [timeLabel, setTimeLabel] = useState<string>(() =>
    dataInWords(ticket.lastMessageAt, ticket.updatedAt)
  )
  useEffect(() => {
    // Função que atualiza a label
    const updateTimeLabel = () => {
      setTimeLabel(dataInWords(ticket.lastMessageAt, ticket.updatedAt))
    }
    // Atualizar a cada 1 minuto (60000 ms)
    const interval = setInterval(updateTimeLabel, 60000)
    // Limpar o intervalo quando o componente desmontar
    return () => clearInterval(interval)
  }, [ticket.lastMessageAt, ticket.updatedAt])

  return (
    <Card sx={{ height: '95px', p: 0, }} >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 1 }}>
        <Box
          sx={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            overflow: 'hidden',
          }}
        >
          <Box
            component={'img'}
            sx={{ objectFit: 'cover', width: '100%', height: '100%' }}
            src={ticket.contact.profilePicUrl}
            alt="Profile"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', flexGrow: '1' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Typography noWrap variant='subtitle2'
              sx={{
                maxWidth: '50%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>{!ticket.name ? ticket.contact.name : ticket.name}</Typography>
            <Chip label={timeLabel}
              size="small"
              sx={{
                maxWidth: '50%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }} />
          </Box>
          <Typography noWrap variant='body1' sx={{
            maxWidth: '50%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>{ticket.lastMessage}</Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mr: 1 }}>
            <Typography variant='caption'> #{ticket.id}</Typography>
            <Typography variant='caption'>{obterNomeFila(ticket.queueId)}</Typography>
            <Chip label={ticket.status} sx={{ borderLeft: `3px solid ${borderColor[ticket?.status]}` }} />
          </Box>
        </Box>
        {/* </Box> */}
      </Box>
    </Card>
  )
}


const obterNomeFila = (ticket: Ticket) => {
  const filas = JSON.parse(localStorage.getItem('filasCadastradas'))
  const fila = filas?.find(f => f.id === ticket)
  return fila ? fila.queue : ''
}