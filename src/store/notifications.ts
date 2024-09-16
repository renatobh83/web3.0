import { create } from "zustand";

// Defina o tipo para as notificações, substitua 'any' pelo tipo específico se souber o que será armazenado.
interface NotificationData {
	count: string;
	hasMore: boolean;
	tickets: any[]; // Substitua `any` pelo tipo específico dos tickets se souber
}
interface NotificationsState {
	notifications: NotificationData;
	notificationsP: NotificationData;
	updateNotifications: (newData: NotificationData) => void;
	updateNotificationsP: (newData: NotificationData) => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
	notifications: {
		count: "0",
		hasMore: false,
		tickets: [], // Substitua `any` pelo tipo específico dos tickets se souber
	},
	notificationsP: {
		count: "0",
		hasMore: false,
		tickets: [], // Substitua `any` pelo tipo específico dos tickets se souber
	},

	updateNotifications: (newData) =>
		set(() => ({
			notifications: newData,
		})),

	updateNotificationsP: (newData) =>
		set(() => ({
			notificationsP: newData,
		})),
}));
