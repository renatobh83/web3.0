import { create } from "zustand";

interface User {
	isAdmin: boolean;
	token: string | null;
	isSuporte: boolean;
	setUserState: (data: { email: string; profile: string }) => void;
}

export const useUserStore = create<User>((set) => ({
	isAdmin: false,
	token: null,
	isSuporte: false,

	// Nova action que lida com ambos os estados
	setUserState: (data) => {
		const domains = ["@"]; // Domínios autorizados
		let Suporte = false;

		// Verifica se o email contém o domínio autorizado
		// biome-ignore lint/complexity/noForEach: <explanation>
		domains.forEach((domain) => {
			if (
				data?.email.toLocaleLowerCase().indexOf(domain.toLocaleLowerCase()) !==
				-1
			) {
				Suporte = true;
			}
		});

		// Atualiza ambos os estados de uma vez só
		set(() => ({
			isSuporte: Suporte,
			isAdmin: !!(Suporte || data.profile === "admin"),
		}));
	},
}));
