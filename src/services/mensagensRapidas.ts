import request from "./request";

export function CriarMensagemRapida(data: any) {
  return request({
    url: "/fastreply/",
    method: "post",
    data,
  });
}

export function ListarMensagensRapidas() {
  return request({
    url: "/fastreply/",
    method: "get",
  });
}

export function AlterarMensagemRapida(data: { id: any }) {
  return request({
    url: `/fastreply/${data.id}`,
    method: "put",
    data,
  });
}

export function DeletarMensagemRapida(data: { id: any }) {
  return request({
    url: `/fastreply/${data.id}`,
    method: "delete",
  });
}
