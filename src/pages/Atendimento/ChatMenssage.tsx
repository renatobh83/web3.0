import {
  alpha,
  Box,
  Button,
  CardMedia,
  Checkbox,
  Chip,
  Dialog,
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  Popover,
  styled,
  Typography,
  useColorScheme,
} from '@mui/material'

import { formatarData, formatarMensagemWhatsapp } from '../../utils/helpers'
import {
  ArrowDownward,
  ArrowLeft,
  CalendarMonth,
  DoneAll,
  TipsAndUpdates,
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
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { MensagemRespondida } from './MensagemRespondida'
import { InputMenssagem } from './InputMenssagem'
import { useAtendimentoTicketStore } from '../../store/atendimentoTicket'

import { EventEmitter } from 'events'
import { AudioNotification } from '../../components/AtendimentoComponent/AudioNotification'

export const eventEmitterScrool = new EventEmitter()

interface ChatMensagemProps {
  setReplyingMessage: (any) => void
  menssagens: object
}

export const ChatMensagem = ({
  menssagens,
  setReplyingMessage,
}: ChatMensagemProps) => {
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openStyledMenu, setOpenStyledMenu] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  )

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, id: string) => {
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

  // valores para icone de agendamento
  const [anchorElAgenda, setAnchorElAgenda] = useState(null)
  const [messageAgendamento, setMessageAgendamento] = useState(null)

  const handleMouseEnter = (event, id) => {
    setAnchorElAgenda(event.currentTarget)
    setMessageAgendamento(id)
  }
  const handleMouseLeave = () => {
    setAnchorElAgenda(null) // Fecha o menu ao sair do ícone
    setMessageAgendamento(null)
  }

  // fim dos valores para icone agendamento

  const [anchorEls, setAnchorEls] = useState<
    Record<string, HTMLElement | null>
  >({})
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    mensagemId: string
  ) => {
    setSelectedMessageId(mensagemId)
    setAnchorEls(prev => ({ ...prev, [mensagemId]: event.currentTarget }))
    setOpen(prev => ({ ...prev, [mensagemId]: true }))
  }

  const handlePopoverClose = (mensagemId: string) => {
    setAnchorEls(prev => ({ ...prev, [mensagemId]: null }))
    setOpen(prev => ({ ...prev, [mensagemId]: false }))
    setSelectedMessageId(null)
  }

  const [mensagensParaEncaminhar, setmensagensParaEncaminhar] = useState([])
  const [checkboxStates, setCheckboxStates] = useState<{
    [key: string]: boolean
  }>({})

  // Função para gerenciar a seleção de mensagens
  const handleEerificarEncaminharMensagem = mensagem => {
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
      handleEerificarEncaminharMensagem(mensagem)
      return newCheckboxStates
    })
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      const element = document.getElementById('inicioListaMensagensChat')
      if (element) {
        console.log('Elemento encontrado, rolando para o fim')
        element.scrollIntoView({ behavior: 'smooth' })
      } else {
        console.log('Elemento não encontrado')
      }
    }, 200)
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    console.log('evento scrool')
    // Adiciona o listener ao montar o componente
    eventEmitterScrool.on('scrollToBottomMessageChat', scrollToBottom)
    // Remove o listener ao desmontar o componente
    scrollToBottom()

    return () => {
      eventEmitterScrool.off('scrollToBottomMessageChat', scrollToBottom)
    }
  }, [])

  return (
    <>
      {/* <Box
        id="box-message"
        sx={{
          minHeight: 'calc(-135px + 100vh)',
          height: 'calc(-135px + 100vh)',
          overflowY: 'auto',
          width: '100%',
          position: 'relative',
          contain: 'strict',
          willChange: 'scroll-position',
        }}
      >
        <Box
          id="scrollarea_container"
          sx={{
            scrollbarWidth: 'none',
            display: 'flex',
            width: '100% !important',
            height: '100% !important',
            position: 'relative',
            overflow: 'auto',
            flexDirection: 'column-reverse',
          }}
        >
          <Box
            id="scrollarae-absoulte"
            sx={{
              position: 'absolute',
              minHeight: '100%',
              minWidth: '100%',
            }}
          > */}
      <Box
        id="messages"
        sx={{
          p: 2,
          position: 'relative',
        }}
      >
        <span>
          {menssagens.map((mensagem, index) => (
            <div key={mensagem.id}>
              {index === 0 ||
                (formatarData(mensagem.createdAt) !==
                  formatarData(menssagens[index - 1].createdAt) && (
                  <Divider
                    key={`hr - ${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      index
                    }`}
                  >
                    <Chip
                      label={formatarData(mensagem.createdAt)}
                      size="small"
                    />
                  </Divider>
                ))}
              {menssagens.length && index === menssagens.length - 1 && (
                <Box id="inicioListaMensagensChat" />
              )}

              <Box id={mensagem.id} onMouseLeave={handleMouseLeave} />
              <Box
                sx={{
                  fontWeight: '500',
                  mb: 1,
                }}
              >
                <Box
                  id="message-container"
                  sx={{
                    alignItems: 'flex-end',
                    flexWrap: 'nowrap',
                    flexDirection: mensagem.fromMe && 'row-reverse',
                    display: 'flex',
                    position: 'relative',
                  }}
                >
                  <Box id="aonde estou">
                    <Box
                      sx={{
                        backgroundColor: mensagem.fromMe
                          ? '#f5f5f5'
                          : mode === 'dark'
                            ? '#bbdefb'
                            : '#e3f2fd',
                        color: mode === 'dark' ? '#000' : '#000',
                        minHeight: '48px',

                        padding: '12px 16px',
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
                        onMouseOver={() => setHoveredIndex(mensagem.id)}
                        onMouseLeave={() => handleCloseMenu()}
                      >
                        <div>
                          <Box
                            sx={{
                              minWidth: '100px',
                              maxWidth: '350px',
                              lineHeight: '1.2',
                              wordBreak: 'break-word',

                              // textAlign: mensagem.fromMe ? 'right' : 'left',
                            }}
                          >
                            {/* Ativar o checkbox encaminhar mensagem */}
                            {ativarMultiEncaminhamento &&
                              (mensagem.fromMe ? (
                                <Checkbox
                                  key={mensagem.id}
                                  checked={checkboxStates[mensagem.id] || false}
                                  onChange={() =>
                                    handleCheckboxChange(mensagem)
                                  }
                                  sx={{
                                    position: 'absolute',
                                    left: '-35px',
                                    zIndex: 99999,
                                  }}
                                />
                              ) : (
                                <Checkbox
                                  key={mensagem.id}
                                  checked={checkboxStates[mensagem.id] || false}
                                  onChange={() =>
                                    handleCheckboxChange(mensagem)
                                  }
                                  sx={{
                                    position: 'absolute',
                                    right: '-35px',
                                    zIndex: 99999,
                                  }}
                                />
                              ))}

                            {/* Mostrar mensagens com agendamento */}
                            {mensagem.scheduleDate && (
                              <>
                                {/* <IconButton
                                        sx={{
                                          // Só exibe o botão quando hoveredIndex coincide com a mensagem
                                          position: 'absolute',
                                          zIndex: '99999',
                                          bottom: 0,
                                          left: mensagem.fromMe ? '-8px' : 'none',
                                          right: mensagem.fromMe ? 'none' : '0',
                                          padding: '0px', // Remove o espaçamento extra em torno do ícone
                                          fontSize: '16px', // Ajusta o tamanho do ícone
                                          color: '#000 !important', // Cor do ícone
                                          backgroundColor:
                                            'transparent !important', // Remove qualquer fundo indesejado
                                          borderRadius: '50%', // Deixa o ícone circular
                                          border: 'none',
                                        }}
                                      // onMouseEnter={(event) => handleMouseEnter(event, mensagem.id)}
                                      // onMouseEnter={(event) => handleOpenMenu(event, mensagem.id)}
                                      // onMouseLeave={() => handlePopoverClose(mensagem.id)}
                                      >
                                        <ArrowDownward
                                          sx={{
                                            fontSize: '20px',
                                            color: 'rgba(0, 0, 0, 0.45)',
                                          }}
                                        />
                                      </IconButton>
                                      {messageAgendamento === mensagem.id && anchorElAgenda && (
                                        <Menu
                                          anchorEl={anchorElAgenda} // Usando o ícone como âncora
                                          open={Boolean(anchorElAgenda)}
                                          onMouseLeave={handleMouseLeave}
                                          onClose={handleMouseLeave}
                                          anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                          }}
                                          transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                          }}
                                        >
                                          <MenuItem>Opção 1</MenuItem>
                                          <MenuItem>Opção 2</MenuItem>
                                        </Menu>
                                      )} */}
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
                                mensagem={mensagem.quotedMsg}
                              />
                            )}
                            {/* ATIVAR ENCAMINHAMENTO E RESPONDER */}
                            {!mensagem.isDeleted && (
                              <>
                                <IconButton
                                  sx={{
                                    display:
                                      hoveredIndex === mensagem.id
                                        ? 'block'
                                        : 'none', // Só exibe o botão quando hoveredIndex coincide com a mensagem
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
                                    border: 'none',
                                  }}
                                  onClick={event =>
                                    handleOpenMenu(event, mensagem.id)
                                  }
                                >
                                  <ArrowDownward
                                    sx={{
                                      fontSize: '20px',
                                      color: 'rgba(0, 0, 0, 0.45)',
                                    }}
                                  />
                                </IconButton>
                                {selectedMessageId === mensagem.id &&
                                  anchorEl &&
                                  openStyledMenu && (
                                    <Menu
                                      anchorEl={anchorEl} // Usando o ícone como âncora
                                      open={openStyledMenu}
                                      onClose={handleCloseMenu}
                                      anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: mensagem.fromMe ? -200 : 45,
                                      }}
                                    >
                                      <MenuItem
                                        onClick={() =>
                                          setReplyingMessage(mensagem)
                                        }
                                      >
                                        Responder
                                      </MenuItem>
                                      <MenuItem>Encaminhar</MenuItem>
                                      <MenuItem>
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
                            {/* AUDIO */}
                            {mensagem.mediaType === 'audio' &&
                              mensagem.mediaUrl && (
                                <Box sx={{ width: 330, height: '100%' }}>
                                  {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
                                  <audio
                                    style={{ width: '100%' }}
                                    controls
                                    controlsList="download playbackrate volume"
                                  >
                                    <source
                                      src={mensagem.mediaUrl}
                                      type="audio/ogg"
                                    />
                                  </audio>
                                </Box>
                              )}
                            {['vcard', 'contactMessage'].includes(
                              mensagem.mediaType
                            ) && (
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
                            {['location', 'locationMessage'].includes(
                              mensagem.mediaType
                            ) &&
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
                                  image={mensagem.mediaUrl}
                                />
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
                                  __html: formatarNotas(
                                    DOMPurify.sanitize(mensagem.body)
                                  ),
                                }}
                              />
                            )}
                            {mensagem.mediaType === 'templates' && (
                              <Box
                                dangerouslySetInnerHTML={{
                                  __html: formatarTemplates(
                                    DOMPurify.sanitize(mensagem.body)
                                  ),
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
                              mensagem.mediaUrl && (
                                <Box sx={{ mt: '20px' }}>Criar Iframe</Box>
                              )}
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
                                    padding: ' 12px 0 8px 0',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
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
                                        sx={{
                                          fontSize: '12px',
                                          color: 'rgba(0, 0, 0, 0.45)',
                                        }}
                                      >
                                        {dataInWords(mensagem.createdAt)}
                                      </Typography>
                                      <DoneAll
                                        sx={{
                                          fontSize: '16px',
                                          color: 'rgba(0, 0, 0, 0.45)',
                                        }}
                                      />
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
      <div id="inicioListaMensagensChat" />
      {/* </Box>
        </Box>
      </Box> */}
    </>
  )
}
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
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
        // marginRight: theme.spacing(1.5),
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
