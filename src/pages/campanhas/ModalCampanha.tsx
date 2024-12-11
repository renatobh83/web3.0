import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import dayjs, { Dayjs } from 'dayjs'
import { useForm } from 'react-hook-form'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MolduraCelular } from '../../components/MolduraCelular'
import { useCallback, useEffect, useState } from 'react'
import { ChatMensagem } from '../Atendimento/ChatMenssage'
import { useWhatsappStore } from '../../store/whatsapp'
import { AlterarCampanha, CriarCampanha } from '../../services/campanhas'
import { toast } from 'sonner'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import { Errors } from '../../utils/error'
import { CloudUpload, Close } from '@mui/icons-material'


// const variaveis = [
//   { label: 'Nome', value: '{{name}}' },
//   { label: 'E-mail (se existir)', value: '{{email}}' },
//   { label: 'Telefone', value: '{{phoneNumber}}' },
//   { label: 'Kanban', value: '{{kanban}}' },
// ]
// const optRadio = [
//   { label: 'Msg.1', value: 'message1' },
//   { label: 'Msg. 2', value: 'message2' },
//   { label: 'Msg. 3', value: 'message3' },
// ]

interface Campanha {
  name: string
  data: string
  messages: string[]
  delay: number
  mediaUrl: string
  start: Dayjs | string
  sessionId: string
}

