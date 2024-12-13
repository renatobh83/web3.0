import type React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import ForumIcon from '@mui/icons-material/Forum'
import CellWifiIcon from '@mui/icons-material/CellWifi'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import ReplyIcon from '@mui/icons-material/Reply'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SettingsIcon from '@mui/icons-material/Settings'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import WebhookIcon from '@mui/icons-material/Webhook'

import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface MenuDataItem {
  title: boolean
  // Adicione outras propriedades do item do menu se necessário
}

interface Props {
  userProfile: string | null
  exibirMenuBeta?: (item: MenuDataItem) => boolean
  state: boolean
}

export const MenuComponent: React.FC<Props> = ({ userProfile, state }) => {
  const navigate = useNavigate()
  const cRouterName = location.pathname.split('/').pop()

  const handleClick = (routeName: string) => {
    if (routeName !== cRouterName) {
      navigate(`/${routeName}`)
    }
  }
  const menuData = [
    {
      title: 'Dashboard',
      caption: '',
      icon: <HomeIcon />,
      routeName: '',
    },

    {
      title: 'Atendimentos',
      caption: 'Lista de atendimentos',
      icon: <ForumIcon />,
      routeName: 'atendimento',
    },
    {
      title: 'Contatos',
      caption: 'Lista de contatos',
      icon: <PeopleAltIcon />,
      routeName: 'contatos',
    },
  ]

  const menuDataAdmin = [
    {
      title: 'Canais',
      caption: 'Canais de Comunicação',
      icon: <CellWifiIcon />,
      routeName: 'sessoes',
    },
    {
      title: 'Kanbam',
      caption: 'Lista de atendimentos',
      icon: <ForumIcon />,
      routeName: 'kanban',
    },
    {
      title: 'Painel Atendimentos',
      caption: 'Visão geral dos atendimentos',
      icon: <DashboardIcon />,
      routeName: 'painel-atendimentos',
    },
    // {
    //     title: 'Relatórios',
    //     caption: 'Relatórios gerais',
    //     icon: <SummarizeIcon />,
    //     routeName: 'relatorios'
    // },
    {
      title: 'Usuarios',
      caption: 'Admin de usuários',
      icon: <GroupIcon />,
      routeName: 'usuarios',
    },
    {
      title: 'Filas',
      caption: 'Cadastro de Filas',
      icon: <CallSplitIcon />,
      routeName: 'filas',
    },
    {
      title: 'Mensagens Rápidas',
      caption: 'Mensagens pré-definidas',
      icon: <ReplyIcon />,
      routeName: 'mensagens-rapidas',
    },
    {
      title: 'Chatbot',
      caption: 'Robô de atendimento',
      icon: <SmartToyIcon />,
      routeName: 'chat-flow',
    },
    // {
    //     title: 'Etiquetas',
    //     caption: 'Cadastro de etiquetas',
    //     icon: <LabelIcon />,
    //     routeName: 'etiquetas'
    // },
    {
      title: 'Horário de Atendimento',
      caption: 'Horário de funcionamento',
      icon: <ScheduleIcon />,
      routeName: 'horarioAtendimento',
    },
    {
      title: 'Configurações',
      caption: 'Configurações gerais',
      icon: <SettingsIcon />,
      routeName: 'configuracoes',
    },
    {
      title: 'Campanha',
      caption: 'Campanhas de envio',
      icon: <StickyNote2Icon />,
      routeName: 'campanhas',
    },
    {
      title: 'API',
      caption: 'Integração sistemas externos',
      icon: <WebhookIcon />,
      routeName: 'api-service',
    },
  ]
  return (
    <List>
      {menuData.map(item => (
        <ListItem
          key={item.title}
          disablePadding
          sx={{ display: 'block', fontSize: 1 }}
        >
          <ListItemButton
            sx={[
              {
                minHeight: 48,
                px: 2.5,
              },
              state
                ? {
                  justifyContent: 'initial',
                }
                : {
                  justifyContent: 'center',
                },
            ]}
            onClick={() => handleClick(item.routeName)}
          >
            {' '}
            <ListItemIcon
              sx={[
                {
                  minWidth: 0,
                  justifyContent: 'center',
                },
                state
                  ? {
                    mr: 3,
                  }
                  : {
                    mr: 'auto',
                  },
              ]}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              secondary={item.caption}
              sx={[
                state
                  ? {
                    opacity: 1,
                  }
                  : {
                    opacity: 0,
                  },
              ]}
            />
          </ListItemButton>
        </ListItem>
      ))}
      <Divider />
      {userProfile === 'admin' && (
        // biome-ignore lint/complexity/noUselessFragments: <explanation>
        <>
          {menuDataAdmin.map(item => (
            <ListItem key={item.title} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  state
                    ? {
                      justifyContent: 'initial',
                    }
                    : {
                      justifyContent: 'center',
                    },
                ]}
                onClick={() => handleClick(item.routeName)}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    state
                      ? {
                        mr: 3,
                      }
                      : {
                        mr: 'auto',
                      },
                  ]}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={item.caption}
                  sx={[
                    state
                      ? {
                        opacity: 1,
                      }
                      : {
                        opacity: 0,
                      },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </>
      )}
    </List>
  )
}
