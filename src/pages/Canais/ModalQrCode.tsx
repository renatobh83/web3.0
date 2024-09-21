import { Close, X } from "@mui/icons-material";
import { Box, Button, Card, Dialog, IconButton, useTheme } from "@mui/material";
import {QRCodeSVG} from 'qrcode.react';
interface ModalQrCodeProps {
    isOpen: boolean
    onClose: () => void
}

export const ModalQrCode = ({ isOpen, onClose}: ModalQrCodeProps) => {
	const theme = useTheme(); // Para verificar o modo escuro

	const handleGenerateNewQrCode = () => {
		// onGenerateNewQrCode(channel);
		// onClose();
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	};
    function solicitarQrCode () {
		// this.$emit('gerar-novo-qrcode', this.channel)
		// setModalQrCode(false)
		setTimeout(() => {
		  window.location.reload();
		}, 1000);
	  }
	return (
		<Dialog open={isOpen}>
			<Card className="p-6 bg-white">
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						fontWeight: "semibold",
					}}
				>
					Leia o QrCode para iniciar a sessão
					<Button onClick={()=>onClose()}>
						{" "}
						<Close />
					</Button>
				</Box>

				<div
				// className={clsx('text-center my-6', {
				//     'bg-white': theme.palette.mode === 'dark',
				// })}
				>
					{channel.qrcode ? (
                        <QRCodeSVG value={channel.qrcode} size={300} level="H" />
                    ) : (
                        <p>Aguardando o Qr Code...</p>
                    )}
					{/* {channel.wppPass && <p>Código de Pareamento: {channel.wppPass}</p>} */}
				</div>
				<div className="mt-4">
					<p className="text-center">
						Caso tenha problema com a leitura, solicite um novo Qr Code
					</p>
					<div className="flex justify-center mt-4">
						<Button
							variant="outlined"
							color="primary"
							startIcon={<Close />}
							// onClick={handleGenerateNewQrCode}
						>
							Novo QR Code
						</Button>
					</div>
				</div>
			</Card>
		</Dialog>
	);
};
