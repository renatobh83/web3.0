import { Logout, Person } from '@mui/icons-material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountBoxRounded from '@mui/icons-material/AccountBoxRounded'
import {
  alpha,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  type MenuProps,
  Stack,
  styled,
  Switch,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material'
import { useEffect, useState } from 'react'
import ToggleColorMode from '../MaterialUi/Login/ToggleColorMode'
import { useNotificationsStore } from '../../store/notifications'
import { red, green } from '@mui/material/colors'
import SystemVersion from './SystemVersion'
import { toast } from 'sonner'
import { useApplicationStore } from '../../store/application'
import { useAtendimentoTicketStore } from '../../store/atendimentoTicket'
import { useLocation, useNavigate } from 'react-router-dom'
import { ModalUsuario } from '../../pages/Usuarios/ModalUsuario'
import { useUsuarioStore } from '../../store/usuarios'
import { RealizarLogout } from '../../services/login'
import { useAuth } from '../../context/AuthContext'
import { useAtendimentoStore } from '../../store/atendimento'
import { Errors } from '../../utils/error'
import { ConsultarTickets } from '../../services/tickets'
import { useWhatsappStore } from '../../store/whatsapp'
import React from 'react'
import checkTicketFilter from '../../utils/checkTicketFilter'

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

export const MenusNavbar = () => {
  const { decryptData, logout } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const {
    notifications,
    notificationsP,
    updateNotifications,
    updateNotificationsP,
  } = useNotificationsStore()
  const { mode, setMode } = useColorScheme()
  const [status, setStatus] = useState(false)
  const usuario = JSON.parse(decryptData('usuario'))

  const username = localStorage.getItem('username')
  const { themeMode, toggleThemeMode } = useApplicationStore()
  const AbrirChatMensagens = useAtendimentoTicketStore(
    s => s.AbrirChatMensagens
  )
  const setHasMore = useAtendimentoTicketStore(s => s.setHasMore)
  const ticketFocado = useAtendimentoTicketStore(s => s.ticketFocado)

  const { setUsuarioSelecionado, toggleModalUsuario, modalUsuario } =
    useUsuarioStore()

  const handleOpenModalUsuario = usuario => {
    setUsuarioSelecionado(usuario)
    toggleModalUsuario()
  }
  const user = +localStorage.getItem('userId')
  const { mobileOpen, setMobileOpen } = useAtendimentoStore()
  const goToChat = async (id: number) => {
    try {
      const timestamp = new Date().getTime()
      navigate(`/atendimento/${id}?t=${timestamp}`, {
        replace: false,
        state: { t: new Date().getTime() },
      })
    } catch (error) {
      Errors(error)
    } finally {
      if (mobileOpen) setMobileOpen(false)
    }
  }
  function abrirChatContato(ticket) {
    if ('id' in ticketFocado) {
      if (
        !(
          ticket.status !== 'pending' &&
          (ticket.id !== ticketFocado.id || location.pathname !== 'chat')
        )
      )
        return
    }
    setHasMore(true)
    AbrirChatMensagens(ticket)
    goToChat(ticket.id)
  }

  useEffect(() => {
    setMode(themeMode)
  }, [themeMode, setMode])

  const handleToggleColor = () => {
    toggleThemeMode() // Alterna o tema na store
  }
  const { whatsApps } = useWhatsappStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const { encryptData } = useAuth()
  const open = Boolean(anchorEl)
  const openNav = Boolean(anchorElNav)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleUpdateUser = async e => {
    if (usuario) {
      usuario.status = e.target.checked ? 'online' : 'offline'
    }
    localStorage.setItem('usuario', encryptData(JSON.stringify(usuario)))
    setStatus(e.target.checked)
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
  // useEffect(() => {
  //   console.log('notificacaoTicket Update', notifications, notificationsP)
  // }, [notificacaoTicket])
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (usuario) {
      setStatus(usuario.status === 'online')
    }
  }, [])

  const consultaTickets = async () => {
    const paramsOpen = {
      searchParam: '',
      pageNumber: 1,
      status: ['open'],
      showAll: false,
      count: null,
      queuesIds: [],
      withUnreadMessages: false,
      isNotAssignedUser: false,
      includeNotQueueDefined: true,
    }
    try {
      const response = await ConsultarTickets(paramsOpen)

      updateNotifications(response.data)
    } catch (error) {}
    const paramsPending = {
      searchParam: '',
      pageNumber: 1,
      status: ['pending'],
      showAll: false,
      count: null,
      queuesIds: [],
      withUnreadMessages: false,
      isNotAssignedUser: false,
      includeNotQueueDefined: true,
    }
    try {
      const response = await ConsultarTickets(paramsPending)
      updateNotificationsP(response.data)
    } catch (error) {}
  }
  const userNotificationsCount = notifications.tickets
    .filter(ticket => ticket.userId === user)
    .reduce((acc, ticket) => acc + Number(ticket.unreadMessages), 0)

  const totalNotificationsCount =
    userNotificationsCount + Number(notificationsP.count)
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    consultaTickets()
  }, [])
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ justifyContent: 'center', alignItems: 'center' }}
    >
      {whatsApps?.map(item => (
        <React.Fragment key={item.id}>
          {/* Equivalente a `q-mx-xs` e `q-pa-none` */}
          <Tooltip
            arrow
            title={
              item.status === 'CONNECTED'
                ? `Esta conectado na conta  ${item.phone.pushname}-${item.phone.wid.user}`
                : item.status
            }
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
                padding: 0,
                width: 30, // Tamanho equivalente ao `size="18px"` ajustado
                height: 30,
              }}
            >
              {/* O ícone pode ser um `img` ou `Avatar` */}
              <Avatar
                src={`../${item.type}-logo.png`}
                sx={{ width: 18, height: 18 }} // Ajuste do tamanho do ícone
              />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      ))}
      <Tooltip title="Notificações" arrow placement="left">
        <>
          <Button onClick={handleClick}>
            {Number(notificationsP.count) + Number(notifications.count) ===
            0 ? (
              <NotificationsNoneIcon />
            ) : (
              <Badge badgeContent={totalNotificationsCount} color="primary">
                <NotificationsIcon />
              </Badge>
            )}
          </Button>
          <StyledMenu
            id="customized-menu"
            MenuListProps={{
              'aria-labelledby': 'customized-button',
            }}
            anchorEl={anchorEl}
            onClose={handleClose}
            open={open}
          >
            {Number(notificationsP.count) + Number(notifications.count) ===
            0 ? (
              <MenuItem onClick={handleClose} disableRipple>
                <Typography>Não a nada de novo por aqui!!</Typography>
              </MenuItem>
            ) : (
              <MenuList sx={{ display: 'flex', gap: 2 }}>
                {Number(notificationsP.count) > 0 && (
                  <MenuItem onClick={() => navigate('/atendimento')}>
                    <Typography>
                      {notificationsP.count} Clientes pendentes na fila{' '}
                    </Typography>
                  </MenuItem>
                )}

                {notifications?.tickets
                  ?.filter(i => i.userId === user)
                  .map(ticket => (
                    <MenuItem
                      key={ticket.id}
                      sx={{ display: 'flex', gap: 3 }}
                      onClick={() => abrirChatContato(ticket)}
                    >
                      <Avatar src={ticket.profilePicUrl ?? ''} />
                      <div>
                        <ListItemText>{ticket.name}</ListItemText>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            width: '150px',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                          }}
                        >
                          {ticket.lastMessage}
                        </Typography>
                      </div>
                    </MenuItem>
                  ))}
              </MenuList>
            )}
          </StyledMenu>
        </>
      </Tooltip>
      <Tooltip
        title={
          usuario?.status === 'offline' ? 'Usuário Offiline' : 'Usuário Online'
        }
      >
        <Avatar
          sx={{
            width: 26,
            height: 26,
            bgcolor: usuario?.status === 'offline' ? red[400] : green[400],
          }}
        />
      </Tooltip>
      <Button onClick={handleOpenNavMenu}>
        <AccountBoxRounded />
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
          <Typography>
            Ola <b>{username}</b>
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <MenuItem>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch checked={status} onChange={handleUpdateUser} />
                }
                label={usuario.status}
              />
            </FormGroup>
          </MenuItem>
          <MenuItem onClick={() => handleOpenModalUsuario(usuario)}>
            <Person />
            <Typography>Perfil</Typography>
          </MenuItem>
          <MenuItem onClick={() => efetuarLogout()}>
            <Logout />
            <Typography>Sair</Typography>
          </MenuItem>
          <Divider sx={{ mb: 1 }} />
          <MenuItem sx={{ justifyContent: 'center' }}>
            <SystemVersion />
          </MenuItem>
        </MenuList>
      </StyledMenu>
      <ToggleColorMode
        data-screenshot="toggle-mode"
        mode={mode}
        toggleColorMode={handleToggleColor}
      />
      {modalUsuario && <ModalUsuario />}
    </Stack>
  )
}
