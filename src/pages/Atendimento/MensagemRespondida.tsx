import { Box, CardMedia, Typography } from '@mui/material'
import { formatarData } from './mixinCommon'
import { useAtendimentoTicketStore } from '../../store/atendimentoTicket'
import { formatarMensagemWhatsapp } from '../../utils/helpers'

export const MensagemRespondida = ({ mensagem }) => {
  //   const { mode } = useColorScheme()
  const { ticketFocado } = useAtendimentoTicketStore()
  const isGroupLabel = mensagem => {
    try {
      return ticketFocado?.isGroup
        ? mensagem.contact.name
        : ''
    } catch (error) {
      return ''
    }
  }
  return (
    <Box id="textContentItem">
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'nowrap',
          minHeight: '32px',
          maxHeight: '150px',
          mt: 2,
          mb: 1,
        }}
      >
        <Box
          sx={{
            minWidth: '100px',
            maxWidth: '350px',
          }}
        >
          <Box
            id="mensssagemRespondida"
            sx={{
              borderRadius: '10px',
              minHeight: '48px',
              p: 1,
              position: 'relative',
              borderLeft: mensagem.fromMe
                ? '5px solid #a5d6a7'
                : '5px solid #2196f3',
            }}
          >
            <Box
              sx={{
                wordBreak: 'break-word',
                width: '100%',
                mx: '0 !important',
              }}
            >
              {mensagem.isDeleted && (
                <Typography>
                  Mensagem apagada em{' '}
                  {formatarData(mensagem.updatedAt, 'dd/MM/yyyy')}.
                </Typography>
              )}
              {isGroupLabel(mensagem) && <Box>{isGroupLabel(mensagem)}</Box>}
              {!isGroupLabel(mensagem) && !mensagem.fromMe && (
                <Typography variant="caption">
                  {' '}
                  {mensagem.contact?.name}
                </Typography>
              )}
              {mensagem.mediaType === 'audio' && (
                <Box
                  sx={{
                    width: '200px',
                  }}
                >
                  {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
                  <audio
                    style={{ maxWidth: 200 }}
                    controls
                    controlsList="download playbackrate volume"
                  >
                    <source src={mensagem.mediaUrl} type="audio/ogg" />
                  </audio>
                </Box>
              )}
              {mensagem.mediaType === 'image' && (
                <CardMedia
                  sx={{ overflow: 'hidden' }}
                  component="img"
                  height="60px"
                  width="130px"
                  image={mensagem.mediaUrl}
                />
              )}
              {mensagem.mediaType === 'video' && (
                <Box>
                  {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
                  <video
                    controls
                    src={mensagem.mediaUrl}
                    style={{
                      // objectFit: 'cover',
                      width: 130,
                      height: 60,
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8,
                    }}
                  />
                </Box>
              )}
              {![
                'vcard',
                'contactMessage',
                'application',
                'audio',
                'image',
                'video',
              ].includes(mensagem.mediaType) && (
                  <Typography>
                    {formatarMensagemWhatsapp(mensagem.body)}
                  </Typography>
                )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
