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
import { useState } from 'react'

export const ChatMensagem = ({ menssagens }) => {
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { mode } = useColorScheme()
  const ativarMultiEncaminhamento = false
  const ticketFocado = { isGroup: false }
  const isShowOptions = false
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
  return (
    <Box sx={{ padding: 2, position: 'relative' }}>
      {menssagens.map((mensagem, index) => (
        <div key={mensagem.id}>
          {index === 0 ||
            (formatarData(mensagem.createdAt) !==
              formatarData(menssagens[index - 1].createdAt) && (
              <Divider>
                <Chip label={formatarData(mensagem.createdAt)} size="small" />
              </Divider>
            ))}

          {menssagens.length && index === menssagens.length - 1 && (
            // biome-ignore lint/style/useSelfClosingElements: <explanation>
            <Box style={{ background: 'black' }}></Box>
          )}
          <div
            key={`chat-message-${mensagem.id}`}
            id={`chat-message-${mensagem.id}`}
          />
          <Box
            id={`chat-message-${mensagem.id}`}
            sx={{
              mb: 1,
              width: '100%',
              maxWidth: '350px',
              ml: mensagem.fromMe ? 'auto' : 0,
              mr: !mensagem.fromMe ? 'auto' : 0,
              textAlign: mensagem.fromMe ? 'right' : 'left',
            }}
          >
            {ativarMultiEncaminhamento && <Checkbox />}
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
              <Typography variant="body2">
                MENSSAGEM RESPONDIDA COMPONENT
              </Typography>
            )}
            {!mensagem.isDeleted && isShowOptions && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  position: 'relative',
                }}
              >
                <IconButton
                  sx={{
                    color: '#000', // Cor do ícone
                    borderColor: 'transparent !important',
                    backgroundColor: 'transparent !important', // Remove qualquer fundo indesejado
                    borderRadius: '50%', // Deixa o ícone circular
                  }}
                >
                  <ArrowDownward
                    sx={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.45)' }}
                  />
                </IconButton>
              </Box>
            )}

            {mensagem.mediaUrl}
            {mensagem.mediaType === 'audio' && mensagem.mediaUrl && (
              <Box>
                {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
                <audio
                  controls
                  controlsList="nodownload noplaybackrate volume novolume"
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
              // CRIAR VIEW IMAGEM e Modal imagem
              <Avatar />
            )}

            {['location', 'locationMessage'].includes(mensagem.mediaType) &&
              // CRIAR MODAL ABRIR MAPs
              openLinkInNewPage(mensagem.body)}
            {/* 
            {(mensagem.mediaType === 'imageMessage' ||
              (mensagem.mediaType === 'image' &&
                !mensagem.mediaUrl.includes('.webp'))) &&
              !mensagem.isSticker && (
                <>{mensagem.mediaUrl}</>
                // <CardMedia
                //   onClick={() => {
                //     setModalImageUrl(mensagem.mediaUrl || null)
                //     setModalOpen(true)
                //   }}
                //   component="img"
                //   height="194"
                //   // image={mensagem.mediaUrl}
                //   alt={mensagem.id}
                // />
              )} */}
            {/* {mensagem.mediaType === 'image' &&
              mensagem.mediaUrl.includes('.webp') && (
                <CardMedia
                  onClick={() => {
                    setModalImageUrl(mensagem.mediaUrl || null)
                    setModalOpen(true)
                  }}
                  component="img"
                  height="194"
                  // image={mensagem.mediaUrl}
                  alt="Paella dish"
                />
              )} */}
            {mensagem.mediaType === 'image' &&
              !mensagem.mediaUrl.includes('.webp') &&
              mensagem.isSticker && (
                <CardMedia
                  onClick={() => {
                    setModalImageUrl(mensagem.mediaUrl || null)
                    setModalOpen(true)
                  }}
                  component="img"
                  height="194"
                  // image={mensagem.mediaUrl}
                  alt="Paella dish"
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

            {['image', 'video', 'imageMessage', 'videoMessage'].includes(
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
                    height="194"
                    image={mensagem.mediaUrl}
                    alt="Paella dish"
                  />
                </Box>
              )}
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
              'image',
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
                    backgroundColor: mensagem.fromMe
                      ? '#f5f5f5'
                      : mode === 'dark'
                        ? '#bbdefb'
                        : '#e3f2fd',
                    color: mode === 'dark' ? '#000' : '#000',
                  }}
                >
                  <IconButton
                    onClick={() => alert('OpenMenu')}
                    sx={{
                      border: 'none',
                      position: 'absolute',
                      top: '-10px',
                      right: '-9px',
                      padding: '0px', // Remove o espaçamento extra em torno do ícone
                      fontSize: '16px', // Ajusta o tamanho do ícone
                      color: '#000 !important', // Cor do ícone
                      backgroundColor: 'transparent !important', // Remove qualquer fundo indesejado
                      borderRadius: '50%', // Deixa o ícone circular
                    }}
                  >
                    <PlayForWorkIcon
                      sx={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.45)' }}
                    />
                  </IconButton>

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
