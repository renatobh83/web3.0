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
  const { AbrirChatMensagens } = useAtendimentoTicketStore()
  const { loadWhatsApps, whatsApps } = useWhatsappStore()
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

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const alertSound = '/sound.mp3' // Corrigido o caminho
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
  function handlerNotifications(data) {
    if (data.ticket.userId) {
      const options = {
        body: `${data.body} - ${format(new Date(), 'HH:mm')}`,
        icon: data.ticket.contact.profilePicUrl,
        tag: data.ticket.id,
        renotify: true,
      }
      const notification = new Notification(
        `Mensagem de ${data.ticket.contact.name}`,
        options
      )
      setTimeout(() => {
        notification.close()
      }, 10000)
      notification.onclick = e => {
        e.preventDefault()
        if (document.hidden) {
          window.focus()
        }
        AbrirChatMensagens(data.ticket)
        goToChat(data.ticket.id)
      }
    } else {
      const message = new Notification('Novo cliente pendente', {
        body: `Cliente: ${data.ticket.contact.name}`,
        tag: 'notification-pending',
      })
      message.onclick = e => {
        e.preventDefault()

        AbrirChatMensagens(data.ticket)
        goToChat(data.ticket.id)
      }
    }
    playNotificationSound()
  }
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
    if (!whatsApps.length) {
      const { data } = await ListarWhatsapps()
      loadWhatsApps(data)
    }
  }, [])
  const { encryptData } = useAuth()
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const listarConfiguracoes = useCallback(async () => {
    if (!localStorage.getItem('configuracoes')) {
      const { data } = await ListarConfiguracoes()
      localStorage.setItem('configuracoes', encryptData(JSON.stringify(data)))
    }
  }, [])



  useEffect(() => {
    const conectar = async () => {
      await listarWhatsapps()
      await listarConfiguracoes()
    }

    conectar()
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
