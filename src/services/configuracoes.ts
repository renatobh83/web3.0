import request from "./request";

export function ListarConfiguracoes() {
  return request({
    url: "/settings/",
    method: "get",
  });
}

export function AlterarConfiguracao(data: { key: any }) {
  return request({
    url: `/settings/${data.key}/`,
    method: "put",
    data,
  });
}
