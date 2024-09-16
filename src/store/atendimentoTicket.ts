import { create } from "zustand";
import { orderBy } from "lodash";
import { parseISO } from "date-fns";

import { toast } from "sonner";

import { ConsultarDadosTicket, LocalizarMensagens } from "../services/tickets";

interface Ticket {
  lastMessageAt: any;
  updatedAt: any;
  user: any;
  username: any;
  contactId: any;
  id: number;
  name: string;
  lastMessage: string;
  profilePicUrl: string;
  userId?: number;
  isGroup?: boolean;
  status?: string;
  autoReplyId?: number;
  queueId?: number;
  contact?: any;
  unreadMessages?: number;
}

interface AtendimentoTicketState {
  chatTicketDisponivel: boolean;
  tickets: Ticket[];
  ticketsLocalizadosBusca: Ticket[];
  ticketFocado: Ticket;
  hasMore: boolean;
  contatos: any[];
  mensagens: any[];
  redirectToChat?: (ticketId: string) => void;
}

interface AtendimentoTicketActions {
  setHasMore: (payload: boolean) => void;
  loadTickets: (payload: Ticket[]) => void;
  resetTickets: () => void;
  resetUnread: (payload: { ticketId: string }) => void;
  updateTicket: (payload: Ticket) => void;
  deleteTicket: (ticketId: string) => void;
  updateTicketFocadoContact: (payload: any) => void;
  updateContact: (payload: any) => void;
  setTicketFocado: (payload: Ticket) => void;
  loadInitialMessages: (payload: {
    messages: any[];
    messagesOffLine: any[];
  }) => void;
  loadMoreMessages: (payload: {
    messages: any[];
    messagesOffLine: any[];
  }) => void;
  updateMessages: (payload: any) => void;
  resetMessages: () => void;
  LocalizarMensagensTicket: (params: {
    ticketId: string;
    pageNumber: number;
  }) => Promise<void>;
  redirectToChat: (ticketId: string) => void;
  AbrirChatMensagens: (data: { id: string }) => Promise<void>;
}

const orderMessages = (messages: any[]) => {
  const newMessages = orderBy(
    messages,
    (obj) => parseISO(obj.timestamp || obj.createdAt),
    ["asc"]
  );
  return [...newMessages];
};

const orderTickets = (tickets: Ticket[]) => {
  const newTickets = orderBy(
    tickets,
    (obj) => parseISO(obj.lastMessageAt || obj.updatedAt),
    ["asc"]
  );
  return [...newTickets];
};

