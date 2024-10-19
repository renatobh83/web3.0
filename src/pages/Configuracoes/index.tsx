import { Settings } from '@mui/icons-material'
import { Box, Checkbox, List, ListItem, ListItemText, Tab, Tabs, TextField, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
const keyValues = {
  botTicketActive  : {title: 'Fluxo ativo para o Bot de atendimento', subtitle: 'Fluxo a ser utilizado pelo Bot para os novos atendimentos'},
  NotViewAssignedTickets  : {title: 'Não visualizar Tickets já atribuidos à outros usuários', subtitle: 'Somente o usuário responsável pelo ticket e/ou os administradores visualizarão a atendimento.'},
  NotViewTicketsChatBot  : {title: 'Não visualizar Tickets no ChatBot', subtitle: 'Somente administradores poderão visualizar tickets que estivem interagindo com o ChatBot.'},
  DirectTicketsToWallets  : {title: 'Forçar atendimento via Carteira', subtitle: 'Caso o contato tenha carteira vínculada, o sistema irá direcionar o atendimento somente para os donos da carteira de clientes.'},
  ignoreGroupMsg  : {title: 'Ignorar Mensagens de Grupo', subtitle: 'Habilitando esta opção o sistema não abrirá ticket para grupos.'},
  rejectCalls  : {title: 'Recusar chamadas no Whatsapp', subtitle: 'Quando ativo, as ligações de aúdio e vídeo serão recusadas, automaticamente.'},
  callRejectMessage  : {title: 'Mensagem para ligacoes recusadas', subtitle: 'Mensagem enviado quando as ligações de aúdio e vídeo forem recusadas, automaticamente.'},
  chatbotLane  : {title: 'Habilitar guia de atendimento de Chatbots', subtitle: 'Habilitando esta opção será adicionada uma guia de atendimento exclusiva para os chatbots.'},
  // NotViewTicketsChatBot  : {title: 'Não visualizar Tickets no ChatBot', 
  // subtitle: ' Quando habilitado, nenhum usuário poderá ver os tickets atendidos pelo chatbot.'},
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
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
  const { decryptData } = useAuth()
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const confi  = JSON.parse(decryptData("configuracoes"))
  const [configuracoesOpcoes, setConfiguracoesOpcoes] = useState([])

  const usuario =  JSON.parse(decryptData('usuario'))
  useEffect(()=>{
    if(confi) {
      setConfiguracoesOpcoes(confi)
      console.log(confi, usuario.tenantId)
    }
  },[setConfiguracoesOpcoes])
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [checked, setChecked] = useState<{
    [key: string] : {
        checked: boolean
    }
  }>({});

  const handleChangeCheck = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const value = event.target.checked
    console.log(value)
    setChecked(prevState => ({
      ...prevState,
      [key]: { checked: value },
    }))
  };
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    if(index === selectedIndex) return
    setSelectedIndex(index);
    console.log(checked)
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Configuracoes Gerais" {...a11yProps(0)} icon={<Settings/>} /> 
          {/* <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>

        {configuracoesOpcoes
       .filter(id => id.tenantId === usuario.tenantId)
        .map(item => (
          <List key={item.id} component="nav" aria-label="main mailbox folders" 
         >
            <ListItem 
             sx={{display: "flex", flexDirection: 'row', justifyContent: "space-between", width: '100%'}}
            onClick={(event) => handleListItemClick(event, item.id)}
            >

              <ListItemText secondary={keyValues[item.key]?.subtitle || ""}>{keyValues[item.key]?.title || "Valor não encontrado"}</ListItemText>
            <Box>
              {(item.value === "disabled" || item.value === "enabled") ? (
          <Checkbox 
            checked={checked[item.id]?.checked || false}  // Usa o estado para controlar o checkbox
            onChange={e => handleChangeCheck(e, item.id)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        ) : (
          <TextField 
          variant='filled'
          multiline 
          rows={item.key === 'callRejectMessage' ? 3 : 0} 
          value={item.value}
           sx={{width: item.key === 'callRejectMessage' ? '280px' : "60px"} }
          inputProps={{ style: {textAlign: 'right'} }}
           />
        )}
        </Box>
            </ListItem>
            </List>
        ))}
        
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  )
}
