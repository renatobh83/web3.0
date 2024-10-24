import request from "./request";

export function CriarWebhook(data) {
  return request({
    url: "/api-confirma/",
    method: "post",
    data,
  });
}
export function ConectarApi(data) {
  return request({
    url: `/api-confirma/${data.id}`,
    method: "post",
    data,
  });
}
export function ListarWebhook() {
  return request({
    url: "/api-confirma/",
    method: "get",
  });
}

export function DeletarApi(id: string) {
  return request({
    url: `/api-confirma/${id}`,
    method: "delete",
  });
}
export function UpdateApi(id: string, data: any) {
  return request({
    url: `/api-confirma/${id}`,
    method: "put",
    data,
  });
}
export function UpdateStatusApi(id: string, status: string) {
  return request({
    url: `/api-confirma/${id}/${status}`,
    method: "put",
  });
}
