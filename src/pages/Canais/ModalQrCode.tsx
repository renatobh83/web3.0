import { Close, X } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  Dialog,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import { QRCodeSVG } from 'qrcode.react'
interface ModalQrCodeProps {
  isOpen: boolean
  onClose: () => void
  channel: any
  onGenerateNewQrCode: (any, string) => void
}

export const ModalQrCode = ({
  isOpen,
  onClose,
  channel,
  onGenerateNewQrCode,
}: ModalQrCodeProps) => {
  const theme = useTheme() // Para verificar o modo escuro

  const handleGenerateNewQrCode = () => {
    onGenerateNewQrCode(channel, 'btn-qrCode')
    onClose()
    setTimeout(() => {
      // window.location.reload()
    }, 1000)
  }
  function solicitarQrCode() {
    // this.$emit('gerar-novo-qrcode', this.channel)
    // setModalQrCode(false)
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
  return (
    <Dialog open={isOpen}>
      <Card className="p-6 bg-white">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 'semibold',
          }}
        >
          Leia o QrCode para iniciar a sessão
          <Button onClick={() => onClose()}>
            <Close />
          </Button>
        </Box>

        <Box
          sx={{ textAlign: 'center' }}
          // className={clsx('text-center my-6', {
          //     'bg-white': theme.palette.mode === 'dark',
          // })}
        >
          {channel.qrcode ? (
            <QRCodeSVG value={channel.qrcode} size={300} level="H" />
          ) : (
            <p>Aguardando o Qr Code...</p>
          )}
          {channel.wppPass && <p>Código de Pareamento: {channel.wppPass}</p>}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography>
            Caso tenha problema com a leitura, solicite um novo Qr Code
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Close />}
              onClick={handleGenerateNewQrCode}
            >
              Novo QR Code
            </Button>
          </Box>
        </Box>
      </Card>
    </Dialog>
  )
}
