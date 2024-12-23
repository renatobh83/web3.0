import { useEffect } from 'react'
import { socketIO } from '../utils/socket'
import { useNotificationsStore } from '../store/notifications'
import { useWhatsappStore } from '../store/whatsapp'
import { toast } from 'sonner'
import { ConsultarTickets } from '../services/tickets'
import { useAtendimentoTicketStore } from '../store/atendimentoTicket'
import { useContatosStore } from '../store/contatos'
import { useWebSocketStore } from '../store/socket'
import { useUsersAppStore } from '../store/usersApp'
import { eventEmitterScrool } from '../pages/Atendimento/ChatMenssage'
import { useAuth } from '../context/AuthContext'
import type { Socket } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import { Errors } from '../utils/error'
import { useUsuarioStore } from '../store/usuarios'
import { orderTickets } from '../utils/ordertTickets'
// import { EventEmitter } from "events";
import { eventEmitter as eventNotification } from '../pages/Atendimento/index'
import { eventEmitterMain } from '../layout/MainLayout'
import checkTicketFilter from '../utils/checkTicketFilter'
import { ListarCampanhas } from '../services/campanhas'
import { useApplicationStore } from '../store/application'
// export const eventEmitter = new EventEmitter();

export const useSocketInitial = () => {
  const { setWs, getWs, resetWs } = useWebSocketStore()

  // const wsRef = useRef<WebSocket | null>(null)
  const updateWhatsapps = useWhatsappStore(state => state.updateWhatsApps)
  const deleteWhatsApp = useWhatsappStore(state => state.deleteWhatsApp)
  const updateSession = useWhatsappStore(state => state.updateSession)
  const updateNotifications = useNotificationsStore(
    state => state.updateNotifications
  )
  const updateNotificationsP = useNotificationsStore(
    state => state.updateNotificationsP
  )
  const updateTicket = useAtendimentoTicketStore(state => state.updateTicket)
  const loadTickets = useAtendimentoTicketStore(state => state.loadTickets)
  const updateMessages = useAtendimentoTicketStore(
    state => state.updateMessages
  )
  const updateContact = useContatosStore(state => state.updateContact)
  const deleteContact = useContatosStore(state => state.deleteContact)
  const updateMessageStatus = useAtendimentoTicketStore(
    state => state.updateMessageStatus
  )

  const { setUsersApp } = useUsersAppStore()
  const { decryptData } = useAuth()
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

  const { AbrirChatMensagens, resetUnread } = useAtendimentoTicketStore()
  const { editarUsuario, insertNewUser, toggleModalUsuario, deletarUsuario } =
    useUsuarioStore()
  const { setCampanhas } = useApplicationStore()
  const usuario = JSON.parse(decryptData('usuario'))
  const userId = +localStorage.getItem('userId')
  let socket: Socket | null = null

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!getWs()) {
      socket = socketIO()
      console.log('Socket connect', location.pathname)
      setWs(socket)

      socket.emit(`${usuario.tenantId}:joinNotification`)
      socket.on(`${usuario.tenantId}:whatsapp`, data => {
        // socket.io.on(`${usuario.tenantId}:whatsapp` as string, data => {
        if (data.action === 'update') {
          updateWhatsapps(data.whatsapp);
        }
      });
      socket.on(`tokenInvalid:${socket.id}`, () => {
        socket?.disconnect()
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('profile')
        localStorage.removeItem('userId')
        localStorage.removeItem('usuario')
        toast.error("Faça um novo login")
        setTimeout(() => {
          window.location.href = '/login'
        }, 1000)
      })

      socket.on(`${usuario.tenantId}:whatsapp`, data => {
        console.log('socket ON: DELETE_WHATSAPPS')
        if (data.action === 'delete') {
          deleteWhatsApp(data.whatsappId)
        }
      })
      socket.on(`${usuario.tenantId}:user`, data => {
        if (data.action === 'update') {
          editarUsuario(data.user)
          toggleModalUsuario()
        }
        if (data.action === 'create') {
          insertNewUser(data.user)
          toggleModalUsuario()
        }
        if (data.action === 'delete') {
          deletarUsuario(Number(data.userId))
        }
      })
      socket.on(`${usuario.tenantId}:whatsappSession`, data => {
        console.log('socket ON: UPDATE_SESSION')
        if (data.action === 'update') {
          updateSession(data.session)
          // eventEmitter.emit('UPDATE_SESSION', data.session);
          // console.log('Emit')
          //   this.$root.$emit('UPDATE_SESSION', data.session)
        }
        console.log(data)
        if (data.action === 'loadingscreen') {
          toast.info(
            `A conexão com o WhatsApp está sendo sincronizada. Conexão: ${data.session.name} - ${data.percent}%.`,
            {
              position: 'top-center',
            }
          )
        }

        if (data.action === 'readySession') {

          toast.info(
            `A conexão com o WhatsApp está pronta e o mesmo está habilitado para enviar e receber mensagens. Conexão: ${data.session.name}.
            Número: ${data.session.number}.`,
            {
              position: 'top-center',
            }
          )
        }
      })
      // let notification: (() => void) | null = null
      socket.on(`${usuario.tenantId}:importMessages`, data => {
        console.log('socket ON: UPDATE_IMPORT')
        if (data.action === 'update') {
          if (data.status.all === -1 && data.status.this === -1) {
            // if (notification) {
            //   notification()
            // }
            toast.info(
              'Aguarde, iniciando o processo de importação de mensagens do dispositivo',
              {
                position: 'top-center',
              }
            )
          } else {
            // if (notification) {
            //   // notification()
            // }
            toast.info(
              `Importando mensagens ${data.status.this} de ${data.status.all} em ${data.status.date}`,
              {
                position: 'top-center',
              }
            )
          }
        }
        if (data.action === 'refresh') {
          toast.info(`Atualizando mensagens ${data} do dispositivo`, {
            position: 'top-center',
          })
        }
      })
      socket.on(`${usuario.tenantId}:change_battery`, data => {
        console.log('socket ON: CHANGE_BATTERY')
        toast.info(
          `Bateria do celular do whatsapp ${data.batteryInfo.sessionName} está com bateria em ${data.batteryInfo.battery}%. Necessário iniciar carregamento.`,
          {
            position: 'top-center',
          }
        )
      })

      socket.on(`${usuario.tenantId}:ticketList`, async data => {
        if (data.type === 'ticket:update') {
          // console.log('socket ON: ticket:update', data)
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

          const paramsPending = {
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
            const response = await ConsultarTickets(paramsPending)
            updateNotificationsP(response.data)
          } catch (error) { }
          const paramsOpen = {
            searchParam: '',
            pageNumber: 1,
            status: ['open'],
            showAll: false,
            count: null,
            queuesIds: [],
            withUnreadMessages: false,
            isNotAssignedUser: false,
            includeNotQueueDefined: true,
          }
          try {
            const response = await ConsultarTickets(paramsOpen)
            updateNotifications(response.data)
          } catch (error) { }
        }
        if (data.type === 'campaign:update') {
          toast.info('Data de inicio alterada devido a esta fora do horario ou final de semana')
        }
        if (data.type === 'campaign:send') {
          setTimeout(async () => {
            const { data } = await ListarCampanhas()
            setCampanhas(data)
          }, 200)
          setTimeout(async () => {
            const { data } = await ListarCampanhas()
            setCampanhas(data)
          }, 1000)

        }
        // if (data.type === 'ticket:create') {
        //   console.log('socket ON: TICKET:CREATE 1')
        //   try {
        //     const params = {
        //       searchParam: '',
        //       pageNumber: 1,
        //       status: ['open', 'pending'],
        //       showAll: false,
        //       count: null,
        //       queuesIds: [],
        //       withUnreadMessages: false,
        //       isNotAssignedUser: false,
        //       includeNotQueueDefined: true,
        //       // date: new Date(),
        //     }
        //     const response = await ConsultarTickets(params)

        //     updateNotifications(response.data)
        //     const orderTickets = tickets => {
        //       const newTickes = orderBy(
        //         tickets,
        //         obj => parseISO(obj.lastMessageAt || obj.updatedAt),
        //         ['asc']
        //       )
        //       return [...newTickes]
        //     }
        //     const newTickets = orderTickets(response.data.tickets)
        //     // console.log('try ORDER_TICKETS', newTickets.map(ticket => ({ id: ticket.id, lastMessageAt: ticket.lastMessageAt })))
        //     setTimeout(() => {
        //       loadTickets(newTickets)
        //     }, 200)
        //     setTimeout(() => {
        //       updateTicket(newTickets)
        //     }, 400)
        //     setTimeout(() => {
        //       // console.log('try UPDATE_CONTACT')
        //       updateContact(newTickets)
        //       // this.$store.commit('UPDATE_NOTIFICATIONS', data)
        //     }, 600)
        //   } catch (err) {
        //     console.log('error try', err)
        //   }
        // }
      })
      socket.on(`${usuario.tenantId}:messageUpdate`, async data => {
        console.log(data)
      })
      socket.on(`${usuario.tenantId}:ticketList`, async data => {
        if (data.type === 'chat:create') {
          eventEmitterScrool.emit('scrollToBottomMessageChat')
          // console.log('socket ON: CHAT:CREATE - nova mensagem ', data)
          // if (data.payload.ticket.userId !== userId) return
          // if (data.payload.fromMe) return
          if (checkTicketFilter(data.payload.ticket) && data.payload.mediaType !== "call_log") {

            if (data.payload.ticket.userId === userId && !data.payload.fromMe) {
              if (location.pathname.startsWith('/atendimento')) {
                eventNotification.emit('handlerNotifications', data.payload)
              } else {
                eventEmitterMain.emit('handlerNotifications', data.payload)
              }
            }
            if (!data.payload.ticket.userId && !data.payload.fromMe) {
              if (location.pathname.startsWith('/atendimento')) {
                eventNotification.emit('handlerNotifications', data.payload)
              } else {
                eventEmitterMain.emit('handlerNotifications', data.payload)
              }
            }
          }
          updateMessages(data.payload)

          // const paramsOpen = {
          //   searchParam: '',
          //   pageNumber: 1,
          //   status: ['open'],
          //   showAll: false,
          //   count: null,
          //   queuesIds: [],
          //   withUnreadMessages: false,
          //   isNotAssignedUser: false,
          //   includeNotQueueDefined: true,

          // }
          // try {
          //   const response = await ConsultarTickets(paramsOpen)

          //   updateNotifications(response.data)
          //   const orderTickets = tickets => {
          //     const newTickes = orderBy(
          //       tickets,
          //       obj => parseISO(obj.lastMessageAt || obj.updatedAt),
          //       ['asc']
          //     )
          //     return [...newTickes]
          //   }
          //   const newTickets = orderTickets(response.data.tickets)
          //   setTimeout(() => {
          //     // this.$store.commit('LOAD_TICKETS', newTickets);
          //     loadTickets(newTickets)
          //   }, 200)
          //   setTimeout(() => {
          //     // this.$store.commit('UPDATE_TICKET', newTickets);
          //     updateTicket(newTickets)
          //     try {
          //       updateMessages(data.payload)
          //     } catch (e) { }
          //   }, 400)
          //   setTimeout(() => {
          //     updateContact(newTickets)
          //     updateNotifications(response.data)
          //   }, 600)
          //   try {
          //     eventEmitterScrool.emit('scrollToBottomMessageChat')
          //   } catch (error) { }
          // } catch (err) {
          //   console.log('error try', err)
          // }
          // const paramsPending = {
          //   searchParam: '',
          //   pageNumber: 1,
          //   status: ['pending'],
          //   showAll: false,
          //   count: null,
          //   queuesIds: [],
          //   withUnreadMessages: false,
          //   isNotAssignedUser: false,
          //   includeNotQueueDefined: true,

          // }
          // try {
          //   const response = await ConsultarTickets(paramsPending)

          //   updateNotificationsP(response.data)
          //   const orderTickets = tickets => {
          //     const newTickes = orderBy(
          //       tickets,
          //       obj => parseISO(obj.lastMessageAt || obj.updatedAt),
          //       ['asc']
          //     )
          //     return [...newTickes]
          //   }
          //   const newTickets = orderTickets(response.data.tickets)
          //   setTimeout(() => {
          //     // this.$store.commit('LOAD_TICKETS', newTickets);
          //     loadTickets(newTickets)
          //   }, 200)
          //   setTimeout(() => {
          //     // this.$store.commit('UPDATE_TICKET', newTickets);
          //     updateTicket(newTickets)
          //     try {
          //       updateMessages(data.payload)
          //     } catch (e) { }
          //   }, 400)
          //   setTimeout(() => {
          //     updateContact(newTickets)
          //     updateNotificationsP(response.data)
          //   }, 600)
          //   try {
          //     eventEmitterScrool.emit('scrollToBottomMessageChat')
          //   } catch (error) { }
          // } catch (err) {
          //   console.log('error try', err)
          // }
        }
      })
      socket.on(`${usuario.tenantId}:ticketList`, async data => {
        let verify = []
        if (data.type === 'notification:new') {
          console.log('socket ON: notification:New')
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
            verify = data_noti.data.tickets
          } catch (err) {
            toast.message('Algum problema', {
              description: `${err}`,
              position: 'top-center',
            })
            console.error(err)
          }
          let pass_noti = false

          // biome-ignore lint/complexity/noForEach: <explanation>
          verify?.forEach(element => {
            pass_noti = element.id === data.payload.id ? true : pass_noti
          })

          if (pass_noti) {
            eventEmitterMain.emit('playSoundNotification')
            const message = new Notification('Novo cliente pendente', {
              // biome-ignore lint/style/useTemplate: <explanation>
              body: 'Cliente: ' + data.payload.contact.name,
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
      socket.on(`${usuario.tenantId}:ticketList`, async data => {
        if (data.type === 'chat:ack' || data.type === 'chat:delete') {
          //   this.$store.commit('UPDATE_MESSAGE_STATUS', data.payload)
          updateMessageStatus(data.payload)
        }

        if (data.type === 'chat:update') {
          updateMessages(data.payload)
        }
      })
      socket.on(`${usuario.tenantId}:contactList`, data => {
        if (data.type === 'contact:update') {
          // console.log('socket ON: CONTACT:UPDATE')
          updateContact(data.payload)
        }
        if (data.type === 'contact:delete') {
          console.log('socket ON: CONTACT:DELETE')
          deleteContact(data.payload.id)
        }
      })

      socket.on(`${usuario.tenantId}:msg-private-msg`, _data => {
        console.log('PRIVATE_RECEIVED_MESSAGE')
        // if ((data.data.receiverId == usuario.userId || data.data.groupId != null) && data.action === 'update') {
        //     this.$store.commit('PRIVATE_RECEIVED_MESSAGE', data)
        // }
      })
      socket.on(`${usuario.tenantId}:chat:updateOnlineBubbles`, data => {
        setUsersApp(data)
        //   this.$store.commit('SET_USERS_APP', data)
      })
      socket.on(`${usuario.tenantId}:unread-msg-private-msg`, _data => {
        console.log('UNREAD_MESSAGE_PRIVATE_RECEIVED')
        // if (data.data.senderId == usuario.userId && data.action === 'update') {
        //     this.$store.commit('UNREAD_MESSAGE_PRIVATE_RECEIVED', data)
        // }
      })

      socket.on(`${usuario.tenantId}:msg-private-msg-notificacao`, _data => {
        console.log('NOTIFICATION_RECEIVED_PRIVATE_MESSAGE')
        // if ((data.data.receiverId == usuario.userId || data.data.groupId != null) && data.action === 'update') {
        //     this.$store.commit('NOTIFICATION_RECEIVED_PRIVATE_MESSAGE', data)
        // }
      })

      socket.on('verifyOnlineUsers', _data => {
        console.log('LIST_USERS_PRIVATE')
        // this.$store.commit('LIST_USERS_PRIVATE', { action: 'updateAllUsers', data: {} })
        // this.socket.emit(`${usuario.tenantId}:userVerified`, usuario)
      })

      socket.on(`${usuario.tenantId}:user-online`, data => {
        if (data.action === 'update' && data.data.userId !== usuario.userId) {
          // this.$store.commit('USER_CHAT_UPDATE', data)
          console.log('USER_CHAT_UPDATE')
        }
      })

      socket.on(`${usuario.tenantId}:updateStatusUser`, async () => {
        console.log('LIST_USERS_PRIVATE')
        // const { data } = await ListarUsuariosChatPrivado()
        // this.$store.commit('LIST_USERS_PRIVATE', { action: 'create', data: data.users })
      })
    }
    return () => {
      console.log('useSocketInitial fechada')

      //update
      resetWs()
      socket?.disconnect()
    }
  }, [getWs, setWs])
}