interface ModalCampanhaProps {
  open: boolean
  setClose: () => void
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  campanhaId: any
}
async function urlToFile(url) {
  try {
    // Faz o download do arquivo
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro ao fazer o download: ${response.statusText}`);
    }

    // Converte o conteúdo para um Blob
    const blob = await response.blob();

    // Extrai o nome do arquivo da URL
    const fileName = url.substring(url.lastIndexOf('/') + 1);

    // Cria um objeto File com o Blob
    const file = new File([blob], fileName, { type: blob.type });

    return file;
  } catch (error) {
    console.error('Erro ao converter URL para File:', error);
    return null;
  }
}



export const ModalCampanha = ({
  open,
  setClose,
  campanhaId,
}: ModalCampanhaProps) => {

  const {
    handleSubmit,
    register,
    watch,
    setValue, reset, clearErrors,
    formState: { errors },
  } = useForm<Campanha>({
    defaultValues: {
      name: campanhaId?.name || '',
      mediaUrl: campanhaId?.mediaUrl || null,
      start: dayjs(campanhaId?.start).tz("America/Sao_Paulo") || null,
      sessionId: campanhaId?.sessionId || '',
      delay: campanhaId?.delay || 20,
      messages: [
        campanhaId?.message1 || '',
        campanhaId?.message2 || '',
        campanhaId?.message3 || '',
      ],
    },
  })
  const { whatsApps } = useWhatsappStore()
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [arquivos, setArquivos] = useState<File | null>(null);

  const [messagemPreview, setMessagemPreview] = useState('message1')
  const msgArray = ['message1', 'message2', 'message3']
  const [messageTemplate] = useState({
    mediaUrl: null,
    id: null,
    ack: 3,
    read: true,
    fromMe: true,
    body: null,
    mediaType: 'chat',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    quotedMsgId: null,
    delay: 20,
    ticketId: 0,
    contactId: null,
    userId: null,
    contact: null,
    quotedMsg: null,
  })




  const handleCloseModal = () => {
    reset();           // Resetando os campos
    clearErrors();     // Limpando os erros
    setClose()
  }

  const onSubmit = async (data: Campanha) => {
    if (data.start) {
      const fixedDate = dayjs(data.start, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm:ssZ");
      data.start = fixedDate;
    }

    const medias = new FormData()
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        // Adicionar cada item do array individualmente
        data[key].forEach((value) => {
          medias.append(`${key}[]`, value); // Usa `key[]` para indicar um array
        });
      } else {
        medias.append(key, data[key]);
      }
    });

    medias.append('medias', arquivos)

    try {
      if (campanhaId?.id) {

        await AlterarCampanha(medias, campanhaId.id)
        toast.info('Campanha editada!')
      } else {
        await CriarCampanha(medias)
        toast.info('Campanha criada!')
      }
      handleCloseModal()
    } catch (error) {
      Errors(error)
      handleCloseModal()
    }
  }
  const getFile = useCallback(async () => {
    if (campanhaId) {
      const file = await urlToFile(campanhaId.mediaUrl);
      if (file) {
        setArquivos(file)
        setMediaUrl(file.name)
      }
    }
  }, [campanhaId])
  useEffect(() => {
    getFile()
  }, [])
  const cSessions = () => {
    return whatsApps.filter(
      w => ['whatsapp', 'baileys'].includes(w.type) && !w.isDeleted
    )
  }

  const cMessages = () => {

    return msgArray
      .filter(el => messagemPreview === el) // Filtra a mensagem selecionada
      .map(el => {
        const index = parseInt(el.replace('message', '')) - 1; // Extrai o número e ajusta o índice
        const messageBody = watch(`messages.${index}`) || '';

        if (arquivos?.type) {
          const blob = new Blob([arquivos], { type: arquivos.type })
          return {
            ...messageTemplate,
            id: 'mediaUrl',
            mediaUrl: window.URL.createObjectURL(blob),
            body: messageBody,
            mediaType: arquivos.type.substr(0, arquivos.type.indexOf('/'))
          }
        } else if (campanhaId?.mediaUrl) {

          return {
            ...messageTemplate,
            id: 'mediaUrl',
            mediaUrl: campanhaId.mediaUrl,
            body: messageBody,
            mediaType: campanhaId.mediaType
          }
        }
        return {
          ...messageTemplate,
          id: el,
          body: messageBody, // Usa o valor encontrado
        };
      });
  };




  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size <= 15728640) { // Limite de tamanho do arquivo
        setArquivos(file);
        setMediaUrl(file.name);
      } else {
        alert('O arquivo excede o tamanho máximo permitido.');
      }
    }
  };


  const handleClear = () => {
    setMediaUrl(null);
    setArquivos(null);
    if (campanhaId) {
      campanhaId.mediaUrl = null
    }
  };
  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 2 }} variant="h3">
            Cadastrar Campanha
          </Typography>
          <Typography variant="subtitle2">
            As mensagens serão enviadas em horário comercial e dias úteis.
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Nome da campanha"
                {...register('name', { required: 'Descriação é obrigatório' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                onChange={e => setValue('name', e.target.value,)}
              />
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <Stack spacing={2} sx={{ minWidth: 305 }}>
                  <MobileDateTimePicker
                    value={watch('start') ? dayjs(watch('start')).isValid() ? dayjs(watch('start')) : null : null}
                    onChange={(date: Dayjs) => {
                      if (date?.isValid()) {
                        setValue('start', date);
                      }

                    }}

                    slotProps={{
                      textField: {
                        ...register('start', { required: 'Data é obrigatória' }),
                        error: !!errors.start,
                        helperText: errors.start?.message,
                        fullWidth: true,
                        variant: 'outlined',
                      },
                    }}
                  />
                </Stack>
              </LocalizationProvider>

            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Enviar por:</InputLabel>
                <Select
                  label="Enviar por"
                  variant="outlined"
                  {...register('sessionId', { required: 'Sessão é obrigatória' })}
                  value={watch('sessionId') || ''}
                  onChange={e => setValue('sessionId', e.target.value)}
                >
                  {cSessions().map(sessao => (
                    <MenuItem key={sessao.id} value={sessao.id}>
                      {sessao.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.sessionId && (
                  <Typography color="error">{errors.sessionId.message}</Typography>
                )}
              </FormControl>
              <TextField
                sx={{ width: '100px' }}
                variant="outlined"
                label="Delay"
                {...register('delay', {
                  required: 'Delay é obrigatório',
                  validate: value => value > 0 || 'Delay deve ser maior que 0',
                })}
                value={watch('delay') || ''}
                onChange={e => setValue('delay', Number(e.target.value))}
                error={!!errors.delay}
                helperText={errors.delay?.message}

              />
              {!mediaUrl ? (
                <>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{ bgcolor: 'blueGrey.100' }}

                  >
                    <Typography> Mídia mensagem</Typography>
                    <input
                      type="file"
                      hidden
                      accept=".jpg,.png,image/jpeg,.pdf,.doc,.docx,.mp4,.xls,.xlsx,.jpeg,.zip,.ppt,.pptx,image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {/* <div style={{ fontSize: 12, textAlign: 'center' }}>
                    Máx. 15MB por arquivo, formatos suportados: JPG, PNG, PDF, DOC, etc.
                  </div> */}
                </>
              ) : (
                <TextField
                  label="Mídia mensagem"
                  value={mediaUrl}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton onClick={handleClear}>
                        <Close />
                      </IconButton>
                    ),
                  }}

                  variant="outlined"
                  sx={{ bgcolor: 'blueGrey.100' }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box id="left" sx={{ minWidth: '400px' }}>
                {msgArray.map((msgKey, idx) => (
                  <Box key={msgKey}>
                    <Typography>{idx + 1}º Mensagem</Typography>
                    <TextField
                      fullWidth
                      variant="filled"
                      multiline
                      rows={5}
                      {...register(`messages.${idx}`, { required: "Mensagem é obrigatória" })} // Registrando com o índice no array
                      error={!!errors.messages?.[idx]}
                      helperText={errors.messages?.[idx]?.message}
                      value={watch(`messages.${idx}`) || ''}
                      onChange={e => setValue(`messages.${idx}`, e.target.value)}
                    />
                  </Box>
                ))}
              </Box>
              <Box
                id="right"
                sx={{
                  width: '500px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <RadioGroup
                  value={messagemPreview}
                  onChange={e => setMessagemPreview(e.target.value)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  {msgArray.map(i => (
                    <FormControlLabel
                      key={i}
                      value={i}
                      control={<Radio size="small" />}
                      label={`Mensagem ${msgArray.indexOf(i) + 1}`}
                    />
                  ))}
                </RadioGroup>
                <MolduraCelular>
                  <ChatMensagem mensagens={cMessages()} scrollTo={false} />
                </MolduraCelular>
              </Box>
            </Box>
          </Box>
          <DialogActions>
            <Button variant="contained" color="success" type="submit">
              Salvar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
