import request from "./request";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function RealizarLogin(user: any) {
	return request({
		url: "/auth/login/",
		method: "post",
		data: user,
	});
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function RealizarLogout(user: any) {
	return request({
		url: "/auth/logout/",
		method: "post",
		data: user,
	});
}

export function RefreshToken() {
	return request({
		url: "/auth/refresh_token",
		method: "post",
	});
}
