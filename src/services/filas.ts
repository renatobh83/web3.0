import request from "./request";

export function CriarFila(data: any) {
  return request({
    url: "/queue/",
    method: "post",
    data,
  });
}

export function ListarFilas() {
  return request({
    url: "/queue/",
    method: "get",
  });
}

export function AlterarFila(data: { id: any }) {
  return request({
    url: `/queue/${data.id}`,
    method: "put",
    data,
  });
}

export function DeletarFila(data: { id: any }) {
  return request({
    url: `/queue/${data.id}`,
    method: "delete",
  });
}
