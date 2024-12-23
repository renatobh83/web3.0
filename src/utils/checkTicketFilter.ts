import CryptoJS from "crypto-js";
const decryptData = (encryptedData: string) => {
  const bytes = CryptoJS.AES.decrypt(
    encryptedData,
    import.meta.env.VITE_APP_SECRET_KEY
  );
  return bytes.toString(CryptoJS.enc.Utf8);
};
const checkTicketFilter = (ticket) => {
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
  const configuracoes = JSON.parse(
    decryptData(localStorage.getItem("configuracoes"))
  );

  const NotViewTicketsChatBot = () => {
    const conf = configuracoes?.find((c) => c.key === "NotViewTicketsChatBot");
    return conf?.value === "enabled";
  };

  const DirectTicketsToWallets = () => {
    const conf = configuracoes?.find((c) => c.key === "DirectTicketsToWallets");
    return conf?.value === "enabled";
  };

  const isNotViewAssignedTickets = () => {
    const conf = configuracoes?.find((c) => c.key === "NotViewAssignedTickets");
    return conf?.value === "enabled";
  };
  const filtros =
    JSON.parse(localStorage.getItem("filtrosAtendimento")) || filtroPadrao;
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const usuario = JSON.parse(decryptData(localStorage.getItem("usuario")!));

  const UserQueues = JSON.parse(localStorage.getItem("queues"));
  const filasCadastradas = JSON.parse(
    localStorage.getItem("filasCadastradas") || "[]"
  );
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const profile = decryptData(localStorage.getItem("profile")!);
  const isAdminShowAll = profile === "admin" && filtros.showAll;
  const isQueuesTenantExists = filasCadastradas.length > 0;

  const userId = usuario?.userId || +localStorage.getItem("userId");

  if (usuario.status !== "online") {
    return false;
  }

  // Verificar se é admin e se está solicitando para mostrar todos
  if (isAdminShowAll) {
    // console.log('isAdminShowAll', isAdminShowAll)
    return true;
  }

  // se ticket for um grupo, todos podem verificar.
  if (ticket.isGroup) {
    console.log("ticket.isGroup", ticket.isGroup);
    return true;
  }

  // se status do ticket diferente do staatus filtrado, retornar false
  if (filtros.status.length > 0 && !filtros.status.includes(ticket.status)) {
    console.log("Status ticket", filtros.status, ticket.status);
    return false;
  }

  // verificar se já é um ticket do usuário
  if (ticket?.userId == userId) {

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
  if (
    isQueuesTenantExists &&
    !ticket.queueId &&
    !filtros.includeNotQueueDefined
  ) {
    console.log(
      "filtros.includeNotQueueDefined",
      ticket.queueId,
      !filtros.includeNotQueueDefined
    );
    return false;
  }

  let isValid = true;

  // verificar se o usuário possui fila liberada
  if (isQueuesTenantExists) {
    const isQueueUser = UserQueues.findIndex((q) => ticket.queueId === q.id);
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
    const isQueue = filtros.queuesIds.findIndex((q) => ticket.queueId === q);
    if (isQueue === -1) {
      console.log("filas filtradas e diferentes da do ticket", ticket.queueId);
      return false;
    }
  }

  // se configuração para carteira ativa: verificar se já é um ticket da carteira do usuário
  if (DirectTicketsToWallets() && (ticket?.contact?.wallets?.length || 0) > 0) {
    const idx = ticket?.contact?.wallets.findIndex((w) => w.id === userId);
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

export default checkTicketFilter;
