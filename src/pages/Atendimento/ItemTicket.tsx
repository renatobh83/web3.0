import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Typography,
} from '@mui/material'
import {
  useAtendimentoTicketStore,
  type Ticket,
} from '../../store/atendimentoTicket'

import { CheckCircle, WhatsApp } from '@mui/icons-material'
import { formatDistance, parseJSON } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTicketService } from '../../hooks/useTicketService'
import { ObterContato } from '../../services/contatos'
import { useApplicationStore } from '../../store/application'
import { useAtendimentoStore } from '../../store/atendimento'

interface ItemTicketProps {
  ticket: Ticket
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  filas: any[]
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  etiquetas: any[]
  buscaTicket: boolean
}

export const ItemTicket = ({
  etiquetas,
  filas,
  ticket,
  buscaTicket,
}: ItemTicketProps) => {
  const navigate = useNavigate()
  const { iniciarAtendimento } = useTicketService()
  const dataInWords = (timestamp: string, updated: string) => {
    const data = timestamp ? new Date(Number(timestamp)) : parseJSON(updated)
    return formatDistance(data, new Date(), { locale: ptBR })
  }
  const obterNomeFila = (ticket: Ticket) => {
    const fila = filas.find(f => f.id === ticket.queueId)
    return fila ? fila.queue : ''
  }
  const [timeLabel, setTimeLabel] = useState<string>(() =>
    dataInWords(ticket.lastMessageAt, ticket.updatedAt)
  )

  const AbrirChatMensagens = useAtendimentoTicketStore(
    s => s.AbrirChatMensagens
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

  //   useEffect(() => {
  //     // useAtendimentoTicketStore.setState({
  //     //     redirectToChat: (ticketId: string) => {
  //     //         navigate(`/atendimento/${ticketId}`);
  //     //     },
  //     // });
  //   }, [])
  const { mobileOpen, setMobileOpen } = useAtendimentoStore()
  const goToChat = async (id: string) => {
    try {
      const timestamp = new Date().getTime()
      navigate(`/atendimento/${id}?t=${timestamp}`, {
        replace: false,
        state: { t: new Date().getTime() },
      })
    } catch (error) {
    } finally {
      if (mobileOpen) setMobileOpen(false)
    }
  }
  const abrirChatContato = async ticket => {
    AbrirChatMensagens(ticket)
    goToChat(ticket.id)
  }

  if (!ticket) {
    return
  }
  const borderColor = {
    open: '#1976d2',
    pending: '#c10015',
    closed: '#21ba45',
  }

  return (
    <ListItem
      disablePadding
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <ListItemButton
        onClick={() => abrirChatContato(ticket)}
        sx={{
          width: '100%',
          borderLeft: `5px solid ${borderColor[ticket?.status]}`,
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          opacity: '100 !important',
        }}
      >
        {/* Imagem de perfil */}
        <ListItemAvatar>
          {ticket.status === 'pending' ? (
            <Button onClick={() => iniciarAtendimento(ticket)}>
              <Avatar sx={{ width: 50, height: 50 }}>
                <Badge
                  badgeContent={ticket.unreadMessages}
                  color="secondary"
                  sx={{ mr: 1 }}
                />
              </Avatar>
            </Button>
          ) : (
            <Avatar
              alt={ticket.name || ticket.contact.name}
              src={ticket.profilePicUrl} // Substitua pelo caminho da imagem
              sx={{ width: 48, height: 48, flexShrink: 0 }} // Largura fixa para o avatar
            />
          )}
        </ListItemAvatar>

        {/* Informações do ticket */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minWidth: 0, // Garante que a largura do texto seja ajustada ao container
            marginLeft: 1,
            marginRight: 1, // Margem lateral entre texto e outros elementos
            overflow: 'hidden', // Impede que o conteúdo estoure
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            // sx={{ width: '100%' }}
          >
            <Typography
              // fontWeight="bold"/
              variant="inherit"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%', // Limita o tamanho do nome
              }}
            >
              {ticket.name || ticket.contact.name}
            </Typography>

            {/* <Typography variant="caption" color="textSecondary" sx={{ flexShrink: 0 }}>
                            {dataInWords(ticket.lastMessageAt, ticket.updatedAt)}
                        </Typography> */}
          </Box>

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}
          >
            {ticket.lastMessage}
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mt={1}
            sx={{
              maxWidth: '100%', // Garante que o Box não ultrapasse o espaço disponível
              overflow: 'hidden', // Impede o conteúdo de estourar
              flexShrink: 1, // Permite que o Box diminua se necessário
            }}
          >
            <Chip
              // biome-ignore lint/complexity/useOptionalChain: <explanation>
              label={ticket.whatsapp && ticket.whatsapp.name}
              size="small"
              sx={{
                maxWidth: '50%', // Limita o tamanho do Chip para garantir que não estoure
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            />
            {ticket.channel === 'whatsapp' && (
              <WhatsApp fontSize="small" sx={{ color: 'green !important' }} />
            )}
          </Box>

          <Typography variant="caption" color="textSecondary">
            Usuário: {ticket.username}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Fila: {ticket.queue || obterNomeFila(ticket)}
          </Typography>
        </Box>

        {/* Ícone de verificação e número do ticket */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          height={'90px'}
          sx={{
            minWidth: 50, // Tamanho fixo para a coluna da direita
            flexShrink: 0, // Impede que a coluna da direita diminua
          }}
        >
          <Chip label={timeLabel} size="small" />
          <Typography variant="body2" color="textSecondary">
            #{ticket.id}
          </Typography>
          {ticket.status === 'closed' && (
            <CheckCircle fontSize="medium" sx={{ color: 'green !important' }} />
          )}
        </Box>
      </ListItemButton>
    </ListItem>
  )
}
