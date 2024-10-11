import request from "./request";

export function CriarChatFlow(data) {
  return request({
    url: "/chat-flow",
    method: "post",
    data,
  });
}

export function DuplicarChatFlow(data) {
  return request({
    url: "/chat-flow-duplicate",
    method: "post",
    data,
  });
}

export function ListarChatFlow() {
  return request({
    url: "/chat-flow",
    method: "get",
  });
}

export function UpdateChatFlow(data) {
  return request({
    url: `/chat-flow/${data.id}`,
    method: "put",
    data,
  });
}

export function ImportarJsonChatFlow(data) {
  return request({
    url: `/chat-flow-import/${data.id}`,
    method: "put",
    data,
  });
}

export function DeletarChatFlow(data) {
  return request({
    url: `/chat-flow/${data.id}`,
    method: "delete",
  });
}
