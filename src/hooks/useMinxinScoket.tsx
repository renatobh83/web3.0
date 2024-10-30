import { useCallback, useEffect, useRef, useState } from 'react'
import { socketIO } from '../utils/socket'
import { useAtendimentoTicketStore } from '../store/atendimentoTicket'
import { useContatosStore } from '../store/contatos'
import type { Socket } from 'socket.io-client'
import checkTicketFilter from '../utils/checkTicketFilter'
import { ConsultarTickets } from '../services/tickets'
import { useNotificationsStore } from '../store/notifications'

import { toast } from 'sonner'
import { eventEmitterScrool } from '../pages/Atendimento/ChatMenssage'
import { eventEmitter as eventNotification } from '../pages/Atendimento/index'
import { useWebSocketStore } from '../store/socket'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Errors } from '../utils/error'
import { format } from 'date-fns'
import { orderTickets } from '../utils/ordertTickets'


export const useMixinSocket = () => {
  const { decryptData } = useAuth()

  const usuario = JSON.parse(decryptData('usuario'))

  const userId = +localStorage.getItem('userId')
  const loadTickets = useAtendimentoTicketStore(state => state.loadTickets)
  const ticketFocado = useAtendimentoTicketStore(state => state.ticketFocado)
  const setTicketFocado = useAtendimentoTicketStore(
    state => state.setTicketFocado
  )
  const updateMessages = useAtendimentoTicketStore(
    state => state.updateMessages
  )
  const updateMessageStatus = useAtendimentoTicketStore(
    state => state.updateMessageStatus
  )
  const updateTicket = useAtendimentoTicketStore(state => state.updateTicket)
  const updateContatos = useContatosStore(s => s.updateContact)
  const [loading, setLoading] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const { resetUnread } = useAtendimentoTicketStore()
  const { getWs, setWs, resetWs } = useWebSocketStore()
  const updateNotifications = useNotificationsStore(s => s.updateNotifications)
  const updateNotificationsP = useNotificationsStore(
    s => s.updateNotificationsP
  )
  const scrollToBottom = () => {
    setTimeout(() => {
      eventEmitterScrool.emit('scrollToBottomMessageChat')
    }, 200)
  }
  const navigate = useNavigate()
  const goToChat = async (id: number) => {
    try {
      const timestamp = new Date().getTime()
      navigate(`/atendimento/${id}?t=${timestamp}`, {
        replace: false,
        state: { t: new Date().getTime() },
      })
    } catch (error) {
      Errors(error)
    }
  }
  let socket: Socket | null = null
  const { AbrirChatMensagens } = useAtendimentoTicketStore()
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {

    if (!getWs()) {
      socket = socketIO()
      console.log('Socket connect', location.pathname)
      setWs(socket)
      socketRef.current = socket
      // Token inválido, desconecta e redireciona
      socket.on(`tokenInvalid:${socket.id}`, () => {
        socket?.disconnect()
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('profile')
        localStorage.removeItem('userId')
        localStorage.removeItem('usuario')
        setTimeout(() => {
          window.location.href = '/login'
        }, 1000)
      })
    }
    return () => {
      if (socket) {
        // socket.disconnect()
        resetWs()
        socket.disconnect()
        console.log('useMinxinScoket disconnected')
      }
    }
  }, [getWs, setWs])


  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const socketTicket = useCallback(() => {
    const socket = socketRef.current
    socket?.on('connect', () => {
      socket?.on(`${usuario.tenantId}:ticket`, data => {
        if (data.action === 'update' && data.ticket.userId === userId) {
          if (data.ticket.status === 'open' && !data.ticket.isTransference) {
            setTicketFocado(data.ticket)
          }
        }
      })
    })
  }, [socketRef])
  // Método para escutar a lista de tickets
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const socketTicketListNew = useCallback(() => {
    const socket = socketRef.current
    socket?.on('connect', () => {
      socket.on(`${usuario.tenantId}:ticketList`, async data => {
        if (data.type === 'chat:create') {

          scrollToBottom()
          if (
            !data.payload.read &&
            (data.payload.ticket.userId === userId ||
              !data.payload.ticket.userId) &&
            data.payload.ticket.id !== ticketFocado.id
          ) {

            if (data.payload.ticket.userId) {
              eventNotification.emit('playSoundNotification')
              const options = {
                body: `${data.payload.body} - ${format(new Date(), 'HH:mm')}`,
                icon: data.payload.ticket.contact.profilePicUrl,
                tag: data.payload.ticket.id,
                renotify: true,
              }
              const notification = new Notification(
                `Mensagem de ${data.payload.ticket.contact.name}`,
                options
              )
              setTimeout(() => {
                notification.close()
              }, 10000)
              notification.onclick = e => {
                e.preventDefault()

                if (document.hidden) {
                  window.focus()
                }

                AbrirChatMensagens(data.payload.ticket)
                goToChat(data.payload.ticketId)
              }
            } else {
              eventNotification.emit('playSoundNotification')
              const message = new Notification('Novo cliente pendente', {
                body: `Cliente: ${data.payload.ticket.contact.name}`,
                tag: data.payload.ticket.id,
              })
              message.onclick = e => {
                e.preventDefault()
                window.focus()
                AbrirChatMensagens(data.payload.ticket)
                goToChat(data.payload.ticket.id)
              }
            }

          }
          updateMessages(data.payload)
        }
        if (data.type === 'chat:ack' || data.type === 'chat:delete') {
          updateMessageStatus(data.payload)
        }
        if (data.type === 'chat:update') {
          updateMessages(data.payload)
        }
        if (data.type === 'ticket:update') {
          const params = {
            searchParam: '',
            pageNumber: 1,
            status: ['open', 'closed', 'pending'],
            showAll: false,
            count: null,
            queuesIds: [],
            withUnreadMessages: false,
            isNotAssignedUser: false,
            includeNotQueueDefined: true,
          }
          const response = await ConsultarTickets(params)
          const newTicketsOrder = orderTickets(response.data.tickets)
          setTimeout(() => {
            loadTickets(newTicketsOrder)
          }, 200)
          setTimeout(() => {
            updateTicket(data.payload)
          }, 400)
          setTimeout(async () => {
            resetUnread(data.payload)
          }, 600)
        }
        let verify = []
        if (data.type === 'notification:new') {
          console.log('socket ON: notification:New useMininxSocket')

          scrollToBottom()
          // Atualiza notificações de mensagem
          // var data_noti = []
          const params = {
            searchParam: '',
            pageNumber: 1,
            status: ['pending'],
            showAll: false,
            count: null,
            queuesIds: [],
            withUnreadMessages: false,
            isNotAssignedUser: false,
            includeNotQueueDefined: true,
            // date: new Date(),
          }
          try {
            const data_noti = await ConsultarTickets(params)
            // updateNotificationsP(data_noti.data)
            verify = data_noti
          } catch (err) {
            toast.message('Algum problema ao consultar tickets', {
              description: `${err}`,
              position: 'top-center',
            })
            console.error(err)
          }
          // Faz verificação para se certificar que notificação pertence a fila do usuário
          let pass_noti = false
          // biome-ignore lint/complexity/noForEach: <explanation>
          verify.data.tickets.forEach(element => {
            pass_noti = element.id === data.payload.id ? true : pass_noti
          })
          // // Exibe Notificação
          if (pass_noti) {
            eventNotification.emit('playSoundNotification')
            const message = new Notification('Novo cliente pendente', {
              body: `Cliente: ${data.payload.contact.name}`,
              tag: 'simple-push-demo-notification',
            })
            message.onclick = e => {
              e.preventDefault()
              window.focus()
              AbrirChatMensagens(data.payload)
              goToChat(data.payload.id)
            }
          }
        }
      })


      socket.on(`${usuario.tenantId}:contactList`, data => {
        updateContatos(data.payload)
      })
    })
  }, [socketRef])

  function socketTicketList() {
    socketTicketListNew()
  }
  const socketDisconnect = useCallback(() => {
    socketRef.current = null
  }, [])

  return { socketTicket, socketDisconnect, socketTicketList }
}
