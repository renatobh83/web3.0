import type * as React from 'react'
import { EventEmitter } from 'events'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import {
  ArrowDownwardSharp,
  ContactPage,
  Home,
  Logout,
  Person,
} from '@mui/icons-material'
import {
  alpha,
  Avatar,
  Badge,
  Button,
  Menu,
  MenuItem,
  MenuList,
  type MenuProps,
  styled,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  useColorScheme,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  type PaletteMode,
} from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import PersonIcon from '@mui/icons-material/Person'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import { debounce } from 'lodash'
import { format } from 'date-fns'
import { ItemTicket } from './ItemTicket'
import { SelectComponent } from '../../components/AtendimentoComponent/SelectComponent'
import { ListarConfiguracoes } from '../../services/configuracoes'
import { ListarEtiquetas } from '../../services/etiquetas'
import { ListarFilas } from '../../services/filas'
import { ListarWhatsapps } from '../../services/sessoesWhatsapp'
import { ConsultarTickets } from '../../services/tickets'
import {
  type Ticket,
  useAtendimentoTicketStore,
} from '../../store/atendimentoTicket'
import { useUsuarioStore } from '../../store/usuarios'
import { useWhatsappStore } from '../../store/whatsapp'
import ToggleColorMode from '../../components/MaterialUi/Login/ToggleColorMode'
import { useAtendimentoStore } from '../../store/atendimento'
import { useApplicationStore } from '../../store/application'
import { InfoCabecalhoMenssagens } from './InforCabecalhoChat'
import { toast } from 'sonner'
import { ModalUsuario } from '../Usuarios/ModalUsuario'
import { useMixinSocket } from '../../hooks/useMinxinScoket'
import { ModalNovoTicket } from './ModalNovoTicket'
import { ListarContatos } from '../../services/contatos'
import { useContatosStore } from '../../store/contatos'

import { useAuth } from '../../context/AuthContext'
import { useSocketInitial } from '../../hooks/useSocketInitial'
import { ListarMensagensRapidas } from '../../services/mensagensRapidas'
import { RealizarLogout } from '../../services/login'
import { Errors } from '../../utils/error'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
export const eventEmitter = new EventEmitter()

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        // marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}))
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{
        height: 'calc(100% - 180px)',
        overflow: 'auto',
        maxWidth: 370,
        width: '100%',
      }}
      {...other}
    >
      {value === index && <div style={{ overflow: 'auto' }}> {children}</div>}
    </div>
  )
}
function a11yProps(index: number, name: string) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
    name: name,
  }
}

