import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useWhatsappStore } from '../../store/whatsapp'
import { ItemStatusChannel } from './ItemStatusChannel'
import { useCallback, useEffect, useState } from 'react'
import { ListarChatFlow } from '../../services/chatflow'
import { Clear, Edit, PlusOne } from '@mui/icons-material'
import {
  DeletarWhatsapp,
  DeleteWhatsappSession,
  ListarWhatsapps,
  RequestNewQrCode,
  StartWhatsappSession,
  UpdateWhatsapp,
} from '../../services/sessoesWhatsapp'
import { toast } from 'sonner'
import AddTaskIcon from '@mui/icons-material/AddTask'
import { ModalWhatsapp } from './ModalWhatsapp'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { ModalQrCode } from './ModalQrCode'
import { eventEmitter } from '../../hooks/useSocketInitial'


export const Canais = () => {
  const [chatflows, setChatflows] = useState([])
  const [selectedChatBots, setSelectedChatBots] = useState({})
  const data = useWhatsappStore(s => s.whatsApps)
  const loadWhatsApps = useWhatsappStore(s => s.loadWhatsApps)
  const userProfile = localStorage.getItem('profile')
  const [whatsappSelecionado, setWhatsappSelecionado] = useState({})
  const [modalWhatsapp, setModalWhatsapp] = useState(false)
  const [modalQrCode, setModalQrCode] = useState(false)
  const [loading, setLoading] = useState(false)

  const isAdmin = true
  // Função para lidar com a mudança de seleção

  const handleChange = (whatsapp, event) => {
    // Atualiza o valor apenas para o card correspondente ao id
    setSelectedChatBots(prev => ({
      ...prev,
      [whatsapp.id]: event.target.value,
    }))
    const form = {
      ...whatsapp,
      chatFlowId: event.target.value,
    }

    UpdateWhatsapp(whatsapp.id, form).then(data => {
      if (data.status === 200) {
        toast.success(
          `Whatsapp ${whatsapp.id ? 'editado' : 'criado'} com sucesso!`,
          {
            position: 'top-center',
          }
        )
      }
    })
  }
  const listChatFlow = useCallback(async () => {
    const { data } = await ListarChatFlow()
    setChatflows(data.chatFlow)
  }, [data])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    listChatFlow()

  }, [])

  // Preenche o estado inicial com base no item.chatFlowId
  useEffect(() => {
    const defaultValues = {}
    // biome-ignore lint/complexity/noForEach: <explanation>
    data.forEach(item => {
      defaultValues[item.id] = item.chatFlowId || '' // Usa o valor do item ou vazio
    })
    setSelectedChatBots(defaultValues)
  }, [data])

  const handleOpenQrModal = channel => {
    setWhatsappSelecionado(channel)
    setModalQrCode(true)
  }
  // const handleUpdateSession = (session) => {
  //   // this.$store.commit('UPDATE_SESSION', session);
  //   console.log(session)
  //   // window.location.reload();
  // }
  // useEffect(() => {
  //   // Adiciona o listener ao montar o componente
  //   eventEmitter.on('UPDATE_SESSION', handleUpdateSession);

  //   // Remove o listener ao desmontar o componente
  //   return () => {
  //     eventEmitter.off('UPDATE_SESSION', handleUpdateSession);
  //   };
  // }, []);

  const handleCloseQrModal = () => {
    setModalQrCode(false)
  }
  function cDadosWhatsappSelecionado() {
    const { id } = whatsappSelecionado
    return data.find(w => w.id === id)
  }


  const handleDisconectWhatsSession = (whatsAppId: string) => {
    toast.info('Atenção!! Deseja realmente desconectar?', {
      position: 'top-right',
      cancel: {
        label: 'Cancel',
        onClick: () => console.log('Cancel!'),
      },
      action: {
        label: 'Confirma',
        onClick: () => {
          DeleteWhatsappSession(whatsAppId)
            .then(async () => {
              const { data } = await ListarWhatsapps()
              loadWhatsApps(data)
            })
            .catch(e => console.log(e))
        },
      },
    })
  }
  const handleClearSelection = async whatsapp => {
    // Define o valor como '' (vazio) para remover a seleção
    setSelectedChatBots(prev => ({
      ...prev,
      [whatsapp.id]: '',
    }))
    const form = {
      ...whatsapp,
      chatFlowId: null,
    }
    UpdateWhatsapp(whatsapp.id, form).then(data => {
      if (data.status === 200) {
        toast.success(
          `Whatsapp ${whatsapp.id ? 'editado' : 'criado'} com sucesso!`,
          {
            position: 'top-center',
          }
        )
      }
    })
  }

  async function handleRequestNewQrCode(channel, origem) {
    if (channel.type === 'telegram' && !channel.tokenTelegram) {
      toast.error('Necessário informar o token para Telegram', {
        position: 'top-center',
      })
    }
    try {
      await RequestNewQrCode({ id: channel.id, isQrcode: true })
      setTimeout(() => {
        handleOpenQrModal(channel)
      }, 2000)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const handleOpenModalWhatsapp = (item?: any) => {
    setWhatsappSelecionado(item)
    setModalWhatsapp(true)
  }
  const handleClosenModalWhatsapp = () => {
    setModalWhatsapp(false)
  }
  async function handleStartWhatsAppSession(whatsAppId) {
    try {
      await StartWhatsappSession(whatsAppId)
      const dataFind = data.find(w => w.id === whatsAppId)
      if (dataFind.type === 'waba' || data.dataFind === 'telegram') {
        window.location.reload();
      }
    } catch (error) {
      console.error(error)
    }
  }
  async function deleteWhatsapp(whatsapp) {
    toast.message(
      `Atenção!! Deseja realmente deletar o canal "${whatsapp.name}"?`,
      {
        description: 'Os chats abertos desse canal serão fechados, mas poderão ser vistos no painel de atendimento.',
        position: "top-right",
        cancel: {
          label: "Cancel",
          onClick: () => console.log("Cancel!"),
        },
        action: {
          label: "Confirma",
          onClick: () => {
            DeletarWhatsapp(whatsapp.id).then(async () => {
              toast.success("Canal apagado", {
                position: "top-right",

              });
              const { data } = await ListarWhatsapps()
              loadWhatsApps(data)
            })

          },
        },
      },
    )
  }
  return (
    <>
      {userProfile === 'admin' && (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Canais de Comunicação
            </Typography>
            <Box>
              <Button variant="outlined" onClick={handleOpenModalWhatsapp}>
                <AddTaskIcon />
                Adicionar
              </Button>
            </Box>
          </Box>
          <Grid
            container
            spacing={2}
            columns={12}
            sx={{ mb: theme => theme.spacing(2) }}
          >
            {data.map(item => (
              <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card

                  variant="outlined"
                  sx={{ height: '100%', flexGrow: 1 }}
                  id="card"
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar src={`./${item.type}-logo.png`} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Typography
                          component="h2"
                          variant="subtitle2"
                          gutterBottom
                        >
                          {item.name}
                        </Typography>
                        <Typography variant="caption">{item.type}</Typography>
                      </Box>
                      {isAdmin && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>

                          <Button size='small' onClick={() => handleOpenModalWhatsapp(item)}><Edit /></Button>
                          <Button
                            size='small'
                            onClick={() => deleteWhatsapp(item)}
                          >
                            <DeleteOutlineIcon sx={{ color: 'red' }} />
                          </Button>
                        </Box>
                      )}
                    </Box>
                    <Divider sx={{ my: 1 }} />

                    <Stack
                      id="stack"
                      direction="column"
                      sx={{
                        justifyContent: 'space-between',
                        flexGrow: '1',
                        gap: 1,
                        minHeight: 160,

                      }}
                    >
                      <ItemStatusChannel item={item} />
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          justifyContent: 'space-between',
                        }}
                      >
                        <Select
                          sx={{ flexGrow: 1 }}
                          value={selectedChatBots[item.id] || ''}
                          onChange={e => handleChange(item, e)}
                          label="ChatBot"
                        >
                          {chatflows?.map(chatflow => (
                            <MenuItem value={chatflow.id} key={chatflow.id}>
                              {chatflow.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {/* Botão de limpar seleção */}
                        {selectedChatBots[item.id] && (
                          <IconButton
                            onClick={() => handleClearSelection(item)}
                            size="small"
                          >
                            <Clear />
                          </IconButton>
                        )}
                      </Box>
                    </Stack>
                    <Divider sx={{ my: 1 }} id='actions' />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {item.type === 'whatsapp' && item.status === 'qrcode' && (
                        <Button
                          variant='outlined'
                          onClick={() => handleOpenQrModal(item)}
                          disabled={!isAdmin}
                        >
                          QR Code
                        </Button>
                      )}
                      {item.status === 'DISCONNECTED' && (
                        item.type === 'whatsapp' ?
                          <Button
                            variant='outlined'
                            onClick={() => handleStartWhatsAppSession(item.id)}>
                            Conectar
                          </Button> :
                          item.type !== 'whatsapp' ?
                            <Button variant='outlined'>
                              Conectar
                            </Button> :
                            item.status === 'DISCONNECTED' && item.type === 'whatsapp' ?
                              <Button variant='outlined' onClick={() => handleRequestNewQrCode(item, 'btn-qrCode')}>
                                Novo QR Code
                              </Button> :
                              <></>
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                    >
                      {item.status === 'OPENING' && (
                        <Box>
                          <Typography>Conectando...</Typography>
                        </Box>
                      )}
                      <Divider orientation="vertical" />
                      <Box>
                        {[
                          'OPENING',
                          'CONNECTED',
                          'PAIRING',
                          'TIMEOUT',
                        ].includes(item.status) && (
                            <Button
                              variant='outlined'
                              onClick={() => handleDisconectWhatsSession(item.id)}
                            >
                              Desconectar
                            </Button>
                          )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {modalWhatsapp && (
            <ModalWhatsapp
              handleClose={handleClosenModalWhatsapp}
              isOpen={modalWhatsapp}
              item={cDadosWhatsappSelecionado()}
            />
          )}
          {modalQrCode && (
            <ModalQrCode
              isOpen={modalQrCode}
              onClose={handleCloseQrModal}
              channel={cDadosWhatsappSelecionado()}
              onGenerateNewQrCode={handleRequestNewQrCode}
            />
          )}
        </Box>
      )}
    </>
  )
}
function loadWhatsApps(arg0: any) {
  throw new Error('Function not implemented.')
}

