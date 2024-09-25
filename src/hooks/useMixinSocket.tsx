import { useEffect, useState, useRef } from 'react'

import { toast } from 'sonner'
import { ConsultarTickets } from '../services/tickets.js'
import { useAtendimentoTicketStore } from '../store/atendimentoTicket.js'
import { useContatosStore } from '../store/contatos.js'
import { useNotificationsStore } from '../store/notifications.js'
import { socketIO } from '../utils/socket.js'
import { eventEmitter } from '../pages/Atendimento/index.js'

export const useMixinSocket = () => {
  const { setTicketFocado, ticketFocado, updateMessages, updateTicket } =
    useAtendimentoTicketStore()
  const updateNotifications = useNotificationsStore(s => s.updateNotifications)
  const updateNotificationsP = useNotificationsStore(
    s => s.updateNotificationsP
  )
  const updateContatos = useContatosStore(s => s.updateContact)

  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const userId = +JSON.parse(localStorage.getItem('userId'))
  const dispararEvento = (data: any) => {
    eventEmitter.emit('handlerNotifications', data)
  }
  const [loading, setLoading] = useState(false)

  // Ref para armazenar a instância do WebSocket
  const socketRef = useRef(null)

  useEffect(() => {
    // Verifica se já existe uma conexão ativa, caso contrário, cria uma nova
    if (!socketRef.current) {
      const socket = socketIO()
      socketRef.current = socket

      // Listener para o caso de token inválido
      socket.on(`tokenInvalid:${socket.id}`, () => {
        socket.disconnect()
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('profile')
        localStorage.removeItem('userId')
        localStorage.removeItem('usuario')
        setTimeout(() => {
          window.location.href = '/login'
        }, 1000)
      })

      socket.on('connect', () => {
        socket.on(`${usuario.tenantId}:ticket`, async data => {
          if (data.action === 'update' && data.ticket.userId === userId) {
            if (data.ticket.status === 'open' && !data.ticket.isTransference) {
              setTicketFocado(data.ticket)
            }
          }
        })

        socket.on(`${usuario.tenantId}:ticketList`, async data => {
          if (data.type === 'chat:create') {
            if (
              !data.payload.read &&
              (data.payload.ticket.userId === userId ||
                !data.payload.ticket.userId) &&
              data.payload.ticket.id !== ticketFocado?.id
            ) {
              if (checkTicketFilter(data.payload.ticket)) {
                // Lógica para exibir notificação
              }
              updateMessages(data.payload)
              const params = {
                searchParam: '',
                pageNumber: 1,
                status: ['open'],
                showAll: false,
                count: null,
                queuesIds: [],
                withUnreadMessages: true,
                isNotAssignedUser: false,
                includeNotQueueDefined: true,
              }

              setLoading(true)
              try {
                const { data } = await ConsultarTickets(params)
                updateNotifications(data)
              } catch (err) {
                console.error(err)
              } finally {
                setLoading(false)
              }
            }
          }

          if (data.type === 'chat:ack' || data.type === 'chat:delete') {
            // updateMessageStatus(data.payload);
          }

          if (data.type === 'ticket:update') {
            // const message = new Notification('Novo cliente pendente', {
            //   body: 'Cliente: ' + data.payload.contact.name,
            //   tag: 'simple-push-demo-notification'
            // })
            updateTicket(data.payload)
          }
        })

        socket.on(`${usuario.tenantId}:ticketList`, async data => {
          let verify = []
          if (data.type === 'notification:new') {
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
            }
            try {
              const data_noti = await ConsultarTickets(params)
              updateNotificationsP(data_noti.data)
              verify = data_noti
            } catch (err) {
              // this.$notificarErro('Algum problema', err)
              toast.error(`Algum problema, ${err}`)
            }
            // Faz verificação para se certificar que notificação pertence a fila do usuário
            var pass_noti = false
            verify.data.tickets.forEach(element => {
              pass_noti = element.id == data.payload.id ? true : pass_noti
            })
            // Exibe Notificação
            if (pass_noti) {
              const message = new Notification('Novo cliente pendente', {
                body: 'Cliente: ' + data.payload.contact.name,
                tag: 'simple-push-demo-notification',
              })
              console.log(message)
            }
          }
        })
        socket.on(`${usuario.tenantId}:contactList`, data => {
          updateContatos(data.payload)
        })
      })
    }

    return () => {
      // Desconectar o socket ao desmontar o componente
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null // Limpa a referência
      }
    }
  }, [])
}
