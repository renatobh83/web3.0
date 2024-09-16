import request from "./request";

export function ListarConfiguracoes() {
  return request({
    url: "/settings/",
    method: "get",
  });
}

export function AlterarConfiguracao(data: { Key: any }) {
  return request({
    url: `/settings/${data.Key}/`,
    method: "put",
    data,
  });
}
