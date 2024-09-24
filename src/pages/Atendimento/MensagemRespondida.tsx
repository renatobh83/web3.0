import { ArrowDownward, DoneAll } from "@mui/icons-material"
import { Avatar, Box, Button, CardMedia, IconButton, List, ListItem, ListItemButton, Typography, useColorScheme } from "@mui/material"
import DOMPurify from "dompurify"
import { formatarData, formatarMensagemRespostaBotaoWhatsapp, formatarBotaoWhatsapp, formatarMensagemDeLista, formatarNotas, formatarTemplates, formatarMensagemWhatsapp, dataInWords } from "./mixinCommon"
import PlayForWorkIcon from '@mui/icons-material/PlayForWork'
export const MensagemRespondida = ({ mensagem }) => {
    const { mode } = useColorScheme()
    return (
        <Box sx={{
            p: 0,
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Box
                id="chat-message-resp"
                key={mensagem.id}
                sx={{
                    mb: 1,
                    width: '100%',
                    minWidth: '100px',
                    maxWidth: '350px',
                    ml: mensagem.fromMe ? 'auto' : 0,
                    mr: !mensagem.fromMe ? 'auto' : 0,
                    textAlign: mensagem.fromMe ? 'right' : 'left',

                }}
            >

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
                            {/* <CardMedia
                                onClick={() => {
                                    setModalImageUrl(mensagem.mediaUrl || null)
                                    setModalOpen(true)
                                }}
                                component="img"
                                height="194"
                                image={mensagem.mediaUrl}
                                alt="Paella dish"
                            /> */}
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
                                    maxWidth: '100%',
                                    minHeight: '60px',
                                    position: 'relative',
                                    padding: '12px 16px',
                                    display: 'inline-block',
                                }}
                            >


                                <Box sx={{
                                    wordWrap: 'break-word',
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "100%",
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 2, // Limita o texto a 3 linhas

                                }}>
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

        </Box>
    )
}