import {
    Avatar,
	Box,
	Card,
	CardContent,
	Chip,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useWhatsappStore } from "../../store/whatsapp";
import { ItemStatusChannel } from "./ItemStatusChannel";
export const Canais = () => {
    const data  = useWhatsappStore(s => s.whatsApps)
	const userProfile = localStorage.getItem("profile");
	const isAdmin = localStorage.getItem("profile");
    console.log(data)
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
                    {data.map(item =>(

					
						<Grid key={item.id} size={{ xs: 12, sm: 6, lg: 3 }}>
							<Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
								<CardContent>
                                    <Box sx={{display: 'flex', gap:2}}>

                                    <Avatar/>
                                    <Box sx={{display: 'flex', flexDirection:'column'}}>
									<Typography component="h2" variant="subtitle2" gutterBottom>
										{item.name}
									</Typography>
                                    <Typography variant="caption">{item.type}</Typography>
                                    </Box>
                                    </Box>
									<Divider sx={{my: 2}}/>
									<Stack
										direction="column"
										sx={{
											justifyContent: "space-between",
											flexGrow: "1",
											gap: 1,
                                            
										}}
									>
                                    <ItemStatusChannel item={item}/>
									
									</Stack>
                                    <Divider sx={{my: 2}}/>
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
