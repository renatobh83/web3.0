import {
  Avatar,
  Box,
  Button,
  CardMedia,
  Checkbox,
  Chip,
  Dialog,
  Divider,
  Icon,
  IconButton,
  Popover,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material'

import { formatarData, formatarMensagemWhatsapp } from '../../utils/helpers'
import {
  ArrowDownward,
  CalendarMonth,
  Check,
  DoneAll,
} from '@mui/icons-material'
import {
  dataInWords,
  formatarBotaoWhatsapp,
  formatarMensagemDeLista,
  formatarMensagemRespostaBotaoWhatsapp,
  formatarNotas,
  formatarTemplates,
} from './mixinCommon'
import PlayForWorkIcon from '@mui/icons-material/PlayForWork'
import DOMPurify from 'dompurify'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { MensagemRespondida } from './MensagemRespondida'

export const ChatMensagem = ({ menssagens }) => {
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null)
  const lastMessageRef = useRef<HTMLInputElement | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { mode } = useColorScheme()
  const ativarMultiEncaminhamento = false
  const ticketFocado = { isGroup: false }
  const [isShowOptions, setIsShowOptions] = useState(false)
  const isGroupLabel = mensagem => {
    try {
      return ticketFocado.isGroup ? mensagem.contact.name : ''
    } catch (error) {
      return ''
    }
  }
  const getAudioSource = url => {
    try {
      const newUrl = url.replace('.ogg', '.mp3')
      return newUrl
    } catch (error) {
      return url
    }
  }
  const openLinkInNewPage = url => {
    window.open(url, '_blank')
  }
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const [mensagensParaEncaminhar, setmensagensParaEncaminhar] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState<{ [key: string]: boolean }>({});

  // Função para gerenciar a seleção de mensagens
  const handleEerificarEncaminharMensagem = (mensagem) => {
    setmensagensParaEncaminhar((prev) => {
      const index = prev.findIndex((m) => m.id === mensagem.id);

      // Se a mensagem não estiver na lista e ainda não atingiu o limite
      if (index === -1) {
        if (prev.length < 10) {
          const newMessages = [...prev, mensagem];
          return newMessages; // Adiciona a nova mensagem
        }
        toast.error('Permitido no máximo 10 mensagens.');
        return prev; // Não permite adicionar mais mensagens
      }

      // Se a mensagem já estiver na lista, remove ela
      const updatedMessages = prev.filter((m) => m.id !== mensagem.id);
      return updatedMessages;
    });
  };

  // Função para lidar com mudanças no estado do checkbox
  const handleCheckboxChange = (mensagem) => {
    setCheckboxStates((prev) => {
      const currentState = prev[mensagem.id] || false;

      // Somente permite a mudança de estado se o limite de 10 não for atingido
      if (!currentState && mensagensParaEncaminhar.length >= 10) {
        toast.error('Permitido no máximo 10 mensagens.');
        return prev;
      }

      // Atualiza o estado do checkbox e chama a função de verificação de mensagens
      const newCheckboxStates = { ...prev, [mensagem.id]: !currentState };
      handleEerificarEncaminharMensagem(mensagem);
      return newCheckboxStates;
    });
  }
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <Box id='box-message' sx={{ padding: 2, position: 'relative' }}>
      {menssagens.map((mensagem, index) => (
        <div key={mensagem.id}>
          {index === 0 ||
            (formatarData(mensagem.createdAt) !==
              formatarData(menssagens[index - 1].createdAt) && (
                <Divider
                  key={`hr - ${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    index}`}>
                  <Chip label={formatarData(mensagem.createdAt)} size="small" />
                </Divider>
              ))}

          {menssagens.length && index === menssagens.length - 1 && (
            // biome-ignore lint/style/useSelfClosingElements: <explanation>
            <Box style={{ background: 'black' }} ref={lastMessageRef} />

          )}
          <Box
            key={`chat-message-${mensagem.id}`}
            id={`chat-message-${mensagem.id}`}
          />
          <Box
            onMouseOver={() => setHoveredIndex(mensagem.id)}
            onMouseLeave={() => setHoveredIndex(null)}
            id={`chat-message-${mensagem.id}`}
            sx={{

              borderRadius: '15px',
              position: 'relative',
              mb: 1,
              width: '100%',
              minWidth: '100px',
              maxWidth: '350px',
              backgroundColor: mensagem.fromMe
                ? '#f5f5f5'
                : mode === 'dark'
                  ? '#bbdefb'
                  : '#e3f2fd',
              color: mode === 'dark' ? '#000' : '#000',
              ml: mensagem.fromMe ? 'auto' : 0,
              mr: !mensagem.fromMe ? 'auto' : 0,
              textAlign: mensagem.fromMe ? 'right' : 'left',
            }}
          >
            {/* Ativar o checkbox encaminhar mensagem */}
            {ativarMultiEncaminhamento && (
              <Box id={`box-chat-message-${mensagem.id}`} sx={{ position: 'relative' }}>
                {mensagem.fromMe ? (
                  <Checkbox
                    key={mensagem.id}
                    checked={checkboxStates[mensagem.id] || false}
                    onChange={() => handleCheckboxChange(mensagem)}
                    sx={{ position: 'absolute', left: 0, zIndex: 99999 }} />) :
                  <Checkbox key={mensagem.id}
                    checked={checkboxStates[mensagem.id] || false}
                    onChange={() => handleCheckboxChange(mensagem)} sx={{ position: 'absolute', right: 0, zIndex: 99999 }} />
                }
              </Box>)}

            {/* Mostrar mensagens com agendamento */}
            {mensagem.scheduleDate && (
              <Icon
                style={{
                  width: '25px',
                  height: '25px',
                  position: 'absolute',
                  zIndex: 100,
                }}
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                sx={{
                  color:
                    mensagem.scheduleDate && mensagem.status === 'pending'
                      ? 'green'
                      : !['pending', 'canceled'].includes(mensagem.status)
                        ? 'blue'
                        : '',
                }}
              >
                <CalendarMonth />
                <Popover
                  id="mouse-over-popover"
                  sx={{ pointerEvents: 'none' }}
                  open={open}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                >
                  <Box sx={{ p: 2 }}>
                    <Typography sx={{ p: 1 }} variant="subtitle2">
                      {' '}
                      Mensagem agendada
                    </Typography>
                    <Typography sx={{ p: 1 }} variant="body2">
                      {' '}
                      Criado em:{' '}
                      {formatarData(mensagem.createdAt, 'dd/MM/yyyy HH:mm')}
                    </Typography>
                    <Typography sx={{ p: 1 }} variant="body2">
                      {' '}
                      Programado para:{' '}
                      {formatarData(mensagem.scheduleDate, 'dd/MM/yyyy HH:mm')}
                    </Typography>
                  </Box>
                </Popover>
              </Icon>
            )}
            {mensagem.isDeleted && (
              <Typography variant="body2">
                Menssagem apagada em{' '}
                {formatarData(mensagem.updatedAt, 'dd/MM/yyyy')}
              </Typography>
            )}
            {isGroupLabel(mensagem) && (
              <Typography variant="body2">{isGroupLabel(mensagem)}</Typography>
            )}
            {mensagem.quotedMsg && (
              <MensagemRespondida mensagem={mensagem.quotedMsg} />
            )}
            {/* ATIVAR ENCAMINHAMENTO E RESPONDER */}
            {!mensagem.isDeleted && (
              <IconButton
                sx={{
                  display: hoveredIndex === mensagem.id ? 'block' : 'none',
                  position: 'absolute',
                  zIndex: '99999',
                  left: mensagem.fromMe ? '-9px' : 'none',
                  right: mensagem.fromMe ? 'none' : '0',
                  padding: '0px', // Remove o espaçamento extra em torno do ícone
                  fontSize: '16px', // Ajusta o tamanho do ícone
                  color: '#000 !important', // Cor do ícone
                  backgroundColor: 'transparent !important', // Remove qualquer fundo indesejado
                  borderRadius: '50%', // Deixa o ícone circular
                  border: 'none'
                }}
                onClick={() => alert('OpenMenu')}
              >
                <ArrowDownward
                  sx={{ fontSize: '20px', color: 'rgba(0, 0, 0, 0.45)' }}
                />
              </IconButton>
            )}
            {/* AUDIO */}
            {mensagem.mediaType === 'audio' && mensagem.mediaUrl && (
              <Box
                sx={{ width: 330, height: '100%' }}>
                {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
                <audio
                  style={{ width: '100%' }}
                  controls
                  controlsList="download playbackrate volume"
                >
                  <source src={mensagem.mediaUrl} type="audio/ogg" />

                </audio>
              </Box>
            )}
            {['vcard', 'contactMessage'].includes(mensagem.mediaType) && (
              // Criar Componento VCARD
              <Button>Download</Button>
            )}

            {mensagem.mediaType === 'sticker' && (
              <CardMedia
                onClick={() => {
                  setModalImageUrl(mensagem.mediaUrl || null)
                  setModalOpen(true)
                }}
                component="img"
                height="100px"
                width="100px"
                image={mensagem.mediaUrl}
              />
            )}
            {['location', 'locationMessage'].includes(mensagem.mediaType) &&
              // CRIAR MODAL ABRIR MAPs
              openLinkInNewPage(mensagem.body)}
            {/* FIGURINHAS */}
            {mensagem.mediaType === 'image' &&
              mensagem.mediaUrl.includes('.webp') && (
                <CardMedia
                  onClick={() => {
                    setModalImageUrl(mensagem.mediaUrl || null)
                    setModalOpen(true)
                  }}
                  component="img"
                  height="100px"
                  width="100px"
                // image={mensagem.mediaUrl}
                />
              )}
            {mensagem.mediaType === 'video' ||
              (mensagem.mediaType === 'videoMessage' && (
                // biome-ignore lint/a11y/useMediaCaption: <explanation>
                <video
                  controls
                  src={mensagem.mediaUrl}
                  style={{
                    objectFit: 'cover',
                    width: 330,
                    height: 15,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                  }}
                />
              ))}
            {mensagem.mediaType === 'interactive' && (
              <Box
                dangerouslySetInnerHTML={{
                  __html: formatarMensagemRespostaBotaoWhatsapp(
                    DOMPurify.sanitize(mensagem.body)
                  ),
                }}
              />
            )}
            {mensagem.mediaType === 'button' && (
              <Box
                dangerouslySetInnerHTML={{
                  __html: formatarBotaoWhatsapp(
                    DOMPurify.sanitize(mensagem.body)
                  ),
                }}
              />
            )}
            {mensagem.mediaType === 'list' && (
              <Box
                dangerouslySetInnerHTML={{
                  __html: formatarMensagemDeLista(
                    DOMPurify.sanitize(mensagem.body)
                  ),
                }}
              />
            )}
            {mensagem.mediaType === 'notes' && (
              <Box
                dangerouslySetInnerHTML={{
                  __html: formatarNotas(DOMPurify.sanitize(mensagem.body)),
                }}
              />
            )}
            {mensagem.mediaType === 'templates' && (
              <Box
                dangerouslySetInnerHTML={{
                  __html: formatarTemplates(DOMPurify.sanitize(mensagem.body)),
                }}
              />
            )}
            {![
              'audio',
              'vcard',
              'contactMessage',
              'locationMessage',
              'image',
              'imageMessage',
              'video',
              'videoMessage',
              'sticker',
              'location',
              'interactive',
              'button',
              'list',
              'button_reply',
              'sticker',
              'notes',
              'transcription',
            ].includes(mensagem.mediaType) &&
              mensagem.mediaUrl && <Box sx={{ mt: '20px' }}>Criar Iframe</Box>}

            {/* {['image', 'video', 'imageMessage', 'videoMessage'].includes(
              mensagem.mediaType
            ) &&
              mensagem.mediaUrl && (
                <Box sx={{ mt: '20px' }}>
                  <CardMedia
                    onClick={() => {
                      setModalImageUrl(mensagem.mediaUrl || null)
                      setModalOpen(true)
                    }}
                    component="img"
                    height="100px"
                    width="100px"
                    image={mensagem.mediaUrl}

                  />
                </Box>
              )} */}
            {mensagem.mediaType}
            {mensagem.mediaUrl}
          </Box>
          {/* Modal de Imagem */}
          {modalImageUrl && (
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
              <img src={modalImageUrl} alt="Imagem" />
            </Dialog>
          )}
        </div>
      ))}
    </Box>
  )
}
