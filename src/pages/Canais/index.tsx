import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	IconButton,
	MenuItem,
	Select,
	Stack,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useWhatsappStore } from "../../store/whatsapp";
import { ItemStatusChannel } from "./ItemStatusChannel";
import { useCallback, useEffect, useState } from "react";
import { ListarChatFlow } from "../../services/chatflow";
import { Clear, PlusOne } from "@mui/icons-material";
import { UpdateWhatsapp } from "../../services/sessoesWhatsapp";
import { toast } from "sonner";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { ModalWhatsapp } from "./ModalWhatsapp";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ModalQrCode } from "./ModalQrCode";



export const Canais = () => {
	
	
	const [chatflows, setChatflows] = useState([]);
	const [selectedChatBots, setSelectedChatBots] = useState({});
	const data = useWhatsappStore((s) => s.whatsApps);
	const userProfile = localStorage.getItem("profile");
	const [whatsappSelecionado, setWhatsappSelecionado] = useState({});
	const [modalWhatsapp, setModalWhatsapp] = useState(false);
	const [modalQrCode, setModalQrCode] = useState(false);
	const [loading, setLoading] = useState(false)

	const isAdmin = true;
	// Função para lidar com a mudança de seleção

	const handleChange = (whatsapp, event) => {
		// Atualiza o valor apenas para o card correspondente ao id
		setSelectedChatBots((prev) => ({
			...prev,
			[whatsapp.id]: event.target.value,
		}));
		const form = {
			...whatsapp,
			chatFlowId: event.target.value,
		};

		UpdateWhatsapp(whatsapp.id, form).then((data) => {
			if (data.status === 200) {
				toast.success(
					`Whatsapp ${whatsapp.id ? "editado" : "criado"} com sucesso!`,
					{
						position: "top-center",
					},
				);
			}
		});
	};
	const listChatFlow = useCallback(async () => {
		const { data } = await ListarChatFlow();
		
		setChatflows(data.chatFlow);
	}, [data]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		listChatFlow();
	}, []);

	// Preenche o estado inicial com base no item.chatFlowId
	useEffect(() => {
		const defaultValues = {};
		// biome-ignore lint/complexity/noForEach: <explanation>
		data.forEach((item) => {
			defaultValues[item.id] = item.chatFlowId || ""; // Usa o valor do item ou vazio
		});
		setSelectedChatBots(defaultValues);
	}, [data]);

	const handleOpenQrModal = (channel) => {
		setWhatsappSelecionado(channel);
		setModalQrCode(true)
	};

	const handleCloseQrModal = () => {
		setModalQrCode(false)
	}
	const handleClearSelection = async (whatsapp) => {
		// Define o valor como '' (vazio) para remover a seleção
		setSelectedChatBots((prev) => ({
			...prev,
			[whatsapp.id]: "",
		}));
		const form = {
			...whatsapp,
			chatFlowId: null,
		};
		UpdateWhatsapp(whatsapp.id, form).then((data) => {
			if (data.status === 200) {
				toast.success(
					`Whatsapp ${whatsapp.id ? "editado" : "criado"} com sucesso!`,
					{
						position: "top-center",
					},
				);
			}
		});
	};
	async function handleRequestNewQrCode (channel, origem) {
		if (channel.type === 'telegram' && !channel.tokenTelegram) {
		  toast.error('Necessário informar o token para Telegram',{
			position:'top-center'
		  })
		}
		console.log(channel, origem)
		setLoading(true)
		try {
		//   await RequestNewQrCode({ id: channel.id, isQrcode: true })
		  setTimeout(() => {
			handleOpenQrModal(channel)
		  }, 2000)
		} catch (error) {
		  console.error(error)
		} 
		setLoading(false)
		setTimeout(() => {
		//   window.location.reload();
		}, 1000);
	  }

	const handleOpenModalWhatsapp = () => {
		setModalWhatsapp(true);
	};
	const handleClosenModalWhatsapp = () => {
		setModalWhatsapp(false);
	};

	return (
		<>
			{userProfile === "admin" && (
				<Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<Typography component="h2" variant="h6" sx={{ mb: 2 }}>
							Canais de Comunicação
						</Typography>
						<Box>
							<Button variant="outlined" onClick={handleOpenModalWhatsapp}>
								<AddTaskIcon />
								Adicionar{" "}
							</Button>
						</Box>
					</Box>
					<Grid
						container
						spacing={2}
						columns={12}
						sx={{ mb: (theme) => theme.spacing(2) }}
					 >
						{data.map((item) => (
							<Grid key={item.id} size={{ xs: 12, sm: 6, lg: 3 }}>
								<Card
									variant="outlined"
									sx={{ height: "100%", flexGrow: 1 }}
									id="card"
								>
									<CardContent>
										<Box sx={{ display: "flex", gap: 2 }}>
											<Avatar />
											<Box sx={{ display: "flex", flexDirection: "column" }}>
												<Typography
													component="h2"
													variant="subtitle2"
													gutterBottom
												>
													{item.name}
												</Typography>
												<Typography variant="caption">{item.type}</Typography>
											</Box>
										</Box>
										<Divider sx={{ my: 2 }} />
										<Stack
											id="stack"
											direction="column"
											sx={{
												justifyContent: "space-between",
												flexGrow: "1",
												gap: 1,
												minHeight: 160,
											}}
										>
											<ItemStatusChannel item={item} />
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													gap: 1,
													justifyContent: "space-between",
												}}
											>
												<Select
													sx={{ flexGrow: 1 }}
													value={selectedChatBots[item.id] || ""}
													onChange={(e) => handleChange(item, e)}
													label="ChatBot"
												>
													{chatflows?.map((chatflow) => (
														<MenuItem value={chatflow.id} key={chatflow.id}>
															{chatflow.name}
														</MenuItem>
													))}
												</Select>
												{/* Botão de limpar seleção */}
												{selectedChatBots[item.id] && (
													<IconButton
														onClick={() => handleClearSelection(item)}
														size="small"
													>
														<Clear />
													</IconButton>
												)}
											</Box>
										</Stack>
										<Divider sx={{ my: 2 }} />
										{item.type === "whatsapp" && item.status !== "qrcode" && (
											<Button
												onClick={() => handleOpenQrModal(item)}
												disabled={!isAdmin}
											>
												QR Code
											</Button>
										)}
										{item.status === "DISCONNECTED" &&
											(item.type === "whatsapp" &&
											item.type === "baileys" &&
											item.status === "qrcode" ? (
												<Button>Conectar</Button>
											) : item.type !== "whatsapp" &&
												item.type !== "baileys" ? (
												<Button>Conectar</Button>
											) : (item.status === "DISCONNECTED" &&
													item.type === "whatsapp") ||
												(item.status === "DISCONNECTED" &&
													item.type === "baileys") ? (
												<Button
												onClick={()=>handleRequestNewQrCode(item, 'btn-qrCode')}
												>Novo QR Code</Button>
											) : (
												<></>
											))}
										{item.status === "OPENING" && (
											<Box>
												<Typography>Conectando...</Typography>
											</Box>
										)}
										<Box sx={{display:'flex', justifyContent:'space-between', flexDirection:'row'}}>
											<Box>
											
											{["OPENING", "CONNECTED", "PAIRING", "TIMEOUT"].includes(
												item.status,
											) && <Button>Desconectar</Button>}
											</Box>
										  <Button><DeleteOutlineIcon sx={{color:'red'}}/></Button>
										</Box>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
					{modalWhatsapp && (
						<ModalWhatsapp
							handleClose={handleClosenModalWhatsapp}
							isOpen={modalWhatsapp}
							handleOpen={handleOpenModalWhatsapp}
						/>
					)}
					{modalQrCode && (

					 <ModalQrCode isOpen={modalQrCode} onClose={handleCloseQrModal}/>
					)}
				</Box>
			)}
		</>
	);
};
