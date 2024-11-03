import { Settings, Webhook } from '@mui/icons-material'
import {
  Box,
  List,
  ListItemText,
  Switch,
  Tab,
  Tabs,
  TextField,
} from '@mui/material'
import type React from 'react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  AlterarConfiguracao,
  ListarConfiguracoes,
} from '../../services/configuracoes'
import { debounce } from 'lodash'
import { toast } from 'sonner'
import { WebhookConfiguracao } from '../../components/configuracoes/WebhookComponent'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const keyValues = {
  userCreation: {
    title: 'Criação de usuario',
    subtitle: 'Permitir que um novo usuario se registre pela tela e login.',
  },
  NotViewTicketsQueueUndefined: {
    title: 'Não visualizar Tickets sem fila definida',
    subtitle:
      'Somente administradores poderão visualizar tickets que não estiverem em fila.',
  },
  botTicketActive: {
    title: 'Fluxo ativo para o Bot de atendimento',
    subtitle: 'Fluxo a ser utilizado pelo Bot para os novos atendimentos',
  },
  NotViewAssignedTickets: {
    title: 'Não visualizar Tickets já atribuidos à outros usuários',
    subtitle:
      'Somente o usuário responsável pelo ticket e/ou os administradores visualizarão a atendimento.',
  },
  NotViewTicketsChatBot: {
    title: 'Não visualizar Tickets no ChatBot',
    subtitle:
      'Somente administradores poderão visualizar tickets que estiverem interagindo com o ChatBot.',
  },
  DirectTicketsToWallets: {
    title: 'Forçar atendimento via Carteira',
    subtitle:
      'Caso o contato tenha carteira vínculada, o sistema irá direcionar o atendimento somente para os donos da carteira de clientes.',
  },
  ignoreGroupMsg: {
    title: 'Ignorar Mensagens de Grupo',
    subtitle: 'Habilitando esta opção o sistema não abrirá ticket para grupos.',
  },
  rejectCalls: {
    title: 'Recusar chamadas no Whatsapp',
    subtitle:
      'Quando ativo, as ligações de aúdio e vídeo serão recusadas, automaticamente.',
  },
  callRejectMessage: {
    title: 'Mensagem para ligações recusadas',
    subtitle:
      'Mensagem enviada quando as ligações de aúdio e vídeo forem recusadas, automaticamente.',
  },
  chatbotLane: {
    title: 'Habilitar guia de atendimento de Chatbots',
    subtitle:
      'Habilitando esta opção será adicionada uma guia de atendimento exclusiva para os chatbots.',
  },
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      // biome-ignore lint/a11y/useSemanticElements: <explanation>
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export const Configuracoes = () => {
  const { decryptData, encryptData } = useAuth()
  const [value, setValue] = useState(0)
  const confi = JSON.parse(decryptData('configuracoes') || '[]')
  const [configuracoesOpcoes, setConfiguracoesOpcoes] = useState(confi || [])
  const usuario = JSON.parse(decryptData('usuario'))

  useEffect(() => {
    setConfiguracoesOpcoes(confi)
  }, [confi])

  const handleChangeCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const isChecked = event.target.checked
    setConfiguracoesOpcoes(prevState =>
      prevState.map(config =>
        config.key === key
          ? { ...config, value: isChecked ? 'enabled' : 'disabled' }
          : config
      )
    )
    const params = { key, value: isChecked ? 'enabled' : 'disabled' }
    debounceChange(params)
  }

  const debounceChange = debounce(params => {
    AlterarConfiguracao(params).then(async data => {
      if (data.status === 200) {
        toast.info('Configuração atualizada')
        const { data } = await ListarConfiguracoes()
        localStorage.setItem('configuracoes', encryptData(JSON.stringify(data)))
      }
    })
  }, 1500)

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleChangeText = (value: string, key: string) => {
    setConfiguracoesOpcoes(prevState =>
      prevState.map(config =>
        config.key === key ? { ...config, value } : config
      )
    )
    debounceChange({ key, value })
  }

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChangeTab}
          aria-label="basic tabs example"
        >
          <Tab
            label="Configurações Gerais"
            {...a11yProps(0)}
            icon={<Settings />}
          />
          {usuario.profile === 'admin' && (
            <Tab
              label="Configuração Webhooks"
              {...a11yProps(1)}
              icon={<Webhook />}
            />
          )}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {configuracoesOpcoes
          .filter(id => id.tenantId === usuario.tenantId)
          .map(item => (
            <List
              key={item.id}
              component="nav"
              aria-label="main mailbox folders"
            >
              <Box sx={{ display: 'flex' }}>
                <ListItemText secondary={keyValues[item.key]?.subtitle || ''}>
                  {keyValues[item.key]?.title || 'Valor não encontrado'}
                </ListItemText>
                {item.value === 'disabled' || item.value === 'enabled' ? (
                  <Switch
                    checked={item.value === 'enabled'}
                    onChange={e => handleChangeCheck(e, item.key)}
                  />
                ) : (
                  <TextField
                    onChange={e => handleChangeText(e.target.value, item.key)}
                    variant="filled"
                    multiline
                    rows={item.key === 'callRejectMessage' ? 3 : 0}
                    value={item.value || ''}
                    sx={{
                      width:
                        item.key === 'callRejectMessage' ? '280px' : '60px',
                    }}
                    inputProps={{ style: { textAlign: 'right' } }}
                  />
                )}
              </Box>
            </List>
          ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <WebhookConfiguracao />
      </CustomTabPanel>
    </Box>
  )
}
