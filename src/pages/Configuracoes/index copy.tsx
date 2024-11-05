// import { Settings, Title, Webhook } from '@mui/icons-material'
// import {
//   Box,
//   Button,
//   Checkbox,
//   List,
//   ListItem,
//   ListItemText,
//   Switch,
//   Tab,
//   Tabs,
//   TextField,
//   Toolbar,
//   Typography,
// } from '@mui/material'
// import React, { useEffect, useState } from 'react'
// import { useAuth } from '../../context/AuthContext'
// import {
//   AlterarConfiguracao,
//   ListarConfiguracoes,
// } from '../../services/configuracoes'
// import { debounce } from 'lodash'
// import { toast } from 'sonner'
// import { WebhookConfiguracao } from '../../components/configuracoes/WebhookComponent'

// interface TabPanelProps {
//   children?: React.ReactNode
//   index: number
//   value: number
// }
// const keyValues = {
//   userCreation: {
//     title: 'Criação de usuario',
//     subtitle: 'Permitir que um novo usuario se registre pela tela e login.',
//   },
//   NotViewTicketsQueueUndefined: {
//     title: 'Não visualizar TIckets sem fila definida',
//     subtitle:
//       'Somente administradores poderão visualizar tickets que não estiverem em fila.',
//   },
//   botTicketActive: {
//     title: 'Fluxo ativo para o Bot de atendimento',
//     subtitle: 'Fluxo a ser utilizado pelo Bot para os novos atendimentos',
//   },
//   NotViewAssignedTickets: {
//     title: 'Não visualizar Tickets já atribuidos à outros usuários',
//     subtitle:
//       'Somente o usuário responsável pelo ticket e/ou os administradores visualizarão a atendimento.',
//   },
//   NotViewTicketsChatBot: {
//     title: 'Não visualizar Tickets no ChatBot',
//     subtitle:
//       'Somente administradores poderão visualizar tickets que estiverem interagindo com o ChatBot.',
//   },
//   DirectTicketsToWallets: {
//     title: 'Forçar atendimento via Carteira',
//     subtitle:
//       'Caso o contato tenha carteira vínculada, o sistema irá direcionar o atendimento somente para os donos da carteira de clientes.',
//   },
//   ignoreGroupMsg: {
//     title: 'Ignorar Mensagens de Grupo',
//     subtitle: 'Habilitando esta opção o sistema não abrirá ticket para grupos.',
//   },
//   rejectCalls: {
//     title: 'Recusar chamadas no Whatsapp',
//     subtitle:
//       'Quando ativo, as ligações de aúdio e vídeo serão recusadas, automaticamente.',
//   },
//   callRejectMessage: {
//     title: 'Mensagem para ligacoes recusadas',
//     subtitle:
//       'Mensagem enviado quando as ligações de aúdio e vídeo forem recusadas, automaticamente.',
//   },
//   chatbotLane: {
//     title: 'Habilitar guia de atendimento de Chatbots',
//     subtitle:
//       'Habilitando esta opção será adicionada uma guia de atendimento exclusiva para os chatbots.',
//   },
//   // NotViewTicketsChatBot  : {title: 'Não visualizar Tickets no ChatBot',
//   // subtitle: ' Quando habilitado, nenhum usuário poderá ver os tickets atendidos pelo chatbot.'},
// }
// function CustomTabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   )
// }

// function a11yProps(index: number) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`,
//   }
// }
// export const Configuracoes = () => {
//   const { decryptData, encryptData } = useAuth()
//   const [value, setValue] = useState(0)

//   const confi = JSON.parse(decryptData('configuracoes'))
//   const [configuracoesOpcoes, setConfiguracoesOpcoes] = useState([])
//   // const [selectedIndex, setSelectedIndex] = useState(0)

//   const usuario = JSON.parse(decryptData('usuario'))

//   // const [checked, setChecked] = useState<{
//   //   [key: string]: {
//   //     checked: string
//   //   }
//   // }>({})

//   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
//   useEffect(() => {
//     if (confi) {
//       setConfiguracoesOpcoes(confi)
//     }
//   }, [setConfiguracoesOpcoes])

//   const handleChangeCheck = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     key: string
//   ) => {
//     const value = event.target.checked
//     setConfiguracoesOpcoes(prevState =>
//       prevState.map(config =>
//         config.key === key
//           ? { ...config, value: value === true ? 'enabled' : 'disabled' }
//           : config
//       )
//     )
//     const params = { key, value: value === true ? 'enabled' : 'disabled' }
//     debounceChange(params)
//   }
//   const debounceChange = debounce(params => {
//     AlterarConfiguracao(params).then(async data => {
//       if (data.status === 200) {
//         toast.info('Configuracao atualizada')
//         const { data } = await ListarConfiguracoes()
//         localStorage.setItem('configuracoes', encryptData(JSON.stringify(data)))
//       }
//     })
//   }, 1500)
//   const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
//     setValue(newValue)
//   }
//   const handleChange = async (value: string, key: string) => {
//     setConfiguracoesOpcoes(prevState =>
//       prevState.map(config =>
//         config.key === key ? { ...config, value: value } : config
//       )
//     )
//     const params = { key, value: value }
//     debounceChange(params)
//   }

//   return (
//     <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
//       <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//         <Tabs
//           value={value}
//           onChange={handleChangeTab}
//           aria-label="basic tabs example"
//         >
//           <Tab
//             label="Configurações Gerais"
//             {...a11yProps(0)}
//             icon={<Settings />}
//           />
//           {usuario.profile === 'admin' && (
//             <Tab
//               label="Configuração Webhooks"
//               {...a11yProps(1)}
//               icon={<Webhook />}
//             />
//           )}
//           {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
//         </Tabs>
//       </Box>
//       <CustomTabPanel value={value} index={0}>
//         {configuracoesOpcoes
//           .filter(id => id.tenantId === usuario.tenantId)
//           .map(item => (
//             <List
//               key={item.id}
//               component="nav"
//               aria-label="main mailbox folders"
//             >
//               <Box
//                 sx={{
//                   display: 'flex',
//                 }}
//                 // onClick={(event) => handleListItemClick(event, item.id)}
//               >
//                 <ListItemText secondary={keyValues[item.key]?.subtitle || ''}>
//                   {keyValues[item.key]?.title || 'Valor não encontrado'}
//                 </ListItemText>
//                 {item.value === 'disabled' || item.value === 'enabled' ? (
//                   <Switch
//                     checked={
//                       configuracoesOpcoes.find(
//                         config => config.key === item.key
//                       )?.value === 'enabled'
//                         ? true
//                         : false || false
//                     } // Usa o estado para controlar o checkbox
//                     onChange={e => handleChangeCheck(e, item.key)}
//                   />
//                 ) : (
//                   <TextField
//                     onChange={e => handleChange(e.target.value, item.key)}
//                     variant="filled"
//                     multiline
//                     rows={item.key === 'callRejectMessage' ? 3 : 0}
//                     value={
//                       configuracoesOpcoes.find(config => config.id === item.id)
//                         ?.value || ''
//                     }
//                     sx={{
//                       width:
//                         item.key === 'callRejectMessage' ? '280px' : '60px',
//                     }}
//                     inputProps={{ style: { textAlign: 'right' } }}
//                   />
//                 )}
//               </Box>
//             </List>
//           ))}
//       </CustomTabPanel>
//       <CustomTabPanel value={value} index={1}>
//         <WebhookConfiguracao />
//       </CustomTabPanel>
//       <CustomTabPanel value={value} index={2}>
//         Item Three
//       </CustomTabPanel>
//     </Box>
//   )
// }
