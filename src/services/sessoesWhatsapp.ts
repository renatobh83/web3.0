import request from "./request";

export function ListarWhatsapps() {
	return request({
		url: "/whatsapp/",
		method: "get",
	});
}

export function StartWhatsappSession(whatsAppId: any) {
	return request({
		url: `/whatsappsession/${whatsAppId}`,
		method: "post",
	});
}

export function DeleteWhatsappSession(whatsAppId: any) {
	return request({
		url: `/whatsappsession/${whatsAppId}`,
		method: "delete",
	});
}

export function RequestNewQrCode(data: { id: any }) {
	return request({
		url: `/whatsappsession/${data.id}`,
		method: "put",
		data,
	});
}

export function GetWhatSession(whatsAppId: any) {
	return request({
		url: `/whatsapp/${whatsAppId}`,
		method: "get",
	});
}

export function UpdateWhatsapp(whatsAppId: any, data: any) {
	return request({
		url: `/whatsapp/${whatsAppId}`,
		method: "put",
		data,
	});
}

export function CriarWhatsapp(data: any) {
	return request({
		url: "/whatsapp",
		method: "post",
		data,
	});
}

export function DeletarWhatsapp(whatsAppId: any) {
	return request({
		url: `/whatsapp/${whatsAppId}`,
		method: "delete",
	});
}

// api.put(`/whatsapp/${whatsAppId}`, {
//   name: values.name,
//   isDefault: values.isDefault,
// });
