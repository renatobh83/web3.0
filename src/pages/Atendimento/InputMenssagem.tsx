import { Cancel, Close, Mic, Send } from '@mui/icons-material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import SendIcon from '@mui/icons-material/Send'

import { uid } from 'uid'
import {
  alpha,
  Box,
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  type MenuProps,
  styled,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState, useRef } from 'react'
import { RecordingTimer } from './RecordingTimer'
import { toast } from 'sonner'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: '40vw',
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
        marginRight: theme.spacing(1.5),
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
import type { useAudioRecorder } from 'react-audio-voice-recorder'
import { EnviarMensagemTexto } from '../../services/tickets'

import { Errors } from '../../utils/error'
import { useAtendimentoTicketStore } from '../../store/atendimentoTicket'
import { AgendamentoComponent } from '../../components/AtendimentoComponent/AgendamentoComponent'
import { useTicketService } from '../../hooks/useTicketService'
interface InputMenssagemProps {
  isScheduleDate?: boolean,

}

export const InputMenssagem: React.FC<InputMenssagemProps> = ({ isScheduleDate }) => {
  const ticketFocado = useAtendimentoTicketStore(s => s.ticketFocado)
  const { iniciarAtendimento } = useTicketService()

  const [openPreviewImagem, setOpenPreviewImagem] = useState(false)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const [loading, setIsloading] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [urlMediaPreview, setUrlMediaPreview] = useState({})
  const [arquivos, setArquivos] = useState<File[]>([]);

  const recorderControlsRef = useRef<ReturnType<
    typeof useAudioRecorder
  > | null>(null)

  const handleClickOpenPreviewImagem = () => {
    setOpenPreviewImagem(true)
  }

  const handleClosePreviewImagem = () => {
    setOpenPreviewImagem(false)
  }
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const inputEnvioMensagem = useRef<HTMLInputElement | null>(null)

  //  Enviar Arquivos Inicio
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Função chamada ao clicar no botão
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click() // Dispara o clique no input de tipo file
    }
  }
  const handleFileRemove = (fileName: string) => {
    setArquivos(arquivos.filter(file => file.name !== fileName));
  };
  // Função chamada quando o arquivo é selecionado
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const validFiles: File[] = [];
      const maxSize = 2 * 1024 * 1024; // 2MB
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Verifica o tipo de arquivo
        if (!validTypes.includes(file.type)) {
          toast.error(`Tipo de arquivo inválido: ${file.name}`);
          return;
        }

        // Verifica o tamanho do arquivo
        if (file.size > maxSize) {
          toast.error(`Arquivo muito grande: ${file.name}`);
          return;
        }

        validFiles.push(file);
      }
      setArquivos([...arquivos, ...validFiles])
    }
  }

  //  Enviar Arquivos Fim

  const [textChat, setTextChat] = useState('')
  const prepararMensagemTexto = () => {
    if (textChat.trim() === '') {
      toast.error('Mensagem Inexistente')
    }

    // if (textChat.trim() && textChat.trim().startsWith('/')) {
    //   let search = textChat.trim().toLowerCase()
    //   search = search.replace('/', '')
    //   const mensagemRapida = this.cMensagensRapidas.find(
    //     m => m.key.toLowerCase() === search
    //   )
    //   if (mensagemRapida?.message) {
    //     this.textChat = mensagemRapida.message
    //   } else {
    //     const error =
    //       this.cMensagensRapidas.length > 1
    //         ? 'Várias mensagens rápidas encontradas. Selecione uma ou digite uma chave única da mensagem.'
    //         : '/ indica que você deseja enviar uma mensagem rápida, mas nenhuma foi localizada. Cadastre ou apague a / e digite sua mensagem.'
    //     this.$notificarErro(error)
    //     this.loading = false
    //     throw new Error(error)
    //   }
    // }
    let mensagem = textChat.trim()
    const username = localStorage.getItem('username')
    // if (username) {
    //   mensagem = `*${username}*:\n ${mensagem}`
    // }
    const message = {
      read: 1,
      fromMe: true,
      mediaUrl: '',
      body: mensagem,
      //   scheduleDate: this.isScheduleDate ? this.scheduleDate : null,
      //   quotedMsg: this.replyingMessage,
      // idFront: uid()
      id: uid(),
    }
    // if (this.isScheduleDate) {
    //   message.scheduleDate = this.scheduleDate
    // }
    return message
  }
  function prepararUploadMedia() {
    if (!arquivos.length) {
      throw new Error('Não existem arquivos para envio')
    }
    const formDatas = arquivos.map(media => {
      const formData = new FormData()
      formData.append('fromMe', true)
      formData.append('medias', media)
      formData.append('body', media.name)
      formData.append('idFront', uid())
      // formData.append('isSticker', this.sticker)
      // if (this.isScheduleDate) {
      //   formData.append('scheduleDate', this.scheduleDate)
      // }
      return formData
    })
    return formDatas
  }
  // Função que será chamada para enviar a mensagem
  const enviarMensagem = async () => {

    const ticketId = ticketFocado.id
    setIsloading(true)
    try {
      if (!cMostrarEnvioArquivo()) {
        const message = prepararMensagemTexto()
        await EnviarMensagemTexto(ticketId, message)
      } else {
        const formDatas = prepararUploadMedia()

        for (const formData of formDatas) {
          await EnviarMensagemTexto(ticketId, formData)
        }
      }
      setTextChat('') // Limpa o campo após enviar a mensagem
      setArquivos([])

    } catch (err) {
      Errors(err)
    } finally {
      setIsloading(false)
    }
  }

  // Função para capturar o evento de tecla
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      // Verifica se o campo não está vazio ou apenas com espaços
      if (textChat.trim().length) {
        enviarMensagem()
      }
      event.preventDefault() // Impede o comportamento padrão do Enter
    }
  }
  async function handleCancelRecordingAudio() {
    try {
      setIsRecordingAudio(false)
      setIsloading(false)
    } catch (error) {
      toast.error(`Ocorreu um erro!, ${error}`)
    }
  }

  const handleRecorderControls = (
    controls: ReturnType<typeof useAudioRecorder>
  ) => {
    recorderControlsRef.current = controls
    console.log('Controles do gravador expostos para o pai:', controls)

    if (!controls.isRecording && controls.recordingBlob) {
      handleStopRecordingAudio(controls.recordingBlob)
    }
  }
  async function handleSartRecordingAudio() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      // recorderControlsRef.current?.startRecording()
      setIsRecordingAudio(true)
    } catch (error) {
      setIsRecordingAudio(false)
    }
  }

  async function handleStopRecordingAudio(blob: Blob) {
    setIsloading(true)
    try {
      if (blob.size < 10000) {
        setIsloading(false)
        setIsRecordingAudio(false)
        return
      }

      setIsRecordingAudio(false)
      const formData = new FormData()
      const filename = `${new Date().getTime()}.mp3`
      formData.append('medias', blob, filename)
      formData.append('body', filename)
      formData.append('fromMe', true)
      // if (isScheduleDate) {
      //     formData.append('scheduleDate', this.scheduleDate)
      // }

      const ticketId = ticketFocado.id

      await EnviarMensagemTexto(ticketId, formData)

      setTextChat('')
      // this.$emit('update:replyingMessage', null)
      // this.abrirFilePicker = false
      // this.abrirModalPreviewImagem = false
      setIsloading(false)
      setIsRecordingAudio(false)
      // setTimeout(() => {
      //     this.scrollToBottom()
      // }, 300)
    } catch (error) {
      setIsloading(false)
      setIsRecordingAudio(false)
      toast.error(`Ocorreu um erro!, ${JSON.stringify(error)}`)
    }
  }

  function cDisableActions() {
    return isRecordingAudio || ticketFocado.status !== 'open'
  }

  const handlePaste = (event: ClipboardEvent) => {
    const clipboardItems = event.clipboardData.items

    // Percorre os itens da área de transferência
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i]

      // Verifica se o item é uma imagem
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile() // Converte para arquivo
        if (file) {
          const urlImg = window.URL.createObjectURL(file)

          setOpenPreviewImagem(true)
          setUrlMediaPreview({
            title: `Enviar imagem para `,
            src: urlImg,
          })

          return urlImg
        }
      }
    }

    console.log('Nenhuma imagem colada.')
    return null
  }

  const schedule = {
    selected: { label: 'Agendamento customizado', value: 'custom', func: null },
    options: [
      { label: 'Agendamento customizado', value: 'custom', func: null },
      { label: 'Em 30 minutos', value: '30_mins', func: () => add(new Date(), { minutes: 30 }) },
      { label: 'Amanhã', value: 'amanha', func: () => add(new Date(), { days: 1 }) },
      { label: 'Próxima semana', value: 'prox_semana', func: () => add(new Date(), { weeks: 1 }) },
    ],
  }
  function cMostrarEnvioArquivo() {
    return arquivos.length > 0
  }
  return (
    <>

      {
        ticketFocado.status !== 'pending' ? (
          <Box
            id="input"
            sx={{
              pb: 2,
              position: 'relative',
            }}
          >
            {isScheduleDate && (
              <AgendamentoComponent />
            )}
            {!isRecordingAudio ? (
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <Tooltip title="Enviar arquivo">
                  <>


                    {/* <input
                      type="file"
                      multiple
                      accept=".txt, .xml, .jpg, .png, image/jpeg, .pdf, .doc, .docx, .mp4, .xls, .xlsx, .jpeg, .zip, .ppt, .pptx, image/*"
                      className="p-2 border rounded"
                    /> */}
                    <IconButton
                      disabled={cDisableActions()}
                      sx={{ borderRadius: '50%' }}
                      size="small"
                      onClick={handleButtonClick}
                      disableRipple
                    >
                      <AttachFileIcon />
                    </IconButton>
                    <input
                      type="file"
                      accept=".txt, .xml, .jpg, .png, image/jpeg, .pdf, .doc, .docx, .mp4, .xls, .xlsx, .jpeg, .zip, .ppt, .pptx, image/*"
                      ref={fileInputRef}
                      multiple
                      style={{ display: 'none' }} // Esconde o input
                      onChange={handleFileChange} // Função que lida com a seleção do arquivo
                    />
                  </>
                </Tooltip>

                <Tooltip title="Emoji">
                  <>
                    <IconButton
                      disabled={cDisableActions()}
                      sx={{ borderRadius: '50%' }}
                      size="small"
                      onClick={handleClick}
                      disableRipple
                    >
                      <EmojiEmotionsIcon />
                    </IconButton>
                    <StyledMenu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                    >
                      Criar compoente para EMOJi
                    </StyledMenu>
                  </>
                </Tooltip>

                {cMostrarEnvioArquivo() ? (
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    {arquivos.map((file, index) => (
                      // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
                      <label key={index} style={{ display: 'flex', marginBottom: '8px', alignItems: 'center' }}>
                        {file.name}

                        <IconButton
                          color="secondary"
                          sx={{ border: 'none' }}
                          size="small"
                          onClick={() => handleFileRemove(file.name)}>
                          <Close />
                        </IconButton>
                      </label>
                    ))}
                  </Box>
                ) :
                  <TextField
                    label="Digite sua mensagem"
                    variant="standard"
                    fullWidth
                    value={textChat}
                    disabled={cDisableActions()}
                    onChange={e => setTextChat(e.target.value)}
                    onKeyDown={handleKeyDown} // Captura a tecla pressionada
                    ref={inputEnvioMensagem}
                    sx={{ maxHeight: '30vh', flexFlow: 1 }}
                    onPaste={handlePaste}
                  />
                }
                {textChat && (
                  <Tooltip title="Enviar Mensagem">
                    <IconButton
                      disabled={ticketFocado.status !== 'open'}
                      onClick={enviarMensagem}
                    >
                      <Send />
                    </IconButton>
                  </Tooltip>
                )}
                {cMostrarEnvioArquivo() && (<Tooltip title="Enviar Mensagem">
                  <IconButton
                    disabled={ticketFocado.status !== 'open'}
                    onClick={enviarMensagem}
                  >
                    <Send />
                  </IconButton>
                </Tooltip>)}
                {/* {(!textChat && !isRecordingAudio && !cMostrarEnvioArquivo()) && (
                  <Tooltip title=" Enviar Áudio">
                    <IconButton onClick={handleSartRecordingAudio}> */}
                {/* <RecordingTimer exposeRecorderControls={handleRecorderControls} /> */}
                {/* <Mic />
                    </IconButton>
                  </Tooltip>
                )} */}
              </Box>
            ) : (
              <Box
                sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                id="audio "
              >
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <RecordingTimer
                    exposeRecorderControls={handleRecorderControls}
                  />
                  <IconButton size="small" onClick={handleCancelRecordingAudio}>
                    <Cancel fontSize="inherit" />
                  </IconButton>
                </Box>
              </Box>
            )}
            {openPreviewImagem && (
              <Dialog
                open={openPreviewImagem}
                onClose={handleClosePreviewImagem}
                fullWidth
              >
                <DialogTitle id="abrirModalPreviewImagem">
                  {urlMediaPreview.title}
                </DialogTitle>
                <DialogContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Card
                    sx={{
                      maxheight: '60vh',
                      minWidth: 'calc(100% - 100px)',
                      maxWidth: 'calc(100% - 100px)',
                    }}
                  >
                    <CardMedia component="img" image={urlMediaPreview.src} />
                  </Card>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClosePreviewImagem}>Cancelar</Button>
                  <Button onClick={handleClosePreviewImagem} autoFocus>
                    Enviar
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              minHeight: '70px',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <Button
              sx={{ p: 2 }}
              variant="contained"
              color='success'
              endIcon={<SendIcon />}
              onClick={() => iniciarAtendimento(ticketFocado)}
            >
              <Typography variant="h5">Iniciar o atendimento</Typography>
            </Button>
          </Box>
        )
      }
    </>
  )
}
