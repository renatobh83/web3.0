import {
  Box,
  Button,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
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
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { MensagemRespondida } from './MensagemRespondida'
import { useAtendimentoTicketStore } from '../../store/atendimentoTicket'

import { EventEmitter } from 'events'
import React from 'react'
import { Vcard } from '../../components/AtendimentoComponent/Vcard'

export const eventEmitterScrool = new EventEmitter()
// interface Mensagem {
//   mediaType: string
//   mediaUrl: string

//   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//   isSticker: any
//   id: number
//   createdAt: string
//   body: string
//   fromMe: boolean
//   scheduleDate: Date
//   status: string
//   reaction: string
//   reactionFromMe: boolean
//   isDeleted: boolean
//   updatedAt: Date
//   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//   quotedMsg: any
// }

interface ChatMensagemProps {
  setReplyingMessage?: (any) => void
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  mensagens: any[],
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  getMensagenParaEncaminhar?: (menssagen: any) => void
  openModalEcanminhar?: () => void
  scrollTo?: boolean
}

export const ChatMensagem = ({
  mensagens,
  setReplyingMessage,
  getMensagenParaEncaminhar,
  openModalEcanminhar,
  scrollTo
}: ChatMensagemProps) => {

  const isScrool = scrollTo === false ? scrollTo : true
  const [_modalImageUrl, setModalImageUrl] = useState<string | null>(null)
  // const lastMessageRef = useRef<HTMLInputElement | null>(null)
  const [_modalOpen, setModalOpen] = useState(false)
  const { mode } = useColorScheme()
  const [ativarMultiEncaminhamento, setAtivarMultiEncaminhamento] = useState(false)
  const ticketFocado = useAtendimentoTicketStore(s => s.ticketFocado)
  // const [isShowOptions, setIsShowOptions] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openStyledMenu, setOpenStyledMenu] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  )
  // valores para icone de agendamento
  const [_anchorElAgenda, setAnchorElAgenda] = useState(null)
  const [messageAgendamento, setMessageAgendamento] = useState(null)

  // useEffect(() => {
  //   console.log(mensagens)
  // }, [mensagens])
  const [anchorEls, setAnchorEls] = useState<
    Record<string, HTMLElement | null>
  >({})
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const [mensagensParaEncaminhar, setmensagensParaEncaminhar] = useState([])
  const [checkboxStates, setCheckboxStates] = useState<{
    [key: string]: boolean
  }>({})

  const isPDF = (url) => {
    if (!url) return false;
    const split = url.split(".");
    const ext = split[split.length - 1];
    return ext === "pdf";
  }
  const handleOpenModal = () => {
    openModalEcanminhar()
  }
  const isGroupLabel = mensagem => {
    try {
      return ticketFocado?.isGroup ? mensagem.contact.name : ''
    } catch (error) {
      return ''
    }
  }
  // const getAudioSource = url => {
  //   try {
  //     const newUrl = url.replace('.ogg', '.mp3')
  //     return newUrl
  //   } catch (error) {
  //     return url
  //   }
  // }
  const openLinkInNewPage = url => {
    const base64Image = `data:image/jpeg;base64,${url}`;
    const novaAba = window.open();
    novaAba.document.write('<html><head><title>Mapa</title></head><body>');
    novaAba.document.write(`<img src="${base64Image}" alt="Mapa">`);
    novaAba.document.write('</body></html>');
    // window.open(url, '_blank')
  }


  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, id: any) => {
    setAnchorEl(event.currentTarget) // Define a ancora do menu
    setSelectedMessageId(id) // Armazena o ID da mensagem clicada
    setOpenStyledMenu(true)
  }
  const handleCloseMenu = () => {
    setHoveredIndex(null)
    setAnchorEl(null)
    setOpenStyledMenu(false)
    setSelectedMessageId(null)
  }



  // const handleMouseEnter = (event, id) => {
  //   setAnchorElAgenda(event.currentTarget)
  //   setMessageAgendamento(id)
  // }
  const handleMouseLeave = () => {
    setAnchorElAgenda(null) // Fecha o menu ao sair do ícone
    setMessageAgendamento(null)
  }



  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    mensagemId: any
  ) => {
    const anchorEl = event.currentTarget;

    if (anchorEl) {
      setMessageAgendamento(mensagemId);
      setAnchorEls((prev) => ({
        ...prev,
        [mensagemId]: anchorEl, // Atualiza o estado com o currentTarget
      }));
      setOpen((prev) => ({
        ...prev,
        [mensagemId]: true, // Define o popover como aberto para o id correto
      }));
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handlePopoverClose = (mensagemId: any) => {
    setAnchorEls(prev => ({ ...prev, [mensagemId]: null }))
    setOpen(prev => ({ ...prev, [mensagemId]: false }))
    setMessageAgendamento(null)
  }



  // Função para gerenciar a seleção de mensagens
  const handleVerificarEncaminharMensagem = mensagem => {
    setmensagensParaEncaminhar(prev => {
      const index = prev.findIndex(m => m.id === mensagem.id)

      // Se a mensagem não estiver na lista e ainda não atingiu o limite
      if (index === -1) {
        if (prev.length < 10) {
          const newMessages = [...prev, mensagem]

          return newMessages // Adiciona a nova mensagem
        }
        toast.error('Permitido no máximo 10 mensagens.', {
          position: 'top-center',
        })
        return prev // Não permite adicionar mais mensagens
      }

      // Se a mensagem já estiver na lista, remove ela
      const updatedMessages = prev.filter(m => m.id !== mensagem.id)

      return updatedMessages
    })
  }

  // Função para lidar com mudanças no estado do checkbox
  const handleCheckboxChange = mensagem => {
    setCheckboxStates(prev => {
      const currentState = prev[mensagem.id] || false

      // Somente permite a mudança de estado se o limite de 10 não for atingido
      if (!currentState && mensagensParaEncaminhar.length >= 10) {
        toast.error('Permitido no máximo 10 mensagens.', {
          position: 'top-center',
        })
        return prev
      }

      // Atualiza o estado do checkbox e chama a função de verificação de mensagens
      const newCheckboxStates = { ...prev, [mensagem.id]: !currentState }
      handleVerificarEncaminharMensagem(mensagem)
      return newCheckboxStates
    })
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      const element = document.getElementById('inicioListaMensagensChat')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 200)
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {

    // Adiciona o listener ao montar o componente
    eventEmitterScrool.on('scrollToBottomMessageChat', scrollToBottom)
    // Remove o listener ao desmontar o componente

    if (isScrool)
      scrollToBottom()

    return () => {
      eventEmitterScrool.off('scrollToBottomMessageChat', scrollToBottom)
    }
  }, [])

  return (
    <>
      <Box
        id="messages"
        sx={{
          p: 2,
          paddingTop: '70px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {mensagens?.filter(mensagem => mensagem !== undefined && mensagem !== null && mensagem.mediaType !== 'call_log')
          .map((mensagem, index) => (
            <React.Fragment key={mensagem.id}>

              {index === 0 ||
                (formatarData(mensagem.createdAt) !==
                  formatarData(mensagens[index - 1].createdAt)) &&
                <Divider
                  key={`hr - ${
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    index}`}
                >
                  <Chip
                    label={formatarData(mensagem.createdAt)}
                    size="small" />
                </Divider>

              }

              {mensagens.length && index === mensagens.length - 1 &&
                <div id="lastMessageRef" />
              }
              <Box
                id="message-container"
                sx={{
                  alignItems: 'flex-end',
                  flexWrap: 'nowrap',
                  flexDirection: mensagem.fromMe && 'row-reverse',
                  display: 'flex',
                  position: 'relative',
                }}
              > <Box id={String(mensagem.id)} onMouseLeave={handleMouseLeave} />
                <Box
                  position='relative'
                  sx={{
                    backgroundColor: mensagem.fromMe
                      ? '#f5f5f5'
                      : mode === 'dark'
                        ? '#bbdefb'
                        : '#e3f2fd',
                    color: mode === 'dark' ? '#000' : '#000',
                    minHeight: '48px',
                    padding: '6px 6px',
                    wordBreak: 'break-word',
                    position: 'relative',
                    lineHeight: '1.2',
                    borderRadius: '20px',
                    borderBottomLeftRadius: mensagem.fromMe
                      ? '20px'
                      : '0px',
                    borderBottomRightRadius: mensagem.fromMe
                      ? '0px'
                      : '20px',
                  }}
                >
                  <Box
                    id="text-content"
                    position='relative'
                    sx={{
                      padding: 1,
                      minWidth: '100px',
                      maxWidth: '350px',
                      lineHeight: '1.2',
                      wordBreak: 'break-word',

                    }}
                    onMouseOver={() => setHoveredIndex(mensagem.id)}
                    onMouseLeave={() => handleCloseMenu()}
                  >
                    {ativarMultiEncaminhamento &&
                      (mensagem.fromMe ? (
                        <Checkbox
                          key={mensagem.id}
                          checked={checkboxStates[mensagem.id] || false}
                          onChange={() => handleCheckboxChange(mensagem)}
                          sx={{
                            position: 'absolute',
                            left: '-50px',
                            bottom: -10,
                            zIndex: 99999,
                          }} />
                      ) : (
                        <Checkbox
                          key={mensagem.id}
                          checked={checkboxStates[mensagem.id] || false}
                          onChange={() => handleCheckboxChange(mensagem)}
                          sx={{
                            position: 'absolute',
                            right: '-50px',
                            bottom: -10,
                            zIndex: 99999,
                          }} />
                      ))}
                    {mensagem.scheduleDate && (
                      <>
                        <IconButton
                          sx={{
                            // Só exibe o botão quando hoveredIndex coincide com a mensagem
                            position: 'absolute',
                            zIndex: '99999',
                            bottom: '-24px',
                            left: mensagem.fromMe ? '-15px' : 'none',
                            padding: '0px', // Remove o espaçamento extra em torno do ícone
                            color: mensagem.scheduleDate &&
                              mensagem.status === 'pending'
                              ? 'green'
                              : !['pending', 'canceled'].includes(
                                mensagem.status
                              )
                                ? 'blue'
                                : '',
                            backgroundColor: 'transparent !important', // Remove qualquer fundo indesejado
                            border: 'none',
                          }}
                          onMouseEnter={(e) => handlePopoverOpen(e, mensagem.id)}
                          onMouseLeave={() => handlePopoverClose(mensagem.id)}
                        >
                          <CalendarMonth
                            sx={{
                              fontSize: '20px',
                            }} />
                        </IconButton>
                        {messageAgendamento === mensagem.id && anchorEls && (

                          < Popover
                            id="mousepopover"
                            sx={{ pointerEvents: 'none' }}
                            open={!!open[mensagem.id]}
                            anchorEl={anchorEls[mensagem.id]}
                            anchorOrigin={{
                              vertical: 'center',
                              horizontal: 'left',  // Alinhar o popover à esquerda do elemento
                            }}
                            transformOrigin={{
                              vertical: 'center',
                              horizontal: 'right',  // Alinhar a origem de transformação à direita do popover para que ele se posicione à esquerda do elemento
                            }}

                            onClose={() => handlePopoverClose(mensagem.id)}
                            disableRestoreFocus
                          >

                            <Box sx={{ p: 2 }}>
                              <Typography
                                sx={{ p: 1 }}
                                variant="subtitle2"
                              >
                                {' '}
                                Mensagem agendada
                              </Typography>
                              <Typography
                                sx={{ p: 1 }}
                                variant="body2"
                              >
                                {' '}
                                Criado em:{' '}
                                {formatarData(
                                  mensagem.createdAt,
                                  'dd/MM/yyyy HH:mm'
                                )}
                              </Typography>
                              <Typography
                                sx={{ p: 1 }}
                                variant="body2"
                              >
                                {' '}
                                Programado para:{' '}
                                {formatarData(
                                  mensagem.scheduleDate,
                                  'dd/MM/yyyy HH:mm'
                                )}
                              </Typography>
                            </Box>
                          </Popover>
                        )}
                      </>
                    )}

                    {mensagem.isDeleted && (
                      <Typography variant="body2">
                        Menssagem apagada em{' '}
                        {formatarData(mensagem.updatedAt, 'dd/MM/yyyy')}
                      </Typography>
                    )}
                    {isGroupLabel(mensagem) && (
                      <Typography variant="body2">
                        {isGroupLabel(mensagem)}
                      </Typography>
                    )}
                    {mensagem.quotedMsg && (
                      <MensagemRespondida
                        mensagem={mensagem.quotedMsg} />
                    )}
                    {!mensagem.isDeleted && (
                      <>

                        <IconButton
                          sx={{

                            display: hoveredIndex === mensagem.id
                              ? 'block'
                              : 'none', // Só exibe o botão quando hoveredIndex coincide com a mensagem
                            position: 'absolute',
                            zIndex: '99999',
                            top: '-15px',
                            //    left: mensagem.fromMe ? '-17px' : '110px',

                            padding: '0px', // Remove o espaçamento extra em torno do ícone
                            fontSize: '16px', // Ajusta o tamanho do ícone
                            color: '#000 !important', // Cor do ícone
                            backgroundColor: 'transparent !important', // Remove qualquer fundo indesejado
                            borderRadius: '50%', // Deixa o ícone circular
                            border: 'none',
                          }}
                          onClick={event => handleOpenMenu(event, mensagem.id)}
                        >
                          <ArrowDownward
                            sx={{
                              fontSize: '20px'
                            }} />
                        </IconButton>
                        {selectedMessageId === String(mensagem.id) &&
                          anchorEl &&
                          openStyledMenu && (
                            <Menu
                              sx={{ zIndex: 2000 }}
                              anchorEl={anchorEl} // Usando o ícone como âncora
                              open={openStyledMenu}
                              onClose={handleCloseMenu}
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: mensagem.fromMe ? -200 : 45,
                              }}
                            >
                              <MenuItem
                                onClick={() => { setReplyingMessage(mensagem); handleCloseMenu() }}
                              >
                                Responder
                              </MenuItem>
                              <MenuItem onClick={() => {
                                handleOpenModal();
                                getMensagenParaEncaminhar(mensagem);
                                handleCloseMenu()
                              }}>

                                Encaminhar</MenuItem>
                              <MenuItem onClick={() => {
                                setAtivarMultiEncaminhamento(!ativarMultiEncaminhamento);
                                handleCloseMenu()
                              }}>
                                Marcar (encaminhar varias)
                              </MenuItem>
                              {mensagem.fromMe && (
                                <MenuItem>Editar mensagem</MenuItem>
                              )}
                              <MenuItem>Reagir</MenuItem>
                              <MenuItem>Deletar</MenuItem>
                            </Menu>
                          )}
                      </>
                    )}
                    {mensagem.mediaType === 'audio' &&
                      mensagem.mediaUrl && (
                        <Box  >
                          {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
                          <audio

                            controls
                            controlsList="download playbackrate volume"
                          >
                            <source
                              src={mensagem.mediaUrl}
                              type="audio/ogg" />
                          </audio>
                        </Box>
                      )}
                    {['vcard', 'contactMessage'].includes(
                      mensagem.mediaType
                    ) && (
                        <Vcard vcard={mensagem.body} />
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
                        image={mensagem.mediaUrl} />
                    )}
                    {['location', 'locationMessage'].includes(
                      mensagem.mediaType
                    ) &&
                      <CardMedia
                        onClick={() => {
                          openLinkInNewPage(mensagem.body)
                        }}
                        component="img"
                        height="150px"
                        width="330px"
                        image={`data:image/jpeg;base64, ${mensagem.body}`}
                      />

                    }
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
                          image={mensagem.mediaUrl} />
                      )}
                    {(mensagem.mediaType === 'imageMessage' ||
                      (mensagem.mediaType === 'image' &&
                        !mensagem.mediaUrl.includes('.webp'))) &&
                      !mensagem.isSticker && (
                        <CardMedia
                          onClick={() => {
                            setModalImageUrl(mensagem.mediaUrl || null)
                            setModalOpen(true)
                          }}
                          component="img"
                          height="150px"
                          width="330px"
                          image={mensagem.mediaUrl} />
                      )}
                    {mensagem.mediaType === 'image' &&
                      !mensagem.mediaUrl.includes('.webp') &&
                      mensagem.isSticker && (
                        <CardMedia
                          onClick={() => {
                            setModalImageUrl(mensagem.mediaUrl || null)
                            setModalOpen(true)
                          }}
                          component="img"
                          height="100px"
                          width="100px"
                          image={mensagem.mediaUrl} />
                      )}

                    {(mensagem.mediaType === 'video' ||
                      mensagem.mediaType === 'videoMessage') && (
                        // biome-ignore lint/a11y/useMediaCaption: <explanation>
                        <video
                          controls
                          src={mensagem.mediaUrl}
                          style={{
                            // objectFit: 'cover',
                            width: 330,
                            height: 150,
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                            borderBottomLeftRadius: 8,
                            borderBottomRightRadius: 8,
                          }} />
                      )}
                    {mensagem.mediaType === 'interactive' && (
                      <Box
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                        dangerouslySetInnerHTML={{
                          __html: formatarMensagemRespostaBotaoWhatsapp(
                            DOMPurify.sanitize(mensagem.body)
                          ),
                        }} />
                    )}
                    {mensagem.mediaType === 'button' && (
                      <Box
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                        dangerouslySetInnerHTML={{
                          __html: formatarBotaoWhatsapp(
                            DOMPurify.sanitize(mensagem.body)
                          ),
                        }} />
                    )}
                    {mensagem.mediaType === 'list' && (
                      <Box
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                        dangerouslySetInnerHTML={{
                          __html: formatarMensagemDeLista(
                            DOMPurify.sanitize(mensagem.body)
                          ),
                        }} />
                    )}
                    {mensagem.mediaType === 'notes' && (
                      <Box
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                        dangerouslySetInnerHTML={{
                          __html: formatarNotas(
                            DOMPurify.sanitize(mensagem.body)
                          ),
                        }} />
                    )}
                    {mensagem.mediaType === 'templates' && (
                      <Box
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                        dangerouslySetInnerHTML={{
                          __html: formatarTemplates(
                            DOMPurify.sanitize(mensagem.body)
                          ),
                        }} />
                    )}
                    {!['image', 'video', 'imageMessage', 'videoMessage', 'audio'].includes(mensagem.mediaType)
                      && mensagem.mediaUrl && (
                        <Box sx={{ textAlign: 'center', width: '100%', overflowX: 'hidden' }}>
                          {isPDF(mensagem.mediaUrl) ? (
                            <iframe
                              frameBorder="0"
                              scrolling="no"
                              style={{ width: 330, height: 150, overflowY: 'hidden' }}
                              src={mensagem.mediaUrl}
                              title="PDF Preview"
                            >
                              Faça download do PDF
                            </iframe>
                          ) : null}
                          <Tooltip title={mensagem.mediaUrl ? `Baixar: ${mensagem.mediaName || mensagem.body}` : ''}>
                            <Button
                              variant="contained"
                              color="primary"
                              href={mensagem.mediaUrl}
                              target={isPDF(mensagem.mediaUrl) ? '_blank' : ''}
                              download
                              style={{ marginTop: 8 }}
                            >
                              <Grid container alignItems="center">
                                <Grid style={{ maxWidth: 290, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {formatarMensagemWhatsapp(mensagem.body)}
                                </Grid>
                              </Grid>
                            </Button>
                          </Tooltip>
                        </Box>

                      )}

                    {['image', 'video', 'imageMessage', 'videoMessage'].includes(mensagem.mediaType) && mensagem.mediaUrl &&
                      <Box sx={{ textAlign: 'center', width: '100%', overflowX: 'hidden' }}>

                        <Tooltip title={mensagem.mediaUrl ? `Baixar: ${mensagem.mediaName || mensagem.body}` : ''} arrow>
                          <Button
                            variant="contained"
                            color="primary"
                            href={mensagem.mediaUrl}
                            target="_blank"
                            download
                            style={{ marginTop: 8 }}

                          >
                            <Grid container alignItems="center">
                              <Grid style={{ maxWidth: 290, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {formatarMensagemWhatsapp(mensagem.body || mensagem.mediaName)}
                              </Grid>
                            </Grid>
                          </Button>
                        </Tooltip>
                      </Box>
                    }
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
                        <Box
                          //  dangerouslySetInnerHTML={{ __html: formatarMensagemWhatsapp(DOMPurify.sanitize(mensagem.body)) }}
                          sx={{
                            mt: '2px',
                            minWidth: '100px',
                            minHeight: '48px',
                            position: 'relative',
                            padding: ' 12px 0 8px 0',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ wordWrap: 'break-word' }}>

                            <span
                              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                              dangerouslySetInnerHTML={{
                                __html: formatarMensagemWhatsapp(
                                  DOMPurify.sanitize(mensagem.body)
                                ),
                              }} />
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
                                sx={{
                                  fontSize: '12px',
                                  color: 'rgba(0, 0, 0, 0.45)',
                                  mr: 1
                                }}
                              >
                                {dataInWords(mensagem.createdAt)}
                              </Typography>
                              <DoneAll
                                sx={{
                                  fontSize: '16px',
                                  color: 'rgba(0, 0, 0, 0.45)',
                                }} />
                            </Box>
                          ) : (
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '12px',
                                color: 'rgba(0, 0, 0, 0.45)',
                              }}
                            >
                              {dataInWords(mensagem.createdAt)}
                            </Typography>
                          )}
                        </Box>
                      )}
                    {mensagem.reaction || mensagem.reactionFromMe && (
                      <Box sx={{
                        position: 'absolute',

                        background: 'white',
                        borderRadius: '50%',
                        fontSize: '16px',
                        left: mensagem.fromMe ? '0' : '10px',

                      }}>
                        {mensagem.reaction}{mensagem.reactionFromMe}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </React.Fragment>
          ))}

      </Box >
      <div id="inicioListaMensagensChat" />
    </>
  )
}
