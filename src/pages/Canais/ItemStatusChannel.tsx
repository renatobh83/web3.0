import {
	Avatar,
	Box,
	List,
	ListItem,
	ListItemText,
	Stack,
	Typography,
} from "@mui/material";
import { formatarData } from "../../utils/helpers";

interface ItemStatusChannelProps {
	item: {
		status: string;
		type: string;
		profilePic: string;
		updatedAt: string;
	};
}
type StatusMessageProps = {
	msg: string;
};

const StatusMessage = ({ msg }: StatusMessageProps) => {
	return (
		<>
			<Box sx={{ maxWidth: 100 }}>
				<Avatar />
			</Box>
			<Box sx={{ flexGrow: 1 }}>
				<Typography sx={{ wordWrap: "break-word", flexGrow: 1 }}>
					{msg}
				</Typography>
				<Typography sx={{ wordWrap: "break-word", flexGrow: 1 }}>
					{msg}
				</Typography>
				<Typography sx={{ wordWrap: "break-word", flexGrow: 1 }}>
					{msg}
				</Typography>
			</Box>
		</>
	);
};

export const ItemStatusChannel = ({ item }: ItemStatusChannelProps) => (
	<>
		<Stack
			direction="column"
			sx={{
				alignItems: "center",
			}}
		>
			<Stack
				direction="row"
				sx={{
					justifyContent: "space-between",
					gap: 2,
					alignItems: "center",
				}}
			>
				<Box sx={{ maxWidth: 100 }}>
					<Avatar />
				</Box>
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
					</Box>
				)}
				{item.status === "CONNECTED" && item.type === "whatsapp" && (
					<Box sx={{ flexGrow: 1 }}>
						<Typography sx={{ wordWrap: "break-word", flexGrow: 1 }}>
							Conexão estabelecida:
						</Typography>
					</Box>
				)}
				{item.status === "CONNECTED" && item.type === "whatsapp" && (
					<Box sx={{ flexGrow: 1 }}>
						<Typography sx={{ wordWrap: "break-word", flexGrow: 1 }}>
							Conexão estabelecida:
						</Typography>
					</Box>
				)}
			</Stack>
			<Typography variant="caption">
				{" "}
				Última Atualização: {formatarData(item.updatedAt, "dd/MM/yyyy HH:mm")}
			</Typography>
		</Stack>
	</>
);
