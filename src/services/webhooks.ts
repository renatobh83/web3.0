import request from "./request";

export function CriarWebhook(data) {
  return request({
    url: "/api-confirma/",
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
