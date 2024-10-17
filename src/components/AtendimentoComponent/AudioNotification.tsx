import type React from "react";
import { useEffect, useRef } from "react";
import { useNotificationsStore } from "../../store/notifications";

export const AudioNotification: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const notificacaoTicket = useNotificationsStore(s => s.notifications);
  const notificationsP = useNotificationsStore(s => s.notificationsP);
  const alertSound = "/sound.mp3"; // Corrigido o caminho

  useEffect(() => {

    const playNotificationSound = async () => {
      if ((Number(notificacaoTicket.count) > 0 || Number(notificationsP.count) > 0) && audioRef.current) {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error("Erro ao tentar tocar o áudio de notificação:", error);
        }
      }
    };

    // playNotificationSound(); // Tenta tocar o som assim que uma notificação for recebida

  }, [notificacaoTicket, notificationsP]);

  return (
    // biome-ignore lint/a11y/useMediaCaption: <explanation>
    <audio ref={audioRef}>
      <source src={alertSound} type="audio/mp3" />
    </audio>
  );
};
