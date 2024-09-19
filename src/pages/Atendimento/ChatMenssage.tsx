import { Avatar, Box, Button, Checkbox, Chip, Divider, Icon, IconButton, Tooltip, Typography, useColorScheme } from "@mui/material"
import { formatarData, formatarMensagemWhatsapp } from "../../utils/helpers"
import { ArrowDownward, CalendarMonth, DoneAll } from "@mui/icons-material"
import { dataInWords, formatarBotaoWhatsapp, formatarMensagemDeLista, formatarMensagemRespostaBotaoWhatsapp, formatarNotas, formatarTemplates } from "./mixinCommon"

import DOMPurify from 'dompurify';

export const ChatMensagem = ({ menssagens }) => {
    const { mode } = useColorScheme()
    const ativarMultiEncaminhamento = false
    const ticketFocado = { isGroup: false }
    const isShowOptions = false
    const isGroupLabel = (mensagem) => {
        try {
            return ticketFocado.isGroup ? mensagem.contact.name : ''
        } catch (error) {
            return ''
        }
    }
    const getAudioSource = (url) => {
        try {
            const newUrl = url.replace('.ogg', '.mp3');
            return newUrl;
        } catch (error) {
            return url;
        }
    }
    const openLinkInNewPage = (url) => {
        window.open(url, '_blank');
    }
    return (<Box sx={{ padding: 2 }}>
        {menssagens.map(((mensagem, index) => (
            <div key={mensagem.id}>

                {index === 0 || formatarData(mensagem.createdAt) !== formatarData(menssagens[index - 1].createdAt) && (
                    <Divider >
                        <Chip label={formatarData(mensagem.createdAt)} size="small" /></Divider>
                )}

                {menssagens.length && index === menssagens.length - 1 && (
                    // biome-ignore lint/style/useSelfClosingElements: <explanation>
                    <Box style={{ background: 'black' }}></Box>
                )}
                <div key={`chat-message-${mensagem.id}`} id={`chat-message-${mensagem.id}`} />
                <Box
                    id={`chat-message-${mensagem.id}`}

                    sx={{

                        mb: 1,
                        width: '100%',
                        minWidth: '100px',
                        maxWidth: '350px',
                        ml: mensagem.fromMe && 'auto',
                        mr: !mensagem.fromMe ? 'auto' : 0,
                        textAlign: mensagem.fromMe ? 'right' : 'left',

                    }}>
                    {ativarMultiEncaminhamento && (
                        <Checkbox />
                    )}
                    {mensagem.scheduleDate && (
                        <Tooltip title='Mensagem agendada'>

                            <Icon style={{ width: 8, height: 8 }}
                                sx={{
                                    color: mensagem.scheduleDate && mensagem.status === 'pending' ? 'green' :
                                        !['pending', 'canceled'].includes(mensagem.status) ? 'blue' : ''
                                }}>

                                <CalendarMonth />
                            </Icon>
                        </Tooltip>
                    )}
                    {mensagem.isDeleted && (
                        <Typography variant="body2">Menssagem apagada em {formatarData(mensagem.updatedAt, 'dd/MM/yyyy')}</Typography>
                    )}
                    {isGroupLabel(mensagem) && (
                        <Typography variant="body2">{isGroupLabel(mensagem)}</Typography>
                    )}
                    {mensagem.quotedMsg && (
                        <Typography variant="body2">MENSSAGEM RESPONDIDA COMPONENT</Typography>
                    )}
                    {!mensagem.isDeleted && isShowOptions && (
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
                          <IconButton sx={{

                              color: '#000', // Cor do ícone
                              borderColor: 'transparent !important',
                              backgroundColor: 'transparent !important', // Remove qualquer fundo indesejado
                              borderRadius: '50%', // Deixa o ícone circular
                          }}>

                              <ArrowDownward sx={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.45)' }} />
                          </IconButton>
                      </Box>
                    )}

                    {mensagem.mediaType === 'audio' && mensagem.mediaUrl && (
                        <Box>
                            {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
                            <audio
                                controls
                                ref="audioMessage"
                                controlsList="download playbackrate volume"
                            >
                                <source src={getAudioSource(mensagem.mediaUrl)} type="audio/mp3" />
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

                    {['location', 'locationMessage'].includes(mensagem.mediaType) && (

                        // CRIAR MODAL ABRIR MAPs
                        openLinkInNewPage(mensagem.body)

                    )}
                    {(mensagem.mediaType === 'imageMessage' || (mensagem.mediaType === 'image' && !mensagem.mediaUrl.includes('.webp'))) && !mensagem.isSticker && (
                        <span>Criar modal</span>
                    )}
                    {mensagem.mediaType === 'image' && mensagem.mediaUrl.includes('.webp') && (
                        <span>Criar modal</span>
                    )}
                    {mensagem.mediaType === 'image' && !mensagem.mediaUrl.includes('.webp') && mensagem.isSticker && (
                        <span>Criar modal</span>
                    )}
                    {mensagem.mediaType === 'video' || mensagem.mediaType === 'videoMessage' && (
                        // biome-ignore lint/a11y/useMediaCaption: <explanation>
                        <video
                            controls
                            src={mensagem.mediaUrl}
                            style={{ objectFit: 'cover', width: 330, height: 15, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
                        />
                    )}
                    {mensagem.mediaType === 'interactive' && (
                        formatarMensagemRespostaBotaoWhatsapp(DOMPurify.sanitize(mensagem.body))
                    )}
                    {mensagem.mediaType === 'button' && (
                        formatarBotaoWhatsapp(mensagem.body)
                    )}
                    {mensagem.mediaType === 'list' && (
                        formatarMensagemDeLista(mensagem.body)
                    )}
                    {mensagem.mediaType === 'notes' && (
                        formatarNotas(mensagem.body)
                    )}
                    {mensagem.mediaType === 'templates' && (
                        formatarTemplates(mensagem.body)
                    )}
                    {!['audio', 'vcard', 'contactMessage', 'locationMessage', 'image', 'imageMessage', 'video', 'videoMessage', 'sticker', 'location', 'interactive', 'button', 'list', 'button_reply', 'sticker', 'notes', 'transcription'].includes(mensagem.mediaType) && mensagem.mediaUrl && (
                        <Box sx={{ mt: '20px' }}>
                            Criar Iframe
                        </Box>
                    )}
                    {['image', 'video', 'imageMessage', 'videoMessage'].includes(mensagem.mediaType) && mensagem.mediaUrl && (
                        <Box sx={{ mt: '20px' }}>
                            Criar Funcao para donwload
                        </Box>
                    )}
                    {!['vcard', 'contactMessage', 'application', 'audio', 'button', 'list', 'location', 'locationMessage', 'interactive', 'button_reply', 'sticker', 'notes', 'templates', 'transcription'].includes(mensagem.mediaType) && (
                        <>
                            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
                            <Box
                                //  dangerouslySetInnerHTML={{ __html: formatarMensagemWhatsapp(DOMPurify.sanitize(mensagem.body)) }}
                                sx={{
                                    mt: '2px',
                                    minHeight: '48px',
                                    position: 'relative',
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    display: 'inline-block',
                                    backgroundColor: mensagem.fromMe ? '#f5f5f5' : mode === 'dark' ? '#bbdefb' : '#e3f2fd',
                                    color: mode === 'dark' ? '#000' : '#000'

                                }} >
                                <Box sx={{ textAlign: 'center', wordWrap: 'break-word' }}>
                                    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
                                    <span dangerouslySetInnerHTML={{ __html: formatarMensagemWhatsapp(DOMPurify.sanitize(mensagem.body)) }} />
                                </Box>
                                {mensagem.fromMe ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: '4px' }}>
                                         <Typography variant="caption"  sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>{dataInWords(mensagem.createdAt)}</Typography>
                                        <DoneAll sx={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.45)' }} />
                                    </Box>
                                 ) : (
                                    <Typography variant="caption"  sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>{dataInWords(mensagem.createdAt)}</Typography>
                                 )
                                
                                }
                            </Box>
                        </>
                    )}
                </Box>
            </div>
        )))}
    </Box>)
}