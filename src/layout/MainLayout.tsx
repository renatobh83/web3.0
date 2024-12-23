import { Box, Stack } from '@mui/material'
import { MenuDrawer } from '../components/MainComponents/MenuDrawer'
import { useCallback, useEffect, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useWhatsappStore } from '../store/whatsapp'
import { ListarConfiguracoes } from '../services/configuracoes'
import { ListarWhatsapps } from '../services/sessoesWhatsapp'
import { useSocketInitial } from '../hooks/useSocketInitial'
import { useAtendimentoTicketStore } from '../store/atendimentoTicket'
import { useAuth } from '../context/AuthContext'
import { EventEmitter } from 'events'
import { format } from 'date-fns'
import { Errors } from '../utils/error'

export const eventEmitterMain = new EventEmitter()
export const MainLayout: React.FC = () => {
  const nav = useNavigate()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const alertSound = '/sound.mp3' // Corrigido o caminho
  const { encryptData } = useAuth()
  const { AbrirChatMensagens } = useAtendimentoTicketStore()
  const { loadWhatsApps } = useWhatsappStore()

  useEffect(() => {
    if ("Notification" in window) {
      // Verifica o status atual da permissão
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Permissão de notificação concedida');
            // Agora você pode tocar sons ou enviar notificações conforme necessário
          } else {
            console.log('Permissão de notificação negada ou ignorada');
          }
        }).catch(error => {
          console.error('Erro ao solicitar permissão de notificação:', error);
        });
      }
    }
  }, [])
  useSocketInitial()
  // Nao sendo invocada
  // function cProblemaConexao() {
  //     const idx = whatsApps.findIndex(w =>
  //         ['PAIRING', 'TIMEOUT', 'DISCONNECTED'].includes(w.status)
  //     )
  //     return idx !== -1
  // }

  // function cQrCode() {
  //     const idx = whatsApps.findIndex(
  //         w => w.status === 'qrcode' || w.status === 'DESTROYED'
  //     )
  //     return idx !== -1
  // }
  // function cOpening() {
  //     const idx = whatsApps.findIndex(w => w.status === 'OPENING')
  //     return idx !== -1
  // }

  // function cSessions() {
  //     return whatsApps.filter(w => ["whatsapp", "baileys"].includes(w.type) && !w.isDeleted && w.status === 'CONNECTED');
  // }
  // Invocar no modal Iniciar Conversa Avulsa TODO ainda nao criado
  // function cSessionsOptions() {
  //     return cSessions().map(w => ({ label: w.name, value: w.id, type: w.type }))
  // }

  // async function enviarMensagem() {
  //     const data = {
  //         whatsappId: this.whatsappId.value,
  //         whatsappType: this.whatsappId.type,
  //         number: this.numero,
  //         message: this.mensagem,
  //     };
  //     try {
  //         await TextoIndividual(data)
  //         this.$q.notify({
  //             color: 'positive',
  //             position: 'top',
  //             message: 'Mensagem enviada para o número: ' + this.numero,
  //         });
  //         this.closeModal();
  //     } catch (e) {
  //         this.$q.notify({
  //             color: 'negative',
  //             position: 'top',
  //             message: 'Erro ao enviar mensagem individual: ' + e.data.error,
  //         });
  //     }
  //     this.closeModal();
  // }


  const playNotificationSound = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play()
      } catch (error) {
        console.error('Erro ao tentar tocar o áudio de notificação:', error)
      }
    }
  }

  const goToChat = async (id: number) => {
    try {
      const timestamp = new Date().getTime()
      nav(`/atendimento/${id}?t=${timestamp}`, {
        replace: false,
        state: { t: new Date().getTime() },
      })
    } catch (error) {
      Errors(error)
    }
  }
  const handlerNotifications = (data) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      let notification;

      const options = {
        body: `${data.body} - ${format(new Date(), 'HH:mm')}`,
        icon: data.ticket.contact.profilePicUrl,
        tag: data.ticket.id,
        renotify: true,
      };

      // Verifica se o navegador tem suporte a Service Worker
      if (navigator.serviceWorker) {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            // Usa o Service Worker para mostrar a notificação
            notification = registration.showNotification(
              `Mensagem de ${data.ticket.contact.name}`,
              options
            );
          } else {
            // Caso o Service Worker não esteja disponível, cria a notificação diretamente
            notification = new Notification(`Mensagem de ${data.ticket.contact.name}`, options);
          }

          // Configura o clique da notificação
          notification.onclick = (e) => {
            e.preventDefault();
            if (document.hidden) {
              window.focus();
            }
            AbrirChatMensagens(data.ticket);
            goToChat(data.ticket.id);
          };

          // Fecha a notificação após 10 segundos
          setTimeout(() => {
            if (notification) {
              notification.close();
            }
          }, 10000);
        }).catch((error) => {
          console.error('Erro ao tentar obter o Service Worker:', error);
        });
      } else {
        // Caso não haja suporte a Service Worker, cria a notificação diretamente
        notification = new Notification(`Mensagem de ${data.ticket.contact.name}`, options);

        // Configura o clique da notificação
        notification.onclick = (e) => {
          e.preventDefault();
          if (document.hidden) {
            window.focus();
          }
          AbrirChatMensagens(data.ticket);
          goToChat(data.ticket.id);
        };

        // Fecha a notificação após 10 segundos
        setTimeout(() => {
          if (notification) {
            notification.close();
          }
        }, 10000);
      }

      // Toca o som da notificação
      playNotificationSound();
    } else {
      console.log('Permissão de notificações não concedida ou navegador não compatível');
    }
  };
  // const handlerNotifications = (data) => {
  //   if ('Notification' in window && Notification.permission === 'granted') {

  //     if (data.ticket.userId) {
  //       let notification
  //       const options = {
  //         body: `${data.body} - ${format(new Date(), 'HH:mm')}`,
  //         icon: data.ticket.contact.profilePicUrl,
  //         tag: data.ticket.id,
  //         renotify: true,
  //       }
  //       if (navigator.serviceWorker) {
  //         navigator.serviceWorker.getRegistration().then((registration) => {
  //           if (registration) {
  //             notification = registration.showNotification(
  //               `Mensagem de ${data.ticket.contact.name}`,
  //               options
  //             )
  //           } else {
  //             notification = new Notification(
  //               `Mensagem de ${data.ticket.contact.name}`,
  //               options
  //             )
  //           }



  //         })



  //       } else {
  //         notification = new Notification(`Mensagem de ${data.ticket.contact.name}`, options);
  //       }

  //       setTimeout(() => {
  //         notification.close()
  //       }, 10000)
  //       notification.onclick = e => {
  //         e.preventDefault()
  //         if (document.hidden) {
  //           window.focus()
  //         }
  //         AbrirChatMensagens(data.ticket)
  //         goToChat(data.ticket.id)
  //       }
  //     } else {
  //       const message = new Notification('Novo cliente pendente', {
  //         body: `Cliente: ${data.ticket.contact.name}`,
  //         tag: 'notification-pending',
  //       })
  //       message.onclick = e => {
  //         e.preventDefault()
  //         AbrirChatMensagens(data.ticket)
  //         goToChat(data.ticket.id)
  //       }
  //     }

  //     playNotificationSound()
  //   } else {
  //     console.log('Permissão de notificações não concedida ou navegador não compatível');
  //   }
  // }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Adiciona o listener ao montar o componente
    eventEmitterMain.on('handlerNotifications', handlerNotifications)
    eventEmitterMain.on('playSoundNotification', playNotificationSound)
    // Remove o listener ao desmontar o componente
    return () => {
      eventEmitterMain.off('handlerNotifications', handlerNotifications)
      eventEmitterMain.off('playSoundNotification', playNotificationSound)
    }
  }, [])
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const listarWhatsapps = useCallback(async () => {

    const { data } = await ListarWhatsapps()
    loadWhatsApps(data)

  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const listarConfiguracoes = useCallback(async () => {
    const { data } = await ListarConfiguracoes()
    localStorage.setItem('configuracoes', encryptData(JSON.stringify(data)))

  }, [])



  useEffect(() => {
    const conectar = async () => {
      await listarWhatsapps()
      await listarConfiguracoes()
    }
    try {
      conectar()
    } catch (error) {
      Errors(error)
    }
  }, [listarWhatsapps, listarConfiguracoes])

  return (
    <Box sx={{ display: 'flex' }}>
      <MenuDrawer />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            mx: 3,
            // pb: 10,
            mt: 8,
          }}
        >
          {/* <Header /> */}
          <Outlet />
        </Stack>
      </Box>
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      <audio ref={audioRef}>
        <source src={alertSound} type="audio/mp3" />
      </audio>
    </Box>
  )
}
