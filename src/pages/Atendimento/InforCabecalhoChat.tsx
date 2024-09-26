import {
	Toolbar,
	IconButton,
	Typography,
	Box,
	Button,
	Avatar,
	styled,
	Divider,
	ListItem,
	List,
	ListItemText,
	ListItemIcon,
	Skeleton,
	ButtonGroup,
	Tooltip,
} from "@mui/material";
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar, {
	type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";

import {
	CalendarMonth,
	MessageOutlined,
	Replay,
	RestartAlt,
} from "@mui/icons-material";
import { useAtendimentoStore } from "../../store/atendimento";
import { useAtendimentoTicketStore } from "../../store/atendimentoTicket";

// biome-ignore lint/suspicious/noRedeclare: <explanation>
interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
	transition: theme.transitions.create(["margin", "width"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	variants: [
		{
			props: ({ open }) => open,
			style: {
				transition: theme.transitions.create(["margin", "width"], {
					easing: theme.transitions.easing.easeOut,
					duration: theme.transitions.duration.enteringScreen,
				}),
			},
		},
	],
}));

export const InfoCabecalhoMenssagens = () => {
	const {
		drawerWidth,
		isClosing,
		mobileOpen,
		setMobileOpen,
		isContactInfo,
		setIsContactInfo,
	} = useAtendimentoStore();
	const ticketFocado = useAtendimentoTicketStore((s) => s.ticketFocado);

	const handleDrawerToggle = () => {
		if (!isClosing) {
			setMobileOpen(!mobileOpen);
		}
	};
	const handleModalAgendamento = () => {
		alert('Criar modal agenda')
	}
	const Value = (obj, prop) => {
		try {
			return obj[prop];
		} catch (error) {
			return "";
		}
	};

	return (
		<AppBar
			open={isContactInfo}
			position="fixed"
			sx={{
				bgcolor: "background.paper",
				width: isContactInfo
					? { md: "calc(100% -  380px)" }
					: { md: `calc(100% - ${drawerWidth}px)` },
				// pl: isContactInfo ? { sm: `${drawerWidth}px`} : { md: 0 },
				pr: isContactInfo ? { sm: "300px" } : "0",
			}}
		>
			<Toolbar disableGutters sx={{ px: 2 }}>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={handleDrawerToggle}
					sx={{ mr: 2, display: { md: "none" } }}
				>
					<MenuIcon />
				</IconButton>
				<Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
					{!ticketFocado.id ? (
						<Box sx={{ width: { sm: 100, md: 300 } }}>
							<Skeleton />
							<Skeleton />
						</Box>
					) : (
						<>
							<Button
								onClick={() => setIsContactInfo(!isContactInfo)}
								sx={{
									flexGrow: 1,
									width: { sm: 150, md: 300 },
									minHeight: 60,
									height: 60,
									display: "flex",
									justifyContent: "flex-start",
								}}
							>
								<List sx={{ width: "100%" }}>
									<ListItem sx={{ gap: 2 }} disablePadding>
										<ListItemIcon>
											<Avatar
												src={Value(ticketFocado.contact, "profilePicUrl")}
											/>
										</ListItemIcon>

										<ListItemText
											sx={{
												display: { xs: 'none', sm: 'none', md: 'block' }
											}}
											secondary={
												Value(ticketFocado.user, "name") && (
													<Typography

														variant="caption"
														sx={{
															fontSize: 9,
														}}
													>{`Ticket ${ticketFocado.id}`}</Typography>
												)
											}
										>
											<Typography
												sx={{
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
													maxWidth: "80%",
												}}
											>
												{Value(ticketFocado.contact, "name")}
											</Typography>
											<Typography
												// variant="caption"
												sx={{
													fontSize: 10,
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
													maxWidth: "80%",
												}}
											>{`Atribuido à: ${Value(ticketFocado.user, "name")}`}</Typography>
										</ListItemText>

									</ListItem>
								</List>
							</Button>

							<ButtonGroup
								variant="outlined"
								aria-label="Basic button group"
								size="small"
							>
								<Tooltip title="Agendar">
									<Button onClick={() => handleModalAgendamento()}>
										<CalendarMonth />
									</Button>
								</Tooltip>
								{ticketFocado.status === "closed" ? (
									<Button><Replay /></Button>
								) : (
									ticketFocado.status === "open" && (
										<>
											<Tooltip title="Resolver">
												<Button>
													<MessageOutlined />
												</Button>
											</Tooltip>
											<Tooltip title="Retornar à fila pendentes">
												<Button>
													<RestartAlt />
												</Button>
											</Tooltip>
										</>
									)
								)}
								{ticketFocado.status !== "closed" && (
									<Tooltip title="Transferir">
										<Button>
											<AirlineStopsIcon />
										</Button>
									</Tooltip>
								)}
							</ButtonGroup>
						</>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
};