export function Atendimento() {
  const nav = useNavigate()

  const { decryptData, encryptData, logout } = useAuth()
  // Remove this const when copying and pasting into your project.
  const mode: PaletteMode = 'dark'
  const [openModalNovoTicket, setOpenModalNovoTicket] = useState(false)

  // Stores
  const resetTickets = useAtendimentoTicketStore(s => s.resetTickets)
  const setHasMore = useAtendimentoTicketStore(s => s.setHasMore)
  const loadTickets = useAtendimentoTicketStore(s => s.loadTickets)
  const setTicketFocado = useAtendimentoTicketStore(s => s.setTicketFocado)
  const { loadWhatsApps, whatsApps } = useWhatsappStore()
  const { setUsuarioSelecionado, toggleModalUsuario, modalUsuario } =
    useUsuarioStore()
  const { drawerWidth, mobileOpen, setMobileOpen, setIsClosing } =
    useAtendimentoStore()
  const tickets = useAtendimentoTicketStore(s => s.tickets)

  const [tabTickets, setTabTickets] = useState(0)
  const [mensagensRapidas, setMensagensRapidas] = useState([])
  const [tabTicketsStatus, setTabTicketsStatus] = useState('pending')
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [_etiquetas, setEtiquetas] = useState([])
  const [anchorElFiltro, setAnchorElFiltro] = useState<null | HTMLElement>(null)
  const [_loading, setLoading] = useState(false)

  const profile = decryptData('profile')
  const username = localStorage.getItem('username')
  const userid = localStorage.getItem('userId')
  const usuario = JSON.parse(decryptData('usuario'))

  const { socketDisconnect, socketTicketList, socketTicket } = useMixinSocket()

  const [switchStates, setSwitchStates] = useState(() => {
    const savedStates = JSON.parse(localStorage.getItem('filtrosAtendimento'))
    return {
      showAll: savedStates.showAll,
      isNotAssignedUser: savedStates.isNotAssignedUser,
      withUnreadMessages: savedStates.withUnreadMessages,
    }
  })
  const [pesquisaTickets, setPesquisaTickets] = useState(() => {
    const savedData = localStorage.getItem('filtrosAtendimento')
    return savedData ? JSON.parse(savedData) : { status: [], outrosCampos: '' }
  })
  const openNav = Boolean(anchorElNav)
  const openFiltro = Boolean(anchorElFiltro)
  const [filas, setFilas] = useState([])
  const { AbrirChatMensagens } = useAtendimentoTicketStore()
  const { themeMode, toggleThemeMode } = useApplicationStore()
  const { setMode } = useColorScheme()
  // const [localTickets, setLocalTickets] = useState([])

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

  // const dispararEvento = (data: any) => {
  //   eventEmitter.emit('handlerNotifications', data)
  // }

  // const cRouteContatos = () => {
  //   return location.pathname !== 'chat'
  // }
  // const cFiltroSelecionado = () => {
  //   const { queuesIds, showAll, withUnreadMessages, isNotAssignedUser } =
  //     pesquisaTickets
  //   return !!(
  //     queuesIds?.length ||
  //     showAll ||
  //     withUnreadMessages ||
  //     isNotAssignedUser
  //   )
  // }
  // TODO - falta implementar funcao
  // async downloadPDF() {
  //     const doc = new jsPDF();

  //     try {
  //       const response = await LocalizarMensagens({ ticketId: this.ticketFocado.id });
  //       const mensagens = response.data.messages;
  //       let yPosition = 10;

  //       mensagens.forEach((mensagem, index) => {
  //         if (yPosition > 280) {
  //           doc.addPage();
  //           yPosition = 10;
  //         }

  //         const remetente = mensagem.fromMe ? 'Eu' : mensagem.contact.name || 'Contato';
  //         doc.setFontSize(12);
  //         doc.text(`Mensagem de: ${remetente}`, 10, yPosition);
  //         yPosition += 10;

  //         const lines = doc.splitTextToSize(mensagem.body, 180);
  //         doc.text(lines, 10, yPosition);
  //         yPosition += lines.length * 10;
  //         yPosition += 10;
  //       });

  //       doc.save( 'atendimento_' + this.ticketFocado.id + '_mensagens.pdf');
  //     } catch (error) {
  //       console.error('Erro ao baixar as mensagens:', error);
  //     }
  //   }
  // const cIsExtraInfo = () => {
  //   return ticketFocado?.contact?.extraInfo?.length > 0
  // }

  useEffect(() => {
    setMode(themeMode)
  }, [themeMode, setMode])

  const handleToggleColor = () => {
    toggleThemeMode() // Alterna o tema na store
  }

  const handleDrawerClose = () => {
    setIsClosing(true)
    setMobileOpen(false)
  }

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false)
  }

  // const handleDrawerToggle = () => {
  //   if (!isClosing) {
  //     setMobileOpen(!mobileOpen)
  //   }
  // }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseFiltro = () => {
    setAnchorElFiltro(null)
  }
  const handleOpenFiltro = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElFiltro(event.currentTarget)
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleChangeTabs = (_event: any, newValue: number) => {
    setTabTickets(newValue)
  }
  const filterFilas = NewPesquisaTickets => {
    setPesquisaTickets(NewPesquisaTickets)
  }

  const statusTickets = useCallback(
    debounce((novoStatus: string) => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setPesquisaTickets((prevPesquisaTickets: { status: any }) => {
        const { status } = prevPesquisaTickets
        // Criar uma cópia do array de status atual
        let statusAtualizado: string[]
        if (status.includes(novoStatus)) {
          // Remover o status se ele já estiver no array
          statusAtualizado = status.filter((s: string) => s !== novoStatus)
        } else {
          // Adicionar o status se ele não estiver no array
          statusAtualizado = [...status, novoStatus]
        }
        // Retornar o novo estado com o status atualizado
        return {
          ...prevPesquisaTickets, // Manter os outros campos do objeto
          status: statusAtualizado, // Atualizar apenas o campo status
        }
      })
    }, 60),
    []
  )
  const handleChange = event => {
    const { name, checked } = event.target
    // Atualizar o estado específico do switch
    setSwitchStates(prevStates => ({
      ...prevStates,
      [name]: checked, // Atualiza apenas o switch correspondente
    }))
    setPesquisaTickets({
      ...pesquisaTickets,
      [name]: checked,
    })
  }

  const handleSearch = useCallback(
    debounce(async (term: string) => {
      setPesquisaTickets({
        ...pesquisaTickets,
        searchParam: term,
      })
    }, 400),
    []
  ) // 10000ms = 10s

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    handleSearch(value) // Chama a função debounced
  }
  const handleOpenModalUsuario = usuario => {
    setUsuarioSelecionado(usuario)
    toggleModalUsuario()
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
            // Usa o Service Worker para exibir a notificação
            registration.showNotification(
              `Mensagem de ${data.ticket.contact.name}`,
              options
            ).then((notification) => {
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
                notification.close();
              }, 10000);
            }).catch((error) => {
              console.error('Erro ao exibir a notificação via Service Worker:', error);
            });
          } else {
            // Caso o Service Worker não esteja disponível, cria a notificação diretamente
            const notification = new Notification(`Mensagem de ${data.ticket.contact.name}`, options);

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
              notification.close();
            }, 10000);
          }
        }).catch((error) => {
          console.error('Erro ao tentar obter o Service Worker:', error);
        });
      } else {
        // Caso não haja suporte a Service Worker, cria a notificação diretamente
        const notification = new Notification(`Mensagem de ${data.ticket.contact.name}`, options);

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
          notification.close();
        }, 10000);
      }

      // Toca o som da notificação
      playNotificationSound();
    } else {
      console.log('Permissão de notificações não concedida ou navegador não compatível');
    }
  };


  // function handlerNotifications(data) {

  //   if (data.ticket.userId) {
  //     const options = {
  //       body: `${data.body} - ${format(new Date(), 'HH:mm')}`,
  //       icon: data.ticket.contact.profilePicUrl,
  //       tag: data.ticket.id,
  //       renotify: true,
  //     }

  //     const notification = new Notification(
  //       `Mensagem de ${data.ticket.contact.name}`,
  //       options
  //     )

  //     setTimeout(() => {
  //       notification.close()
  //     }, 10000)

  //     notification.onclick = e => {
  //       e.preventDefault()

  //       if (document.hidden) {
  //         window.focus()
  //       }

  //       AbrirChatMensagens(data.ticket)
  //       goToChat(data.ticket.id)
  //     }
  //   } else {
  //     const message = new Notification('Novo cliente pendente', {
  //       body: `Cliente: ${data.ticket.contact.name}`,
  //       tag: 'notification-pending',
  //     })
  //     message.onclick = e => {
  //       e.preventDefault()

  //       AbrirChatMensagens(data.ticket)
  //       goToChat(data.ticket.id)
  //     }
  //   }
  //   playNotificationSound()
  // }

  const listarConfiguracoes = async () => {
    if (!localStorage.getItem('configuracoes')) {
      const { data } = await ListarConfiguracoes()

      localStorage.setItem('configuracoes', encryptData(JSON.stringify(data)))
    }
  }
  const consultaTickets = async (paramsInit = {}) => {
    const toastId = toast.info(
      'Aguarde enquanto os tickets são carregados...',
      {
        position: 'top-center',
        duration: Number.POSITIVE_INFINITY, // Duração infinita até ser manualmente removido
      }
    )
    const params = {
      ...pesquisaTickets,
      ...paramsInit,
    }

    try {
      if (pesquisaTickets.status.lengh === 0) return
      const { data } = await ConsultarTickets(params)

      loadTickets(data.tickets)
      setHasMore(data.hasMore)
    } catch (err) {
      console.log(err)
      Errors(err)
    } finally {
      toast.dismiss(toastId)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const BuscarTicketFiltro = useCallback(async () => {
    resetTickets()
    setLoading(true)
    await consultaTickets(pesquisaTickets)
    setLoading(false)
  }, [pesquisaTickets, resetTickets])

  // const onLoadMore = async () => {
  //   if (tickets.length === 0 || !hasMore || loading) {
  //     return
  //   }
  //   try {
  //     setLoading(true)
  //     pesquisaTickets.pageNumber++
  //     await consultaTickets()
  //     setLoading(false)
  //   } catch (error) {
  //     setLoading(false)
  //   }
  // }

  // async function listarUsuarios() {
  //   try {
  //     const { data } = await ListarUsuarios()
  //     setUsuarios(data.users)
  //   } catch (error) {
  //     Errors(error)
  //   }
  // }
  const scrollToBottom = () => {
    setTimeout(() => {
      document
        .getElementById('inicioListaMensagensChat')
        ?.scrollIntoView({ behavior: 'smooth' })
    }, 200)
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Adiciona o listener ao montar o componente
    eventEmitter.on('scrollToBottomMessageChat', scrollToBottom)
    // Remove o listener ao desmontar o componente
    scrollToBottom()
    return () => {
      eventEmitter.off('scrollToBottomMessageChat', scrollToBottom)
    }
  }, [])

  const listarFilas = useCallback(async () => {
    try {
      const { data } = await ListarFilas()
      setFilas(data)
      localStorage.setItem('filasCadastradas', JSON.stringify(data || []))
    } catch (error) {
      Errors(error)
    }

  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const listarWhatsapps = useCallback(async () => {
    if (!whatsApps.length) {
      try {
        const { data } = await ListarWhatsapps()
        loadWhatsApps(data)
      } catch (error) {
        Errors(error)
      }

    }
  }, [])

  useEffect(() => {
    localStorage.setItem('filtrosAtendimento', JSON.stringify(pesquisaTickets))
  }, [pesquisaTickets]) // Executa sempre que pesquisaTickets mudar

  useEffect(() => {
    BuscarTicketFiltro()
  }, [BuscarTicketFiltro])

  const listarEtiquetas = useCallback(async () => {
    try {
      const { data } = await ListarEtiquetas(true)
      setEtiquetas(data)
    } catch (error) {
      Errors(error)
    }

  }, [])

  const pendingTickets = (): Ticket[] => {
    const filteredTickets = tickets.filter(
      ticket => ticket.status === 'pending' && !ticket.isGroup
    )
    const groupedTickets = filteredTickets.reduce((acc, ticket) => {
      const key = `${ticket.whatsappId}_${ticket.userId}_${ticket.status}_${ticket.contactId}`
      if (!acc[key] || acc[key].id > ticket.id) {
        acc[key] = ticket
      }
      return acc
    }, {})
    // const groupedTicketIds = new Set(
    //   Object.values(groupedTickets).map(ticket => ticket.id)
    // )
    // const remainingTickets = filteredTickets.filter(
    //   ticket => !groupedTicketIds.has(ticket.id)
    // )

    // remainingTickets.forEach(ticket => {
    //     AtualizarStatusTicketNull(ticket.id, 'closed', ticket.userId);
    //     console.log(`Ticket duplo ${ticket.id} tratado.`);
    // });
    return Object.values(groupedTickets)
  }

  function openTickets(): Ticket[] {
    const filteredTickets = tickets.filter(ticket => {
      if (profile === 'admin') {
        return ticket.status === 'open' && !ticket.isGroup
      }
      return (
        ticket.status === 'open' && !ticket.isGroup && ticket.userId === +userid
      )
    })
    const groupedTickets = filteredTickets.reduce((acc, ticket) => {
      const key = `${ticket.whatsappId}_${ticket.userId}_${ticket.status}_${ticket.contactId}`
      if (!acc[key] || acc[key].id > ticket.id) {
        acc[key] = ticket
      }
      return acc
    }, {})

    // const groupedTicketIds = new Set(
    //   Object.values(groupedTickets).map(ticket => ticket.id)
    // )
    // const remainingTickets = filteredTickets.filter(
    //   ticket => !groupedTicketIds.has(ticket.id)
    // )
    // remainingTickets.forEach(ticket => {
    //     AtualizarStatusTicketNull(ticket.id, 'closed', ticket.userId);
    //     console.log(`Ticket duplo ${ticket.id} tratado.`);
    // });
    // return Object.values(groupedTickets).slice(0, this.batchSize);
    return Object.values(groupedTickets)
  }
  function closedTickets(): Ticket[] {
    return tickets
      .filter(ticket => ticket.status === 'closed' && !ticket.isGroup)
      .slice(0, 15)
    // return this.tickets.filter(ticket => ticket.status === 'closed' && !ticket.isGroup).slice(0, this.batchSize);
  }
  function closedGroupTickets(): Ticket[] {
    return tickets
      .filter(ticket => ticket.status === 'closed' && ticket.isGroup)
      .slice(0, 5)
    // return this.tickets.filter(ticket => ticket.status === 'closed' && ticket.isGroup).slice(0, this.batchSize);
  }
  function openGroupTickets(): Ticket[] {
    // return this.tickets.filter(ticket => ticket.status === 'open' && ticket.isGroup)
    const filteredTickets = tickets.filter(
      ticket => ticket.status === 'open' && ticket.isGroup
    )
    const groupedTickets = filteredTickets.reduce((acc, ticket) => {
      const key = `${ticket.whatsappId}_${ticket.userId}_${ticket.status}_${ticket.contactId}`
      if (!acc[key] || acc[key].id > ticket.id) {
        acc[key] = ticket
      }
      return acc
    }, {})
    return Object.values(groupedTickets)
    // return Object.values(groupedTickets).slice(0, this.batchSize);
  }
  function pendingGroupTickets(): Ticket[] {
    // return this.tickets.filter(ticket => ticket.status === 'pending' && ticket.isGroup)
    const filteredTickets = tickets.filter(
      ticket => ticket.status === 'pending' && ticket.isGroup
    )
    const groupedTickets = filteredTickets.reduce((acc, ticket) => {
      const key = `${ticket.whatsappId}_${ticket.userId}_${ticket.status}_${ticket.contactId}`
      if (!acc[key] || acc[key].id > ticket.id) {
        acc[key] = ticket
      }
      return acc
    }, {})
    return Object.values(groupedTickets)
    // return Object.values(groupedTickets).slice(0, this.batchSize);
  }
  // function privateMessages(): Ticket[] {
  //   return tickets.filter(ticket => ticket.unreadMessages && !ticket.isGroup)
  // }
  // function groupMessages(): Ticket[] {
  //   return tickets.filter(ticket => ticket.unreadMessages && ticket.isGroup)
  // }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Adiciona o listener ao montar o componente
    eventEmitter.on('handlerNotifications', handlerNotifications)
    eventEmitter.on('playSoundNotification', playNotificationSound)
    // Remove o listener ao desmontar o componente
    return () => {
      eventEmitter.off('handlerNotifications', handlerNotifications)
      eventEmitter.off('playSoundNotification', playNotificationSound)
    }
  }, [])


  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    socketTicketList()
    socketTicket()
    return () => {
      socketDisconnect()
    }
  }, [])
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    listarConfiguracoes()

    listarFilas()
    listarWhatsapps()
    // listarUsuarios()
    listarEtiquetas()
    // resetTickets()
    const filtros = JSON.parse(localStorage.getItem('filtrosAtendimento'))
    if (filtros?.pageNumber !== 1) {
      localStorage.setItem(
        'filtrosAtendimento',
        JSON.stringify(pesquisaTickets)
      )
    }
    return () => {
      resetTickets()
      setTicketFocado({
        whatsapp: undefined,
        channel: '',
        lastMessageAt: undefined,
        updatedAt: undefined,
        user: undefined,
        username: undefined,
        contactId: undefined,
        id: undefined,
        name: '',
        lastMessage: '',
        profilePicUrl: '',
      });
    }
  }, [])
  const { setContatoSelecionado } = useApplicationStore()
  const closeModalNovoTicket = () => {
    setOpenModalNovoTicket(false)
    setContatoSelecionado(undefined)
  }
  const { contatos, loadContacts } = useContatosStore()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const listaContatos = useCallback(async () => {
    try {
      const { data } = await ListarContatos({})
      loadContacts(data.contacts)
    } catch (error) {
      Errors(error)
    }

  }, [])
  const listarMensagensRapidas = useCallback(async () => {
    try {
      const { data } = await ListarMensagensRapidas()
      setMensagensRapidas(data)
    } catch (error) {
      Errors(error)
    }

  }, [])
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!contatos.length) listaContatos()
    if (!mensagensRapidas.length) listarMensagensRapidas()
  }, [])

  const handleClick = () => {
    if (mobileOpen) {
      // Lógica para quando estiver dentro de um modal
      setOpenModalNovoTicket(true)
    } else {
      nav('/atendimento/chat-contatos')
      return
    }
  }
  const efetuarLogout = async () => {
    try {
      await RealizarLogout(usuario)
      logout()
    } catch (error) {
      toast.error(`Não foi possível realizar logout ${error}`, {
        position: 'top-center',
      })
    }
  }
  const drawer = (
    <>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Button onClick={handleOpenNavMenu} sx={{
          display: { xs: 'none', sm: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}>
          {username}
          <ArrowDownwardSharp fontSize="small" />
        </Button>
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
          anchorEl={anchorElNav}
          onClose={handleCloseNavMenu}
          open={openNav}
        >
          <MenuList>
            <MenuItem onClick={() => handleOpenModalUsuario(usuario)}>
              <Person />
              <Typography>Perfil</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => efetuarLogout()}
            >
              <Logout />
              <Typography>Sair</Typography>
            </MenuItem>
            <Divider sx={{ mb: 1 }} />
          </MenuList>
        </StyledMenu>
        <Button onClick={() => nav('/')}>
          <Home />
        </Button>
      </Toolbar>
      <List>
        <Tabs
          value={tabTickets}
          onChange={handleChangeTabs}
          aria-label="Vertical tabs example"
          variant="fullWidth"
          centered
        >
          <Tooltip title="Conversas em Privadas" arrow>
            <Tab
              sx={{ borderRight: 1, borderColor: 'divider' }}
              icon={<PersonIcon />}
              disableRipple
              className="relative"
              {...a11yProps(0, 'private')}
            />
          </Tooltip>
          <Tooltip title="Conversas em Grupo" arrow>
            <Tab icon={<PeopleAltIcon />} {...a11yProps(1, 'group')} />
          </Tooltip>
        </Tabs>

        <Toolbar sx={{ justifyContent: 'space-between', px: 1 }} disableGutters>
          <Button onClick={handleOpenFiltro} size="medium">
            <FilterAltIcon />
          </Button>
          <StyledMenu
            id="filtro"
            MenuListProps={{
              'aria-labelledby': 'customized-button',
            }}
            anchorEl={anchorElFiltro}
            onClose={handleCloseFiltro}
            open={openFiltro}
          >
            <MenuList>
              <MenuItem>
                {profile === 'admin' && (
                  <>
                    <div
                      className={`flex items-center ml-4 ${switchStates.showAll ? 'mb-4' : ''}`}
                    >
                      <Switch
                        name="showAll"
                        checked={switchStates.showAll}
                        onChange={handleChange}
                        color="primary"
                      />
                      {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                      <label className="ml-2 text-sm text-gray-700">
                        Visualizar Todos
                      </label>
                    </div>
                    {pesquisaTickets.showAll && <Divider />}
                  </>
                )}
              </MenuItem>
              <MenuItem
              // onClick={efetuarLogout}
              >
                {!pesquisaTickets.showAll && (
                  <Box
                    sx={{ gap: 2, flexDirection: 'column', display: 'flex' }}
                  >
                    <Divider />
                    <SelectComponent
                      cUserQueues={filas}
                      pesquisaTickets={pesquisaTickets}
                      filterFilas={filterFilas}
                    />
                    <FormControl component="fieldset">
                      <FormGroup aria-label="position">
                        <FormControlLabel
                          value={pesquisaTickets.status.includes('open')}
                          control={
                            <Checkbox
                              checked={pesquisaTickets.status.includes('open')}
                              onChange={() => statusTickets('open')}
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  borderRadius: '50%', // ou manter quadrado se preferir
                                  border: '2px solid currentColor', // ajusta a borda
                                  fill: 'transparent', // remove o preenchimento interno
                                },
                              }}
                            />
                          }
                          label="Abertos"
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          value={pesquisaTickets.status.includes('pending')}
                          control={
                            <Checkbox
                              checked={pesquisaTickets.status.includes(
                                'pending'
                              )}
                              onChange={() => statusTickets('pending')}
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  borderRadius: '50%', // ou manter quadrado se preferir
                                  border: '2px solid currentColor', // ajusta a borda
                                  fill: 'transparent', // remove o preenchimento interno
                                },
                              }}
                            />
                          }
                          label="Pendentes"
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          value={pesquisaTickets.status.includes('closed')}
                          control={
                            <Checkbox
                              checked={pesquisaTickets.status.includes(
                                'closed'
                              )}
                              onChange={() => statusTickets('closed')}
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  borderRadius: '50%', // ou manter quadrado se preferir
                                  border: '2px solid currentColor', // ajusta a borda
                                  fill: 'transparent', // remove o preenchimento interno
                                },
                              }}
                            />
                          }
                          label="Resolvidos"
                          labelPlacement="end"
                        />
                      </FormGroup>
                    </FormControl>
                    <Divider />

                    <div className="flex items-center ml-4">
                      <Switch
                        checked={switchStates.withUnreadMessages}
                        name="withUnreadMessages"
                        onChange={handleChange}
                        color="primary"
                      />
                      {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                      <label className="ml-2 text-sm text-gray-700">
                        Somente Tickets com mensagens não lidas
                      </label>
                    </div>
                    <div className="flex items-center ml-4">
                      <Switch
                        checked={switchStates.isNotAssignedUser}
                        name="isNotAssignedUser"
                        onChange={handleChange}
                        color="primary"
                      />
                      {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                      <label className="ml-2 text-sm text-gray-700">
                        Somente Tickets não atribuidos (sem usuário definido)
                      </label>
                    </div>
                    <Button
                      variant="contained"
                      onClick={handleCloseFiltro}
                      color="info"
                    >
                      Fechar
                    </Button>
                  </Box>
                )}
                {!pesquisaTickets.showAll && <Divider />}
              </MenuItem>
              <Divider sx={{ mb: 1 }} />
            </MenuList>
          </StyledMenu>
          <TextField
            id="standard-basic"
            label="Pesquisa"
            variant="standard"
            size="small"
            onChange={handleInputChange}
          />
          <Button onClick={handleClick}>
            <ContactPage />
          </Button>
        </Toolbar>
        <Divider />
      </List>

      {tabTickets === 0 && (
        <Tabs
          sx={{ mt: 2 }}
          variant="fullWidth"
          value={tabTicketsStatus}
          onChange={(_event, newValue) => setTabTicketsStatus(newValue)}
        >
          <Tab
            label={
              openTickets().length ? (
                <Badge
                  color="error"
                  variant="dot"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {' '}
                  Abertos
                </Badge>
              ) : (
                'Abertos'
              )
            }
            value="open"
            disableRipple
          />

          <Tab
            label={
              pendingTickets().length ? (
                <Badge
                  color="error"
                  variant="dot"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {' '}
                  Pendente
                </Badge>
              ) : (
                'Pendente'
              )
            }
            value="pending"
            disableRipple
          />
          <Tab label="Fechado" value="closed" disableRipple />

        </Tabs>
      )}

      {tabTickets === 1 && (
        <Tabs
          sx={{ mt: 2 }}
          variant="fullWidth"
          value={tabTicketsStatus}
          onChange={(_event, newValue) => setTabTicketsStatus(newValue)}
        >
          <Tab
            label={
              openGroupTickets().length ? (
                <Badge
                  color="error"
                  variant="dot"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {' '}
                  Abertos
                </Badge>
              ) : (
                'Abertos'
              )
            }
            value="open"
            disableRipple
          />

          <Tab
            label={
              pendingGroupTickets().length ? (
                <Badge
                  color="error"
                  variant="dot"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {' '}
                  Pendente
                </Badge>
              ) : (
                'Pendente'
              )
            }
            value="pending"
            disableRipple
          />
          <Tab label="Fechado" value="closed" disableRipple />
        </Tabs>
      )}

      <TabPanel value={tabTickets} index={0}>
        <List
          sx={{
            // width: '100%',
            gap: 1,
          }}
        >
          {tabTicketsStatus === 'open' &&
            //  <ItemTicket key={tickets[0].id} ticket={tickets[0]} filas={filas} etiquetas={etiquetas} buscaTicket={false} />
            openTickets().map(ticket => (
              <ItemTicket key={ticket.id} ticket={ticket} filas={filas} />
            ))}
          {tabTicketsStatus === 'pending' &&
            pendingTickets().map(ticket => (
              <ItemTicket key={ticket.id} ticket={ticket} filas={filas} />
            ))}
          {tabTicketsStatus === 'closed' &&
            closedTickets().map(ticket => (
              <ItemTicket key={ticket.id} ticket={ticket} filas={filas} />
            ))}
        </List>
      </TabPanel>

      <TabPanel value={tabTickets} index={1}>
        <List
          sx={{
            // width: '100%',
            gap: 1,
          }}
        >
          {tabTickets === 1 &&
            tabTicketsStatus === 'open' &&
            openGroupTickets().map(ticket => (
              <ItemTicket key={ticket.id} ticket={ticket} filas={filas} />
            ))}
          {tabTickets === 1 &&
            tabTicketsStatus === 'pending' &&
            pendingGroupTickets().map(ticket => (
              <ItemTicket key={ticket.id} ticket={ticket} filas={filas} />
            ))}
          {tabTickets === 1 &&
            tabTicketsStatus === 'closed' &&
            closedGroupTickets().map(ticket => (
              <ItemTicket key={ticket.id} ticket={ticket} filas={filas} />
            ))}
        </List>
      </TabPanel>
      <Box
        sx={{
          px: 2,
          height: 60,
          display: 'inline-flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <ToggleColorMode
          data-screenshot="toggle-mode"
          mode={mode}
          toggleColorMode={handleToggleColor}
        />
        {whatsApps?.map(item => (
          <Box
            key={item.id}
            sx={{ mx: 0.5, p: 0, display: 'flex', alignItems: 'center' }}
          >
            {' '}
            {/* Equivalente a `q-mx-xs` e `q-pa-none` */}
            <Tooltip
              title={item.status}
              placement="top"
              sx={{
                maxHeight: 300,
                bgcolor: 'blue.100',
                color: 'grey.900',
                overflowY: 'auto',
              }}
            >
              <IconButton
                sx={{
                  borderRadius: '50%', // Equivalente ao `rounded`
                  opacity: item.status === 'CONNECTED' ? 1 : 0.5, // Condição de opacidade
                  p: 0, // Remove padding para replicar `flat`
                  width: 36, // Tamanho equivalente ao `size="18px"` ajustado
                  height: 36,
                }}
              >
                {/* O ícone pode ser um `img` ou `Avatar` */}
                <Avatar
                  src={`../${item.type}-logo.png`}
                  sx={{ width: 18, height: 18 }} // Ajuste do tamanho do ícone
                />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Box>
    </>
  )
  useSocketInitial()

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <InfoCabecalhoMenssagens />
        <Box
          component="aside"
          sx={{
            width: { sm: 0, md: '380px' },
            flexShrink: { sm: 0 },
            overflow: 'auto',
          }}
          aria-label="Drawer"
        >
          <Drawer
            // container={container}
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              // zIndex: 2000,
              display: { xs: 'block', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: { md: drawerWidth, sm: drawerWidth },
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Outlet context={{ mensagensRapidas }} />
        {modalUsuario && <ModalUsuario />}
        {openModalNovoTicket && (
          <ModalNovoTicket
            open={openModalNovoTicket}
            close={closeModalNovoTicket}
          />
        )}
        <audio ref={audioRef}>
          <source src={alertSound} type="audio/mp3" />
        </audio>
      </Box>
    </>
  )
}
