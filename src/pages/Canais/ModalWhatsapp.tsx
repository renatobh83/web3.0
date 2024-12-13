import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  MenuItem,
  TextField,
} from '@mui/material'
import FunctionsIcon from '@mui/icons-material/Functions'
import { useWhatsappStore } from '../../store/whatsapp'
import { useEffect, useState } from 'react'
import {
  CriarWhatsapp,
  ListarWhatsapps,
  UpdateWhatsapp,
} from '../../services/sessoesWhatsapp'

interface ModalWhatsappProps {
  isOpen: boolean
  handleClose: () => void
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  item?: any
}

const optionsWhatsappsTypes = [
  { label: 'WhatsApp Oficial (WABA)', value: 'waba' },
  // { label: 'WhatsApp Baileys (QRCode)', value: 'baileys' },
  { label: 'WhatsApp WebJs (QRCode)', value: 'whatsapp' },
  { label: 'Telegram', value: 'telegram' },
  { label: 'Instagram', value: 'instagram' },
  // { label: 'Instagram (Beta Version)', value: 'instagram' },
  // { label: 'Messenger (em breve)', value: 'messenger' }
]
// const variaveis = [
//   { label: 'Nome', value: '{{name}}' },
//   { label: 'Saudação', value: '{{greeting}}' },
//   { label: 'Protocolo', value: '{{protocol}}' },
//   { label: 'E-mail (se existir)', value: '{{email}}' },
//   { label: 'Telefone', value: '{{phoneNumber}}' },
//   { label: 'Kanban', value: '{{kanban}}' },
//   { label: 'Atendente', value: '{{user}}' },
//   { label: 'E-mail Atendente', value: '{{userEmail}}' },
// ]
// const variaveisAniversario = [
//   { label: 'Nome', value: '{{name}}' },
//   { label: 'Saudação', value: '{{greeting}}' },
//   { label: 'E-mail (se existir)', value: '{{email}}' },
//   { label: 'Telefone', value: '{{phoneNumber}}' },
// ]
export const ModalWhatsapp = ({
  isOpen,
  handleClose,
  item,
}: ModalWhatsappProps) => {
  // const whatsApps = useWhatsappStore(s => s.whatsApps)
  const loadWhatsApps = useWhatsappStore(s => s.loadWhatsApps)
  const [isLoading, setIsLoading] = useState(false)
  const [whatsapp, setWhatsapp] = useState({
    name: '',
    wppUser: '',
    wppPass: '',
    pairingCodeEnabled: false,
    pairingCode: '',
    proxyUrl: null,
    proxyUser: null,
    proxyPass: null,
    webversion: null,
    remotePath: null,
    isDefault: false,
    tokenTelegram: '',
    instagramUser: '',
    instagramKey: '',
    tokenAPI: '',
    wabaId: '',
    bmToken: '',
    wabaVersion: '20.0',
    type: '',
    farewellMessage: '',
    wabaBSP: '360',
    chatgptPrompt: '',
    chatgptApiKey: '',
    chatgptOrganizationId: '',
    chatgptOff: '',
    assistantId: '',
    typebotRestart: '',
    importMessages: false,
    importOldMessagesGroups: false,
    importGroupMessages: false,
    closedTicketsPostImported: false,
    importOldMessages: '15/07/2024 20:36',
    importRecentMessages: '15/07/2024 20:37',
    queueIdImportMessages: null,
    importStartDate: '2024-07-11',
    importStartTime: '16:24',
    importEndDate: '2024-07-11',
    importEndTime: '16:24',
    importStartDateTime: '2024-07-11 16:24',
    importEndDateTime: '2024-07-11 16:25',
    messageQueue: '',
    isButton: true,
    selfDistribute: 'disabled',
    destroyMessage: 'disabled',
    n8nUrl: '',
    typebotOff: '',
    typebotName: '',
    typebotUrl: '',
    difyKey: '',
    difyUrl: '',
    difyType: '',
    difyOff: '',
    difyRestart: '',
    dialogflowJsonFilename: '',
    dialogflowProjectId: '',
    dialogflowLanguage: '',
    dialogflowOff: '',
    dialogflowJson: '',
    wordlist: 'disabled',
    sendEvaluation: 'disabled',
    transcribeAudio: 'disabled',
    birthdayDate: 'disabled',
    birthdayDateMessage: '',
    transcribeAudioJson: {},
  })
  function formatPhoneNumber(phoneNumber: string) {
    // Formata no padrão +DDI (DDD) 99999-9999
    // const formatted = phoneNumber.replace(
    //   /^(\d{2})(\d{2})(\d{4,5})(\d{4}).*/,
    //   '+$1 ($2) $3-$4'
    // )
    const DDI = '55' // Código do Brasil
    return DDI + phoneNumber
  }
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    event.preventDefault()
    if (whatsapp.wppUser) {
      whatsapp.wppUser = formatPhoneNumber(whatsapp.wppUser)
    }

    if (item?.id) {
      UpdateWhatsapp(item.id, whatsapp).then(async () => {
        const { data } = await ListarWhatsapps()
        loadWhatsApps(data)
        handleClose()
        setIsLoading(false)
      })
    } else {
      CriarWhatsapp(whatsapp).then(async () => {
        const { data } = await ListarWhatsapps()
        loadWhatsApps(data)
        handleClose()
        setIsLoading(false)
      })
    }
  }
  // function channelOptions() {
  //   return whatsApps.map(whatsapp => ({
  //     label: whatsapp.name,
  //     id: whatsapp.id,
  //     type: whatsapp.type,
  //   }))
  // }
  // function cBaseUrlIntegração() {
  // 	return whatsApps.UrlMessengerWebHook
  // }

  const handleChange = event => {
    const { name } = event.target
    setWhatsapp(prev => ({
      ...prev,
      [name]:
        name === 'pairingCodeEnabled'
          ? event.target.checked
          : event.target.value,
    }))
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (item?.id) {
      setWhatsapp({ ...item })
    }
  }, [item, optionsWhatsappsTypes])
  return (
    <Dialog
      open={isOpen}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        component: 'form',
        onSubmit,
      }}
    >
      <DialogTitle>
        {item?.id ? 'Editar canal' : 'Adicionar novo canal'}
      </DialogTitle>
      <DialogContent>
        <TextField
          select
          margin="dense"
          id="tipo"
          name="type"
          label="Tipo"
          type="select"
          fullWidth
          required
          variant="standard"
          value={whatsapp.type}
          onChange={e => handleChange(e)}
        >
          {optionsWhatsappsTypes.map(type => (
            <MenuItem key={type.label} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
        {whatsapp.type === 'whatsapp' && (
          <Box sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="pairingCodeEnabled"
                  value={whatsapp.pairingCodeEnabled}
                  onChange={e => handleChange(e)}
                  checked={whatsapp.pairingCodeEnabled}
                />
              }
              label="Codigo pareamento"
            />
            {whatsapp.pairingCodeEnabled && (
              <TextField
                autoFocus
                required
                margin="dense"
                id="wppUser"
                name="wppUser"
                label="Número Exato da Conta do WhatsApp DDD + Numero"
                value={whatsapp.wppUser}
                onChange={e => handleChange(e)}
                fullWidth
                variant="standard"
              />
            )}
          </Box>
        )}
        <TextField
          autoFocus
          required
          margin="dense"
          id="nome"
          name="name"
          label="Nome"
          value={whatsapp.name}
          onChange={e => handleChange(e)}
          fullWidth
          variant="standard"
        />
        <Box sx={{ position: 'relative' }}>
          <TextField
            margin="dense"
            id="mensagem"
            name="farewellMessage"
            label="Mensagem Despedida:"
            rows={5}
            multiline
            onChange={e => handleChange(e)}
            fullWidth
            variant="standard"
            value={whatsapp.farewellMessage}
          />
       {/*    <Box id="btn" sx={{ position: 'absolute', top: '0', right: '0' }}>
            <Button>
              <FunctionsIcon />
            </Button>
          </Box> */}
        </Box>
      </DialogContent>
      {whatsapp.type === 'whatsapp' && (
        <Alert severity="success" variant="filled">
          <List>
            <ListItem>Serviço Não Oficial.</ListItem>
          </List>
        </Alert>
      )}
      {whatsapp.type === 'waba' && (
        <Alert severity="success" variant="filled" color="warning">
          <List>
            <ListItem>Estabilidade de conexão garantida</ListItem>
            <ListItem>Sem risco de banimento</ListItem>
            <ListItem>Segurança contra roubo de conta</ListItem>
            <ListItem>Permite o uso de botões</ListItem>
            <ListItem>Permite o uso de templates</ListItem>
          </List>
        </Alert>
      )}
      <DialogContent>
      <Box>Op</Box>
      </DialogContent>
      
      <DialogActions>
        <Button
          disabled={isLoading}
          onClick={() => handleClose()}
          variant="contained"
          color="error"
        >
          Cancelar
        </Button>
        <Button
          disabled={isLoading}
          type="submit"
          variant="contained"
          color="success"
        >
          Gravar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
