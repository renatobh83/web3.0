import { Box, Stack } from '@mui/material'
import { MenuDrawer } from '../components/MainComponents/MenuDrawer'
import { useCallback, useEffect } from 'react'
import { Header } from '../components/MainComponents/Header'

import { Outlet } from 'react-router-dom'
import { useNotificationsStore } from '../store/notifications'
import { useWhatsappStore } from '../store/whatsapp'
import { toast } from 'sonner'
import { ConsultarTickets } from '../services/tickets'
import { ListarConfiguracoes } from '../services/configuracoes'
import { ListarWhatsapps } from '../services/sessoesWhatsapp'

import { useAtendimentoTicketStore } from '../store/atendimentoTicket'

import { socketIO } from '../utils/socket'
import { useUsersAppStore } from '../store/usersApp'
import { useSocketInitial } from '../hooks/useSocketInitial'

export const MainLayout: React.FC = () => {
  // const socket = socketIO()
  const { updateNotifications, updateNotificationsP } = useNotificationsStore()

  const { loadWhatsApps, whatsApps } = useWhatsappStore()

  // const usuario = JSON.parse(localStorage.getItem('usuario'))

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

  const listarWhatsapps = useCallback(async () => {
    if (!whatsApps.length) {
      const { data } = await ListarWhatsapps()
      loadWhatsApps(data)
    }
  }, [])

  const listarConfiguracoes = useCallback(async () => {
    if (!localStorage.getItem('configuracoes')) {
      const { data } = await ListarConfiguracoes()
      localStorage.setItem('configuracoes', JSON.stringify(data))
    }
  }, [])

  const consultarTickets = useCallback(async () => {
    const params = {
      searchParam: '',
      pageNumber: 1,
      status: ['open', 'pending'],
      showAll: false,
      count: null,
      queuesIds: [],
      withUnreadMessages: true,
      isNotAssignedUser: false,
      includeNotQueueDefined: true,
      // date: new Date(),
    }
    try {
      const { data } = await ConsultarTickets(params)
      updateNotifications(data)
      setTimeout(() => {
        updateNotifications(data)
      }, 500)
      // this.$store.commit('SET_HAS_MORE', data.hasMore)
    } catch (err) {
      toast.error('Algum problema ao consultar tickets', {
        position: 'top-center',
      })
      console.error(err)
    }
    const params2 = {
      searchParam: '',
      pageNumber: 1,
      status: ['pending'],
      showAll: false,
      count: null,
      queuesIds: [],
      withUnreadMessages: false,
      isNotAssignedUser: false,
      includeNotQueueDefined: true,
      // date: new Date(),
    }
    try {
      const { data } = await ConsultarTickets(params2)

      // this.$store.commit("UPDATE_NOTIFICATIONS_P", data);
      updateNotificationsP(data)
      setTimeout(() => {
        updateNotificationsP(data)
      }, 500)
      // this.$store.commit('SET_HAS_MORE', data.hasMore)
      // console.log(this.notifications)
    } catch (err) {
      toast.error('Algum problema ao consultar tickets ', {
        position: 'top-center',
      })
      console.error(err)
    }
  }, [updateNotificationsP, updateNotifications])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const conectar = async () => {
      await listarWhatsapps()
      await listarConfiguracoes()

      consultarTickets() // Descomente se necessário
    }

    conectar()
  }, [listarWhatsapps, listarConfiguracoes, consultarTickets])

  // const [open, setOpen] = useState(false);

  // const toggleDrawer = (newOpen) => () => {
  //     setOpen(newOpen);
  // };
  return (
    <Box sx={{ display: 'flex' }}>
      <MenuDrawer />

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            mx: 3,
            pb: 10,
            mt: 8,
          }}
        >
          {/* <Header /> */}
          <Outlet />
        </Stack>
      </Box>
    </Box>
  )
}