const checkTicketFilter = (ticket: Ticket) => {
  const filtroPadrao = {
    searchParam: "",
    pageNumber: 1,
    status: ["open", "pending"],
    showAll: false,
    count: null,
    queuesIds: [],
    withUnreadMessages: false,
    isNotAssignedUser: false,
    includeNotQueueDefined: true,
    // date: new Date(),
  };

  const NotViewTicketsChatBot = () => {
    const configuracoes = JSON.parse(localStorage.getItem("configuracoes"));
    const conf = configuracoes?.find(
      (c: { key: string }) => c.key === "NotViewTicketsChatBot"
    );
    return conf?.value === "enabled";
  };

  const DirectTicketsToWallets = () => {
    const configuracoes = JSON.parse(localStorage.getItem("configuracoes"));
    const conf = configuracoes?.find(
      (c: { key: string }) => c.key === "DirectTicketsToWallets"
    );
    return conf?.value === "enabled";
  };

  const isNotViewAssignedTickets = () => {
    const configuracoes = JSON.parse(localStorage.getItem("configuracoes"));
    const conf = configuracoes?.find(
      (c: { key: string }) => c.key === "NotViewAssignedTickets"
    );
    return conf?.value === "enabled";
  };
  const filtros =
    JSON.parse(localStorage.getItem("filtrosAtendimento")) || filtroPadrao;
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const UserQueues = JSON.parse(localStorage.getItem("queues"));
  const filasCadastradas = JSON.parse(
    localStorage.getItem("filasCadastradas") || "[]"
  );
  const profile = localStorage.getItem("profile");
  const isAdminShowAll = profile === "admin" && filtros.showAll;
  const isQueuesTenantExists = filasCadastradas.length > 0;

  const userId = usuario?.userId || +localStorage.getItem("userId");

  // Verificar se é admin e se está solicitando para mostrar todos
  if (isAdminShowAll) {
    // console.log('isAdminShowAll', isAdminShowAll)
    return true;
  }

  // se ticket for um grupo, todos podem verificar.
  if (ticket.isGroup) {
    // console.log('ticket.isGroup', ticket.isGroup)
    return true;
  }

  // se status do ticket diferente do staatus filtrado, retornar false
  if (filtros.status.length > 0 && !filtros.status.includes(ticket.status)) {
    // console.log('Status ticket', filtros.status, ticket.status)
    return false;
  }

  // verificar se já é um ticket do usuário
  if (ticket?.userId == userId) {
    // console.log('Ticket do usuário', ticket?.userId, userId)
    return true;
  }

  // Não visualizar tickets ainda com o Chatbot
  // desde que ainda não exista usuário ou fila definida
  if (NotViewTicketsChatBot() && ticket.autoReplyId) {
    if (!ticket?.userId && !ticket.queueId) {
      console.log(
        "NotViewTicketsChatBot e o ticket está sem usuário e fila definida"
      );
      return false;
    }
  }

  // Se o ticket não possuir fila definida, checar o filtro
  // permite visualizar tickets sem filas definidas é falso.
  // if (isQueuesTenantExists && !ticket.queueId && !filtros.includeNotQueueDefined) {
  //   console.log('filtros.includeNotQueueDefined', ticket.queueId, !filtros.includeNotQueueDefined)
  //   return false
  // }

  let isValid = true;

  // verificar se o usuário possui fila liberada
  if (isQueuesTenantExists) {
    const isQueueUser = UserQueues.findIndex(
      (q: { id: number | undefined }) => ticket.queueId === q.id
    );
    if (isQueueUser !== -1) {
      console.log("Fila do ticket liberada para o Usuario", ticket.queueId);
      isValid = true;
    } else {
      console.log("Usuario não tem acesso a fila", ticket.queueId);
      return false;
    }
  }

  // verificar se a fila do ticket está filtrada
  if (isQueuesTenantExists && filtros?.queuesIds.length) {
    const isQueue = filtros.queuesIds.findIndex(
      (q: number | undefined) => ticket.queueId === q
    );
    if (isQueue == -1) {
      console.log("filas filtradas e diferentes da do ticket", ticket.queueId);
      return false;
    }
  }

  // se configuração para carteira ativa: verificar se já é um ticket da carteira do usuário
  if (DirectTicketsToWallets() && (ticket?.contact?.wallets?.length || 0) > 0) {
    const idx = ticket?.contact?.wallets.findIndex(
      (w: { id: any }) => w.id == userId
    );
    if (idx !== -1) {
      console.log("Ticket da carteira do usuário");
      return true;
    }
    console.log(
      "DirectTicketsToWallets: Ticket não pertence à carteira do usuário",
      ticket
    );
    return false;
  }

  // verificar se o parametro para não permitir visualizar
  // tickets atribuidos à outros usuários está ativo
  if (isNotViewAssignedTickets() && (ticket?.userId || userId) !== userId) {
    console.log(
      "isNotViewAssignedTickets e ticket não é do usuário",
      ticket?.userId,
      userId
    );
    // se usuário não estiver atribuido, permitir visualizar
    if (!ticket?.userId) {
      return true;
    }
    return false;
  }

  // verificar se filtro somente tickets não assinados (isNotAssingned) ativo
  if (filtros.isNotAssignedUser) {
    console.log(
      "isNotAssignedUser ativo para exibir somente tickets não assinados",
      filtros.isNotAssignedUser,
      !ticket.userId
    );
    return filtros.isNotAssignedUser && !ticket.userId;
  }

  return isValid;
};

export const useAtendimentoTicketStore = create<
  AtendimentoTicketActions & AtendimentoTicketState
