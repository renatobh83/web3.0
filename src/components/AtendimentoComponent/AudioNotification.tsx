import type React from "react";
import { useEffect, useRef } from "react";
import { useAtendimentoTicketStore } from "../../store/atendimentoTicket";

export const AudioNotification: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const notificacaoTicket = useAtendimentoTicketStore(s => s.notificacaoTicket)
  const alertSound = "../sound.mp3";
  useEffect(() => {
    if (
      notificacaoTicket > 0 &&
      audioRef.current
    ) {
      audioRef.current.play();
    }
    console.log(notificacaoTicket, 'in Audiocomponent')
  }, [notificacaoTicket]);

  return (
    // biome-ignore lint/a11y/useMediaCaption: <explanation>
    <audio ref={audioRef}>
      <source src={alertSound} type="audio/mp3" />
    </audio >
  )
};
