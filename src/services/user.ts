import request from "./request";

export function ListarUsuarios() {
  return request({
    url: "/users/",
    method: "get",
  });
}

export function CriarUsuario(data: any) {
  return request({
    url: "/users",
    method: "post",
    data,
  });
}

export function UpdateUsuarios(userId: any, data: any) {
  return request({
    url: `/users/${userId}`,
    method: "put",
    data,
  });
}

export function UpdateConfiguracoesUsuarios(userId: any, data: any) {
  return request({
    url: `/users/${userId}/configs`,
    method: "put",
    data,
  });
}

export function DadosUsuario(userId: any) {
  return request({
    url: `/users/${userId}`,
    method: "get",
  });
}

export function DeleteUsuario(userId: any) {
  return request({
    url: `/users/${userId}`,
    method: "delete",
  });
}
