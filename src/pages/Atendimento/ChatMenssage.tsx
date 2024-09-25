import {
  Box,
  Button,
  CardMedia,
  Checkbox,
  Dialog,
  Icon,
  IconButton,
  Popover,
  Typography,
  useColorScheme,
} from '@mui/material'

import { formatarData, formatarMensagemWhatsapp } from '../../utils/helpers'
import {
  ArrowDownward,
  CalendarMonth,
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
import DOMPurify from 'dompurify'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { MensagemRespondida } from './MensagemRespondida'
import { InputMenssagem } from './InputMenssagem'
import { useAtendimentoTicketStore } from '../../store/atendimentoTicket'

export const ChatMensagem = ({ menssagens }) => {
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null)
  const lastMessageRef = useRef<HTMLInputElement | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { mode } = useColorScheme()
  const ativarMultiEncaminhamento = false
  const ticketFocado = useAtendimentoTicketStore(s => s.ticketFocado)
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
    <>
      <Box id='box-message'
        sx={{
          minHeight: 'calc(-135px + 100vh)',
          height: 'calc(-135px + 100vh)',
          overflowY: 'auto',
          width: '100%',
          position: 'relative',
          contain: 'strict',
          willChange: 'scroll-position',

        }}>

        <Box
          id='scrollarea_container'
          sx={{
            scrollbarWidth: 'none',
            width: '100% !important',
            height: '100% !important',
            position: 'relative',
            overflow: 'auto',

          }}>
          <Box id="scrollarae-absoulte" sx={{
            position: 'absolute',
            minHeight: '100%',
            minWidth: '100%',

          }}>
            <Box id='messages' sx={
              {
                p: 2,

              }
            }>

              <span>
                {menssagens.map((mensagem, index) => (
                  <div key={mensagem.id}>
                    <Box id={mensagem.id} />
                    <Box sx={{
                      fontWeight: '500',
                      mb: 1
                    }}>
                      <Box id='message-container'
                        sx={{
                          alignItems: 'flex-end',
                          flexWrap: 'nowrap',
                          flexDirection: mensagem.fromMe && 'row-reverse',
                          display: 'flex'
                        }}>
                        <Box>
                          <Box
                            sx={{
                              backgroundColor: mensagem.fromMe
                                ? '#f5f5f5'
                                : mode === 'dark'
                                  ? '#bbdefb'
                                  : '#e3f2fd',
                              color: mode === 'dark' ? '#000' : '#000',
                              minHeight: '48px',
                              padding: 1,
                              wordBreak: 'break-word',
                              position: 'relative',
                              lineHeight: '1.2',
                              borderRadius: '4px'
                            }}
                          >
                            <Box id='text-content'
                              onMouseOver={() => setHoveredIndex(mensagem.id)}
                              onMouseLeave={() => setHoveredIndex(null)}>
                              <div>
                                <Box sx={{
                                  minWidth: '100px',
                                  maxWidth: '350px',
                                  lineHeight: '1.2',
                                  wordBreak: 'break-word',
                                  textAlign: mensagem.fromMe ? 'right' : 'left',
                                }}>
                                  {/* Ativar o checkbox encaminhar mensagem */}
                                  {ativarMultiEncaminhamento && (
                                    mensagem.fromMe ? (
                                      <Checkbox
                                        key={mensagem.id}
                                        checked={checkboxStates[mensagem.id] || false}
                                        onChange={() => handleCheckboxChange(mensagem)}
                                        sx={{
                                          position: 'absolute',
                                          left: '-35px', zIndex: 99999
                                        }} />) :
                                      <Checkbox key={mensagem.id}
                                        checked={checkboxStates[mensagem.id] || false}
                                        onChange={() => handleCheckboxChange(mensagem)}
                                        sx={{
                                          position: 'absolute',
                                          right: '-35px', zIndex: 99999
                                        }} />
                                  )}

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
                                        top: 0,
                                        left: mensagem.fromMe ? '-8px' : 'none',
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
                                        image={mensagem.mediaUrl}
                                      />
                                    )}
                                  {(mensagem.mediaType === 'imageMessage' || (mensagem.mediaType === 'image' && !mensagem.mediaUrl.includes('.webp'))) && !mensagem.isSticker && (
                                    <CardMedia
                                      onClick={() => {
                                        setModalImageUrl(mensagem.mediaUrl || null)
                                        setModalOpen(true)
                                      }}
                                      component="img"
                                      height="150px"
                                      width="330px"
                                      image={mensagem.mediaUrl}
                                    />
                                  )}
                                  {mensagem.mediaType === 'image' && !mensagem.mediaUrl.includes('.webp') && mensagem.isSticker && (
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
                                  {/* video */}
                                  {(mensagem.mediaType === 'video' ||
                                    mensagem.mediaType === 'videoMessage') && (
                                      // biome-ignore lint/a11y/useMediaCaption: <explanation>
                                      <video
                                        controls
                                        src={mensagem.mediaUrl}
                                        style={{
                                          objectFit: 'cover',
                                          width: 330,
                                          height: 150,
                                          borderTopLeftRadius: 8,
                                          borderTopRightRadius: 8,
                                          borderBottomLeftRadius: 8,
                                          borderBottomRightRadius: 8,
                                        }}
                                      />
                                    )}
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
                                  {/* nome do arquivo  */}
                                  {/* {['image', 'video', 'imageMessage', 'videoMessage'].includes(mensagem.mediaType) && mensagem.mediaUrl && (
                                  <Box>{formatarMensagemWhatsapp(mensagem.body || mensagem.mediaName)}</Box>
                                )} */}
                                  {![
                                    'vcard',
                                    'contactMessage',
                                    'application',
                                    'audio',
                                    'button',
                                    'list',
                                    'location',
                                    'locationMessage',
                                    'interactive',
                                    'button_reply',
                                    'sticker',
                                    'notes',
                                    'templates',
                                    'transcription',
                                  ].includes(mensagem.mediaType) && (
                                      <>
                                        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
                                        <Box

                                          //  dangerouslySetInnerHTML={{ __html: formatarMensagemWhatsapp(DOMPurify.sanitize(mensagem.body)) }}
                                          sx={{
                                            mt: '2px',
                                            minWidth: '100px',
                                            minHeight: '48px',
                                            position: 'relative',
                                            padding: '12px 16px',
                                            borderRadius: '16px',
                                            display: 'inline-block',

                                          }}
                                        >

                                          <Box sx={{ wordWrap: 'break-word' }}>
                                            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
                                            <span
                                              dangerouslySetInnerHTML={{
                                                __html: formatarMensagemWhatsapp(
                                                  DOMPurify.sanitize(mensagem.body)
                                                ),
                                              }}
                                            />
                                          </Box>
                                          {mensagem.fromMe ? (
                                            <Box
                                              sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                mt: '4px',
                                              }}
                                            >
                                              <Typography
                                                variant="caption"
                                                sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}
                                              >
                                                {dataInWords(mensagem.createdAt)}
                                              </Typography>
                                              <DoneAll
                                                sx={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.45)' }}
                                              />
                                            </Box>
                                          ) : (
                                            <Typography
                                              variant="caption"
                                              sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}
                                            >
                                              {dataInWords(mensagem.createdAt)}
                                            </Typography>
                                          )}
                                        </Box>
                                      </>
                                    )}
                                </Box>

                              </div>
                            </Box>
                          </Box>
                        </Box>

                      </Box>
                    </Box>
                    {/* Modal de Imagem */}
                    {modalImageUrl && (
                      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                        <img src={modalImageUrl} alt="Imagem" />
                      </Dialog>
                    )}
                  </div>
                ))}
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
      <div id="inicioListaMensagensChat" />
      <Box

        sx={{ position: 'fixed', bottom: 0, left: { sm: 0, md: 380, xs: 0 }, right: 0, zIndex: 2000, px: 1 }}
        component={'footer'}>
        <Box id='Drop_area' sx={{
          py: 2,
          fontFamily: '"Roboto", sans-serif'
        }}>

          <InputMenssagem ticketFocado={ticketFocado} />
        </Box>
      </Box>
    </>
  )
}
