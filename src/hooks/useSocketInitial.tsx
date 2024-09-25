import { useCallback, useEffect, useRef, useState } from "react";
import { socketIO } from "../utils/socket";
import { useNotificationsStore } from "../store/notifications";
import { useWhatsappStore } from "../store/whatsapp";
import { toast } from "sonner";
import { ConsultarTickets } from "../services/tickets";
import { parseISO } from "date-fns";
import { orderBy } from "lodash";
import { useAtendimentoTicketStore } from "../store/atendimentoTicket";
import { useContatosStore } from "../store/contatos";
import { useWebSocketStore } from "../store/socket";
import { useUsersAppStore } from "../store/usersApp";
// import { EventEmitter } from "events";

// export const eventEmitter = new EventEmitter();

export const useSocketInitial = () => {
    const { ws, setWs, getWs } = useWebSocketStore();
    const wsRef = useRef<WebSocket | null>(null);
    const updateWhatsapps = useWhatsappStore(state => state.updateWhatsApps)
    const deleteWhatsApp = useWhatsappStore(state => state.deleteWhatsApp)
    const updateSession = useWhatsappStore(state => state.updateSession)
    const updateNotifications = useNotificationsStore(state => state.updateNotifications)
    const updateNotificationsP = useNotificationsStore(state => state.updateNotificationsP)
    const updateTicket = useAtendimentoTicketStore(state => state.updateTicket)
    const loadTickets = useAtendimentoTicketStore(state => state.loadTickets)
    const updateMessages = useAtendimentoTicketStore(state => state.updateMessages)
    const updateContact = useContatosStore(state => state.updateContact)
    const updateMessageStatus = useAtendimentoTicketStore(state => state.updateMessageStatus)

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const userId = +localStorage.getItem("userId");

    const { setUsersApp } = useUsersAppStore()
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (!getWs()) {
            const socket = socketIO()
            setWs(socket);
            wsRef.current = socket;
            socket.emit(`${usuario.tenantId}:joinNotification`)

            socket.io.on(`${usuario.tenantId}:whatsapp`, data => {
                if (data.action === 'update') {
                    updateWhatsapps(data.whatsapp)
                }
            })
            socket.on(`tokenInvalid:${socket.id}`, () => {
                socket.disconnect();
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("profile");
                localStorage.removeItem("userId");
                localStorage.removeItem("usuario");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1000);
            });

            socket.on(`${usuario.tenantId}:whatsapp`, data => {
                console.log('socket ON: DELETE_WHATSAPPS')
                if (data.action === 'delete') {
                    deleteWhatsApp(data.whatsappId)
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

                if (data.action === 'loadingscreen') {
                    toast.info(`A conexão com o WhatsApp está sendo sincronizada. Conexão: ${data.session.name} - ${data.percent}%.`, {
                        position: 'top-right'
                    })

                }

                if (data.action === 'readySession') {
                    toast.info(`A conexão com o WhatsApp está pronta e o mesmo está habilitado para enviar e receber mensagens. Conexão: ${data.session.name}. Número: ${data.session.number}.`, {
                        position: 'top-right'
                    })
                }
            })
            let notification: (() => void) | null = null;
            socket.on(`${usuario.tenantId}:importMessages`, data => {
                console.log('socket ON: UPDATE_IMPORT')
                if (data.action === 'update') {
                    if (data.status.all === -1 && data.status.this === -1) {
                        if (notification) {
                            notification();
                        }
                        toast.info(`Aguarde, iniciando o processo de importação de mensagens do dispositivo`, {
                            position: 'top-right'
                        })

                    } else {
                        if (notification) {
                            notification();
                        }
                        toast.info(`Importando mensagens ${data.status.this} de ${data.status.all} em ${data.status.date}`, {
                            position: 'top-right'
                        })
                    }
                }
                if (data.action === 'refresh') {
                    toast.info(`Atualizando mensagens ${data} do dispositivo`, {
                        position: 'top-right'
                    })
                }
            })
            socket.on(`${usuario.tenantId}:change_battery`, data => {
                console.log('socket ON: CHANGE_BATTERY')
                toast.info(`Bateria do celular do whatsapp ${data.batteryInfo.sessionName} está com bateria em ${data.batteryInfo.battery}%. Necessário iniciar carregamento.`, {
                    position: 'top-right'
                })

            })

            socket.on(`${usuario.tenantId}:ticketList`, async (data) => {
                if (data.type === 'ticket:update') {
                    console.log('socket ON: TICKET:UPDATE')
                    try {
                        const params = {
                            searchParam: '',
                            pageNumber: 1,
                            status: ['open', 'pending'],
                            showAll: false,
                            count: null,
                            queuesIds: [],
                            withUnreadMessages: [true, false],
                            isNotAssignedUser: [true, false],
                            includeNotQueueDefined: [true, false]
                            // date: new Date(),
                        }
                        const { data } = await ConsultarTickets(params)
                        updateNotifications(data)

                        const orderTickets = (tickets) => {
                            const newTickes = orderBy(tickets, (obj) => parseISO(obj.lastMessageAt || obj.updatedAt), ['asc'])
                            return [...newTickes]
                        }
                        const newTickets = orderTickets(data.tickets)
                        // console.log('try ORDER_TICKETS', newTickets.map(ticket => ({ id: ticket.id, lastMessageAt: ticket.lastMessageAt })))
                        setTimeout(() => {
                            // console.log('try LOAD_TICKETS')
                            loadTickets(newTickets)
                        }, 200);
                        setTimeout(() => {
                            // console.log('try UPDATE_TICKET')
                            updateTicket(newTickets);
                        }, 400);
                        setTimeout(async () => {
                            // console.log('try UPDATE_CONTACT')
                            updateContact(newTickets);
                            // this.$store.commit('UPDATE_NOTIFICATIONS', data)
                        }, 600);
                    } catch (err) {
                        console.log('error try', err)
                    }
                }
                if (data.type === 'ticket:create') {
                    console.log('socket ON: TICKET:CREATE')
                    try {
                        const params = {
                            searchParam: '',
                            pageNumber: 1,
                            status: ['open', 'pending'],
                            showAll: false,
                            count: null,
                            queuesIds: [],
                            withUnreadMessages: false,
                            isNotAssignedUser: false,
                            includeNotQueueDefined: true
                            // date: new Date(),
                        }
                        const { data } = await ConsultarTickets(params)

                        updateNotifications(data)
                        const orderTickets = (tickets) => {
                            const newTickes = orderBy(tickets, (obj) => parseISO(obj.lastMessageAt || obj.updatedAt), ['asc'])
                            return [...newTickes]
                        }
                        const newTickets = orderTickets(data.tickets)
                        // console.log('try ORDER_TICKETS', newTickets.map(ticket => ({ id: ticket.id, lastMessageAt: ticket.lastMessageAt })))
                        setTimeout(() => {
                            // console.log('try LOAD_TICKETS')
                            loadTickets(newTickets);
                        }, 200);
                        setTimeout(() => {
                            // console.log('try UPDATE_TICKET')
                            updateTicket(newTickets);
                        }, 400);
                        setTimeout(() => {
                            // console.log('try UPDATE_CONTACT')
                            updateContact(newTickets);
                            // this.$store.commit('UPDATE_NOTIFICATIONS', data)
                        }, 600);
                    } catch (err) {
                        console.log('error try', err)
                    }
                }
            })
            socket.on(`${usuario.tenantId}:ticketList`, async (data) => {

                if (data.type === 'chat:create') {
                    console.log('socket ON: CHAT:CREATE')
                    // if (data.payload.ticket.userId !== userId) return
                    // if (data.payload.fromMe) return
                    if (data.payload.ticket.userId === userId) {
                        new Notification('Contato: ' + data.payload.ticket.contact.name, {
                            body: 'Mensagem: ' + data.payload.body,
                            tag: 'simple-push-demo-notification',
                            image: data.payload.ticket.contact.profilePicUrl,
                            icon: data.payload.ticket.contact.profilePicUrl,
                        })
                    }
                    updateMessages(data.payload)
                    const params = {
                        searchParam: '',
                        pageNumber: 1,
                        status: ['open', 'pending'],
                        showAll: false,
                        count: null,
                        queuesIds: [],
                        withUnreadMessages: false,
                        isNotAssignedUser: false,
                        includeNotQueueDefined: true
                        // date: new Date(),
                    }

                    try {
                        const { data } = await ConsultarTickets(params)

                        updateNotifications(data)
                        const orderTickets = (tickets) => {
                            console.log('inside')
                            const newTickes = orderBy(tickets, (obj) => parseISO(obj.lastMessageAt || obj.updatedAt), ['asc'])
                            return [...newTickes]
                        }

                        const newTickets = orderTickets(data.tickets)
                        setTimeout(() => {
                            // this.$store.commit('LOAD_TICKETS', newTickets);
                            // loadTickets(newTickets)
                        }, 200);
                        setTimeout(() => {
                            // this.$store.commit('UPDATE_TICKET', newTickets);
                            // updateTicket(newTickets)
                            try {
                                updateMessages(data.payload)
                            } catch (e) {
                            }
                        }, 400);
                        setTimeout(() => {
                            updateContact(newTickets);
                            updateNotifications(data);
                        }, 600);

                    } catch (err) {
                        console.log('error try', err)
                    }
                }
            })
            socket.on(`${usuario.tenantId}:ticketList`, async data => {

                const verify = []
                if (data.type === 'notification:new') {
                    const params = {
                        searchParam: '',
                        pageNumber: 1,
                        status: ['open', 'pending'],
                        showAll: false,
                        count: null,
                        queuesIds: [],
                        withUnreadMessages: false,
                        isNotAssignedUser: false,
                        includeNotQueueDefined: true
                    }
                    try {
                        const data_noti = await ConsultarTickets(params)
                        updateNotificationsP(data_noti.data)
                        verify.push(data_noti)
                    } catch (err) {
                        toast.error('Algum problema')
                        console.error(err)
                    }
                    let pass_noti = false
                    // biome-ignore lint/complexity/noForEach: <explanation>
                    verify.data.tickets.forEach((element) => { pass_noti = (element.id === data.payload.id ? true : pass_noti) })
                    if (pass_noti) {
                        const message = new Notification('Novo cliente pendente', {
                            // biome-ignore lint/style/useTemplate: <explanation>
                            body: 'Cliente: ' + data.payload.contact.name,
                            tag: 'simple-push-demo-notification'
                        })
                        console.log(message)
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
                    console.log('socket ON: CONTACT:UPDATE')
                    updateContact(data.payload)
                }
            })

            socket.on(`${usuario.tenantId}:msg-private-msg`, data => {
                console.log('PRIVATE_RECEIVED_MESSAGE')
                // if ((data.data.receiverId == usuario.userId || data.data.groupId != null) && data.action === 'update') {
                //     this.$store.commit('PRIVATE_RECEIVED_MESSAGE', data)
                // }
            })
            socket.on(`${usuario.tenantId}:chat:updateOnlineBubbles`, data => {
                setUsersApp(data)
                //   this.$store.commit('SET_USERS_APP', data)
            })
            socket.on(`${usuario.tenantId}:unread-msg-private-msg`, data => {
                console.log('UNREAD_MESSAGE_PRIVATE_RECEIVED')
                // if (data.data.senderId == usuario.userId && data.action === 'update') {
                //     this.$store.commit('UNREAD_MESSAGE_PRIVATE_RECEIVED', data)
                // }
            })

            socket.on(`${usuario.tenantId}:msg-private-msg-notificacao`, data => {
                console.log('NOTIFICATION_RECEIVED_PRIVATE_MESSAGE')
                // if ((data.data.receiverId == usuario.userId || data.data.groupId != null) && data.action === 'update') {
                //     this.$store.commit('NOTIFICATION_RECEIVED_PRIVATE_MESSAGE', data)
                // }
            })

            socket.on('verifyOnlineUsers', data => {
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
            if (wsRef.current) {
                // wsRef.current.close();
                console.log('Conexão WebSocket fechada');
            }
        };
    }, [getWs, setWs]);
    return ws;
};