>((set, get) => ({
  chatTicketDisponivel: false,
  tickets: [],
  ticketsLocalizadosBusca: [],
  ticketFocado: {
    contacts: {
      tags: [],
      wallets: [],
      extraInfo: [],
    },
  },
  hasMore: false,
  contatos: [],
  mensagens: [],

  // Mutations converted to actions

  setHasMore: (payload) => set({ hasMore: payload }),
  loadTicketFocado: (payload: any) =>
    set(() => {
      console.log(payload);
    }),

  loadTickets: (payload) =>
    set((state) => {
      const newTickets = orderTickets(payload);
      newTickets.forEach((ticket) => {
        const ticketIndex = state.tickets.findIndex((t) => t.id === ticket.id);
        if (ticketIndex !== -1) {
          state.tickets[ticketIndex] = ticket;
          if (ticket.unreadMessages > 0) {
            state.tickets.unshift(state.tickets.splice(ticketIndex, 1)[0]);
          }
        } else {
          if (checkTicketFilter(ticket)) {
            state.tickets.push(ticket);
          }
        }
      });
      return { tickets: state.tickets };
    }),

  resetTickets: () => set({ hasMore: true, tickets: [] }),

  resetUnread: (payload) =>
    set((state) => {
      const ticketIndex = state.tickets.findIndex(
        (t) => t.id === payload.ticketId
      );
      if (ticketIndex !== -1) {
        state.tickets[ticketIndex] = { ...payload, unreadMessages: 0 };
      }
      return { tickets: state.tickets };
    }),

  updateTicket: (payload) =>
    set((state) => {
      const ticketIndex = state.tickets.findIndex((t) => t.id === payload.id);
      if (ticketIndex !== -1) {
        const updatedTicket = {
          ...state.tickets[ticketIndex],
          ...payload,
          username:
            payload?.user?.name ||
            payload?.username ||
            state.tickets[ticketIndex].username,
          profilePicUrl:
            payload?.contact?.profilePicUrl ||
            payload?.profilePicUrl ||
            state.tickets[ticketIndex].profilePicUrl,
          name:
            payload?.contact?.name ||
            payload?.name ||
            state.tickets[ticketIndex].name,
        };
        const updatedTickets = [...state.tickets];
        updatedTickets[ticketIndex] = updatedTicket;

        if (state.ticketFocado.id === payload.id) {
          return {
            tickets: updatedTickets.filter((t) => checkTicketFilter(t)),
            ticketFocado: { ...state.ticketFocado, ...payload },
          };
        }

        return { tickets: updatedTickets.filter((t) => checkTicketFilter(t)) };
      } else {
        const newTicket = {
          ...payload,
          username: payload?.user?.name || payload?.username,
          profilePicUrl:
            payload?.contact?.profilePicUrl || payload?.profilePicUrl,
          name: payload?.contact?.name || payload?.name,
        };
        return {
          tickets: [newTicket, ...state.tickets].filter((t) =>
            checkTicketFilter(t)
          ),
        };
      }
    }),

  deleteTicket: (ticketId) =>
    set((state) => {
      const updatedTickets = state.tickets.filter((t) => t.id !== ticketId);
      return { tickets: updatedTickets };
    }),

  updateTicketFocadoContact: (payload) =>
    set((state) => ({
      ticketFocado: { ...state.ticketFocado, contact: payload },
    })),

  updateContact: (payload) =>
    set((state) => {
      const updatedTickets = state.tickets.map((t) => {
        if (t.contactId === payload.id) {
          return {
            ...t,
            contact: payload,
            name: payload.name,
            profilePicUrl: payload.profilePicUrl,
          };
        }
        return t;
      });
      const updatedTicketFocado =
        state.ticketFocado.contactId === payload.id
          ? { ...state.ticketFocado, contact: payload }
          : state.ticketFocado;

      return { tickets: updatedTickets, ticketFocado: updatedTicketFocado };
    }),

  setTicketFocado: (payload) =>
    set(() => ({
      ticketFocado: {
        ...payload,
        status: payload.status === "pending" ? "open" : payload.status,
      },
    })),

  loadInitialMessages: (payload) =>
    set(() => {
      const newMessages = orderMessages([
        ...payload.messages,
        ...payload.messagesOffLine,
      ]);
      return { mensagens: newMessages };
    }),

  loadMoreMessages: (payload) =>
    set((state) => {
      const newMessages = [...payload.messages, ...payload.messagesOffLine];
      const updatedMessages = state.mensagens.map((m) => {
        const index = newMessages.findIndex((nm) => nm.id === m.id);
        if (index !== -1) {
          newMessages.splice(index, 1);
          return newMessages[index];
        }
        return m;
      });
      return { mensagens: [...orderMessages(newMessages), ...updatedMessages] };
    }),

  updateMessages: (payload) =>
    set((state) => {
      if (state.ticketFocado.id === payload.ticket.id) {
        const updatedMessages = [...state.mensagens];
        const messageIndex = updatedMessages.findIndex(
          (m) => m.id === payload.id
        );
        if (messageIndex !== -1) {
          updatedMessages[messageIndex] = payload;
        } else {
          updatedMessages.push(payload);
        }
        return { mensagens: updatedMessages };
      }
      return {};
    }),

  resetMessages: () => set(() => ({ mensagens: [] })),

  LocalizarMensagensTicket: async (params) => {
    try {
      const mensagens = await LocalizarMensagens(params);
      set((state) => ({
        hasMore: mensagens.data.hasMore,
        mensagens:
          params.pageNumber === 1
            ? orderMessages([
                ...mensagens.data.messages,
                ...mensagens.data.messagesOffLine,
              ])
            : [
                ...state.mensagens,
                ...orderMessages([
                  ...mensagens.data.messages,
                  ...mensagens.data.messagesOffLine,
                ]),
              ],
      }));
    } catch (error) {
      console.error("Erro ao localizar mensagens:", error);
    }
  },
  redirectToChat: (_ticketId) => {
    // A função de navegação será definida no componente onde o hook useNavigate pode ser acessado
  },
  // Ação para abrir o chat de mensagens
  AbrirChatMensagens: async (data) => {
    try {
      // Resetando ticket focado e mensagens
      set({ ticketFocado: {}, mensagens: [] });

      // Consultar os dados do ticket
      const ticket = await ConsultarDadosTicket(data);
      set(() => ({ ticketFocado: { ...ticket.data } }));

      // Definindo parâmetros para localizar as mensagens do ticket
      const params = {
        ticketId: data.id,
        pageNumber: 1,
      };

      // Chama a ação para localizar as mensagens
      await get().LocalizarMensagensTicket(params);

      const redirectToChat = get().redirectToChat;
      if (redirectToChat) {
        redirectToChat(data.id); // Redireciona para a rota do chat
      }
      // Navegar para a rota do chat (supondo que você tenha acesso ao $router aqui)
      //$router.push({ name: 'chat', params, query: { t: new Date().getTime() } })
    } catch (error) {
      // Tratamento de erro
      if (!error) return;
      const errorMsg = error?.response?.data?.error;
      toast.error(
        errorMsg ||
          `Ops... Ocorreu um problema não identificado. ${JSON.stringify(
            error
          )}`
      );
    }
  },
}));
