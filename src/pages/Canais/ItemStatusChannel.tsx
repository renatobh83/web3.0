import {

	Avatar,
	Box,
	Typography,
} from "@mui/material";
import { formatarData } from "../../utils/helpers";
import SignalWifi1BarIcon from '@mui/icons-material/SignalWifi1Bar';
import SignalWifi0BarIcon from '@mui/icons-material/SignalWifi0Bar';
import SignalWifi2BarIcon from '@mui/icons-material/SignalWifi2Bar';
import SignalWifi4BarIcon from '@mui/icons-material/SignalWifi4Bar';
interface ItemStatusChannelProps {
	item: {
		status: string;
		type: string;
		number: string;
		phone: any;
		profilePic: string;
		updatedAt: string;
	};
}



export const ItemStatusChannel = ({ item }: ItemStatusChannelProps) => (
	<>
		<Box
			id="itemStatus"
			sx={{
				display: "flex",
				gap: 2,
				alignItems: "center",
				minHeight: 106
			}}
		>
			<Box sx={{ maxWidth: 100 }}>
				{item.status === 'qrcode' && (
					<Avatar ><SignalWifi1BarIcon /></Avatar>
				)}
				{item.status === 'DISCONNECTED' && (
					<Avatar ><SignalWifi0BarIcon /></Avatar>
				)}
				{item.status === 'CONNECTED' && (
					<Avatar ><SignalWifi4BarIcon /></Avatar>
				)}
				{item.status === 'OPENING' && (
					<SignalWifi2BarIcon />
				)}
			</Box>
			<Box>
				{item.status === "qrcode" && (
					<Box sx={{ flexGrow: 1 }}>
						<Typography sx={{ wordWrap: "break-word", flexGrow: 1 }}>
							Esperando leitura do QR Code
						</Typography>

						<Typography sx={{ wordWrap: "break-word", flexGrow: 1 }}>
							{" "}
							Clique no botão 'QR CODE' e leia o QR Code com o seu celular para
							iniciar a sessão
						</Typography>
					</Box>
				)}

				{item.status === "DISCONNECTED" && (
					<Box sx={{ flexGrow: 1 }}>
						<Typography sx={{ wordWrap: "break-word", flexGrow: 1 }}>
							Falha ao iniciar comunicação para este canal.
						</Typography>
						{item.type === "whatsapp" && (
							<Typography sx={{ wordWrap: "break-word", flexGrow: 1 }}>
								Certifique-se de que seu celular esteja conectado à internet e
								tente novamente, ou solicite um novo QR Code
							</Typography>
						)}
						{item.type === "waba" && (
							<Typography sx={{ wordWrap: "break-word", flexGrow: 1 }}>
								Tente conectar novamente. Caso o erro permaneça, confirme se os tokens estão
								corretos.
							</Typography>
						)}
						{item.type === "telegram" && (
							<Typography sx={{ wordWrap: "break-word", flexGrow: 1 }}>
								Tente conectar novamente. Caso o erro permaneça, confirme se o token está
								correto.
							</Typography>
						)}
						{item.type === "instagram" && (
							<Typography sx={{ wordWrap: "break-word", flexGrow: 1 }}>
								Tente conectar novamente. Caso o erro permaneça, confirme se as
								credenciais estão corretas.
							</Typography>
						)}
					</Box>
				)}
				{item.status === "CONNECTED" && item.type === "whatsapp" && (
					<Box sx={{ flexGrow: 1 }}>
						<Typography sx={{ wordWrap: "break-word", flexGrow: 1 }}>
							Conexão estabelecida:
						</Typography>
						{item.number && <span>{item.number}</span>}
					</Box>
				)}
				{item.status === "CONNECTED" && item.type === "whatsapp" && (
					<Box sx={{ flexGrow: 1 }}>
						<Typography sx={{ wordWrap: "break-word", flexGrow: 1 }}>
							{item.phone.pushname || item.phone.name || item.phone.phone}
						</Typography>
					</Box>
				)}
				<Typography variant="caption">
					{" "}
					Última Atualização: {formatarData(item.updatedAt, "dd/MM/yyyy HH:mm")}
				</Typography>
			</Box>

		</Box>
	</>
);
