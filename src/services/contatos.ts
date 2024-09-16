import request from "./request";

export function ListarContatos(params: any) {
  return request({
    url: "/contacts/",
    method: "get",
    params,
  });
}

export function ObterContato(contactId: any) {
  return request({
    url: `/contacts/${contactId}`,
    method: "get",
  });
}

export function CriarContato(data: any) {
  return request({
    url: "/contacts",
    method: "post",
    data,
  });
}

export function ImportarArquivoContato(data: any) {
  return request({
    url: "/contacts/upload",
    method: "post",
    data,
    timeout: 120000,
  });
}

export function ExportarArquivoContato(data: any) {
  return request({
    url: "/contacts/export",
    method: "post",
    data,
    timeout: 120000,
  });
}

export function SyncronizarContatos() {
  return request({
    url: "/contacts/sync",
    method: "post",
  });
}

export function EditarContato(contactId: any, data: any) {
  return request({
    url: `/contacts/${contactId}`,
    method: "put",
    data,
  });
}

export function DeletarContato(contactId: any) {
  return request({
    url: `/contacts/${contactId}`,
    method: "delete",
  });
}

export function EditarEtiquetasContato(contactId: any, tags: any) {
  const data = {
    tags,
  };
  return request({
    url: `/contact-tags/${contactId}`,
    method: "put",
    data,
  });
}

export function EditarCarteiraContato(contactId: any, wallets: any) {
  const data = {
    wallets,
  };
  return request({
    url: `/contact-wallet/${contactId}`,
    method: "put",
    data,
  });
}
