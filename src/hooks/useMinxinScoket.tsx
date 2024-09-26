import { useCallback, useEffect, useRef, useState } from "react";
import { socketIO } from "../utils/socket";
import { useAtendimentoTicketStore } from "../store/atendimentoTicket";
import { useContatosStore } from "../store/contatos";
import type { Socket } from "socket.io-client";
import checkTicketFilter from "../utils/checkTicketFilter";
import { ConsultarTickets } from "../services/tickets";
import { useNotificationsStore } from "../store/notifications";

import { toast } from "sonner";
import { eventEmitter } from "../pages/Atendimento/ChatMenssage";
import { eventEmitter as eventNotification } from '../pages/Atendimento/index'
import { useWebSocketStore } from "../store/socket";




const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
const userId = +localStorage.getItem('userId');


export const useMixinSocket = () => {

    const ticketFocado = useAtendimentoTicketStore(state => state.ticketFocado)
    const setTicketFocado = useAtendimentoTicketStore(state => state.setTicketFocado)
    const updateMessages = useAtendimentoTicketStore(state => state.updateMessages)
    const updateMessageStatus = useAtendimentoTicketStore(state => state.updateMessageStatus)
    const updateTicket = useAtendimentoTicketStore(state => state.updateTicket)

    const updateContatos = useContatosStore(s => s.updateContact)
    const [loading, setLoading] = useState(false)
    const socketRef = useRef<Socket | null>(null);

    const { ws, getWs, setWs } = useWebSocketStore()
    const updateNotifications = useNotificationsStore(s => s.updateNotifications)
    const updateNotificationsP = useNotificationsStore(
        s => s.updateNotificationsP
    )
    const scrollToBottom = () => {
        setTimeout(() => {
            eventEmitter.emit('scrollToBottomMessageChat')
        }, 200)

    };


    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {

        let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null
        if (!getWs()) {
            socket = socketIO()
            setWs(socket);
            socketRef.current = socket
            // Token inválido, desconecta e redireciona
            socket?.on(`tokenInvalid:${socket.id}`, () => {
                socket.disconnect();
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('profile');
                localStorage.removeItem('userId');
                localStorage.removeItem('usuario');
                setTimeout(() => {
                    window.location.href = '/login'
                }, 1000);
            });
        }
        return () => {
            if (socket) {
                // socket.disconnect()
                console.log('Socket disconnected')
            }
        };
    }, [getWs, setWs])


    const handlerNotifications = (data: any) => {
        eventNotification.emit('handlerNotifications', data)
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const socketTicket = useCallback(() => {
        const socket = socketRef.current;
        socket?.on('connect', () => {
            socket?.on(`${usuario.tenantId}:ticket`, (data) => {
                if (data.action === 'update' && data.ticket.userId === userId) {
                    if (data.ticket.status === 'open' && !data.ticket.isTransference) {
                        setTicketFocado(data.ticket)
                    }
                }
            });
        });
    }, [socketRef]);
    // Método para escutar a lista de tickets
    const socketTicketListNew = useCallback(() => {
        const socket = socketRef.current;
        socket?.on('connect', () => {
            socket.on(`${usuario.tenantId}:ticketList`, async data => {
                if (data.type === 'chat:create') {

                    scrollToBottom()
                    if (
                        !data.payload.read &&
                        (data.payload.ticket.userId === userId || !data.payload.ticket.userId) &&
                        data.payload.ticket.id !== ticketFocado.id
                    ) {
                        if (checkTicketFilter(data.payload.ticket)) {

                            handlerNotifications(data.payload)
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

                    updateTicket(data.payload)
                    updateNotifications(data.payload)
                }
            })
            socket?.on(`${usuario.tenantId}:ticketList`, async data => {
                let verify = []
                if (data.type === 'notification:new') {
                    // console.log(data)
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
                        includeNotQueueDefined: true
                        // date: new Date(),
                    }
                    try {
                        const data_noti = await ConsultarTickets(params)

                        updateNotificationsP(data_noti.data)
                        verify = data_noti
                    } catch (err) {
                        toast.message('Algum problema ao consultar tickets', {
                            description: `${err}`,
                            position: 'top-center'

                        })
                        console.error(err)
                    }
                    // Faz verificação para se certificar que notificação pertence a fila do usuário
                    let pass_noti = false
                    verify.data.tickets.forEach((element) => { pass_noti = (element.id === data.payload.id ? true : pass_noti) })
                    // Exibe Notificação
                    if (pass_noti) {
                        const message = new Notification('Novo cliente pendente', {
                            body: 'Cliente: ' + data.payload.contact.name,
                            tag: 'simple-push-demo-notification'
                        })
                    }
                }
            })
            socket.on(`${usuario.tenantId}:contactList`, data => {
                updateContatos(data.payload)
            })
        })

    }, [socketRef]);

    function socketTicketList() {

        socketTicketListNew()
    }
    const socketDisconnect = useCallback(() => {
        socketRef.current = null;

    }, []);

    return { socketTicket, socketDisconnect, socketTicketList }
}