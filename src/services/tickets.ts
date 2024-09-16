import request from "./request";

export function ConsultarTickets(params: any) {
  return request({
    url: "/tickets",
    method: "get",
    params,
  });
}

export function ConsultarDadosTicket(params: { id: any }) {
  return request({
    url: `/tickets/${params.id}`,
    method: "get",
    params,
  });
}

export function ConsultarLogsTicket(params: { ticketId: any }) {
  return request({
    url: `/tickets/${params.ticketId}/logs`,
    method: "get",
    params,
  });
}

export function AtualizarStatusTicket(ticketId: any, status: any, userId: any) {
  return request({
    url: `/tickets/${ticketId}`,
    method: "put",
    data: {
      status,
      userId,
    },
  });
}

export function AtualizarTicket(ticketId: any, data: any) {
  return request({
    url: `/tickets/${ticketId}`,
    method: "put",
    data,
  });
}

export function LocalizarMensagens(params: { ticketId: any }) {
  return request({
    url: `/messages/${params.ticketId}`,
    method: "get",
    params,
  });
}

export function EnviarMensagemTexto(ticketId: any, data: any) {
  return request({
    url: `/messages/${ticketId}`,
    method: "post",
    data,
  });
}

export function EncaminharMensagem(messages: any, contato: any) {
  const data = {
    messages,
    contact: contato,
  };
  return request({
    url: "/forward-messages/",
    method: "post",
    data,
  });
}

export function DeletarMensagem(mensagem: { messageId: any }) {
  return request({
    url: `/messages/${mensagem.messageId}`,
    method: "delete",
    data: mensagem,
  });
}

export function CriarTicket(data: any) {
  return request({
    url: "/tickets",
    method: "post",
    data,
  });
}
