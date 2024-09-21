import {
	Avatar,
	Box,
	Card,
	CardContent,
	Chip,
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
import { Clear, WhatsApp } from "@mui/icons-material";
import { UpdateWhatsapp } from "../../services/sessoesWhatsapp";
import { toast } from "sonner";

export const Canais = () => {
	const [chatflows, setChatflows] = useState([]);
	const [selectedChatBots, setSelectedChatBots] = useState({});
	const data = useWhatsappStore((s) => s.whatsApps);
	const userProfile = localStorage.getItem("profile");
	const isAdmin = localStorage.getItem("profile");
	// Função para lidar com a mudança de seleção

	const handleChange =  (whatsapp, event) => {
		// Atualiza o valor apenas para o card correspondente ao id
		setSelectedChatBots((prev) => ({
			...prev,
			[whatsapp.id]: event.target.value,
		}));
		const form = {
			...whatsapp,
			chatFlowId: event.target.value,
		};

		 UpdateWhatsapp(whatsapp.id, form).then(data => {
           if( data.status === 200){
            toast.success(`Whatsapp ${whatsapp.id ? 'editado' : 'criado'} com sucesso!`, {
                position: "top-center"
            })
           }
         })
	};
	const listChatFlow = useCallback(async () => {
		const { data } = await ListarChatFlow();
		console.log(data.chatFlow);
		setChatflows(data.chatFlow);
	}, []);

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

    const handleClearSelection =async (whatsapp) => {
        // Define o valor como '' (vazio) para remover a seleção
        setSelectedChatBots((prev) => ({
          ...prev,
          [whatsapp.id]: '',
        }));
        const form = {
			...whatsapp,
			chatFlowId: null,
		};
        UpdateWhatsapp(whatsapp.id, form).then(data => {
            if( data.status === 200){
             toast.success(`Whatsapp ${whatsapp.id ? 'editado' : 'criado'} com sucesso!`, {
                 position: "top-center"
             })
            }
          })
     
      };
    
	return (
		<>
			{userProfile === "admin" && (
				<Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
					<Typography component="h2" variant="h6" sx={{ mb: 2 }}>
						Canais de Comunicação
					</Typography>
					<Grid
						container
						spacing={2}
						columns={12}
						sx={{ mb: (theme) => theme.spacing(2) }}
					>
						{data.map((item) => (
							<Grid key={item.id} size={{ xs: 12, sm: 6, lg: 3 }}>
								<Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
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
											direction="column"
											sx={{
												justifyContent: "space-between",
												flexGrow: "1",
												gap: 1,
											}}
										>
											<ItemStatusChannel item={item} />
											<Box
												sx={{ display: "flex", alignItems: "center", gap: 1 }}
											>
												<Select
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
														<Clear/>
													</IconButton>
												)}
											</Box>
										</Stack>
										<Divider sx={{ my: 2 }} />
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Box>
			)}
		</>
	);
};
