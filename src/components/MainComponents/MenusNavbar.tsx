import { Logout, Person } from "@mui/icons-material";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountBoxRounded from "@mui/icons-material/AccountBoxRounded";
import {
    alpha, Avatar, Badge, Button, Divider,
    FormControlLabel,
    FormGroup,
    ListItemText, Menu, MenuItem, MenuList,
    type MenuProps, Stack, styled, Switch, Tooltip,
    Typography, useColorScheme
} from "@mui/material"
import { useEffect, useState } from "react";
import ToggleColorMode from "../MaterialUi/Login/ToggleColorMode";
import { useNotificationsStore } from "../../store/notifications";
import { red, green } from "@mui/material/colors";
import SystemVersion from "./SystemVersion";
import { toast } from "sonner";
import { useApplicationStore } from "../../store/application";
import { useAtendimentoTicketStore } from "../../store/atendimentoTicket";
import { useLocation, useNavigate } from "react-router-dom";



export const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color: 'rgb(55, 65, 81)',
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
        ...theme.applyStyles('dark', {
            color: theme.palette.grey[300],
        }),
    },
}));



export const MenusNavbar = () => {
    const navigate = useNavigate()
    const location = useLocation();

    const { notifications, notificationsP } = useNotificationsStore()
    const { mode, setMode } = useColorScheme()
    const [status, setStatus] = useState(false);
    const [usuario, setUsuario] = useState(
        JSON.parse(localStorage.getItem("usuario") || "null"),
    );
    const username = localStorage.getItem("username");
    const { themeMode, toggleThemeMode } = useApplicationStore()
    const AbrirChatMensagens = useAtendimentoTicketStore(s => s.AbrirChatMensagens)
    const setHasMore = useAtendimentoTicketStore(s => s.setHasMore)
    const ticketFocado = useAtendimentoTicketStore(s => s.ticketFocado)

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        useAtendimentoTicketStore.setState({
            redirectToChat: (ticketId: string) => {
                navigate(`/atendimento/${ticketId}`);
            },
        });
    }, []);
    function abrirChatContato(ticket) {
        // caso esteja em um tamanho mobile, fechar a drawer dos contatos
        // if (this.$q.screen.lt.md && ticket.status !== 'pending') {
        //   this.$root.$emit('infor-cabecalo-chat:acao-menu')
        // }

        if (!(ticket.status !== 'pending' && (ticket.id !== ticketFocado.id || location.pathname !== 'chat'))) return
        setHasMore(true)
        AbrirChatMensagens(ticket)
    }

    useEffect(() => {
        setMode(themeMode);
    }, [themeMode, setMode]);

    const handleToggleColor = () => {
        toggleThemeMode(); // Alterna o tema na store
    }
    // const toggleColorMode = () => {
    //     const newMode = mode === 'dark' ? 'light' : 'dark';
    //     setMode(newMode);

    //     localStorage.setItem('themeMode', newMode); // Save the selected mode to localStorage
    // };


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl)
    const openNav = Boolean(anchorElNav)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleUpdateUser = (e) => {
        if (usuario) {
            usuario.status = e.target.checked ? 'online' : 'offline'
        }
        localStorage.setItem('usuario', JSON.stringify(usuario));
        setStatus(e.target.checked)
    }
    const efetuarLogout = async () => {
        try {
            // await RealizarLogout(usuario)
            // localStorage.removeItem('token')
            // localStorage.removeItem('username')
            // localStorage.removeItem('profile')
            // localStorage.removeItem('userId')
            // localStorage.removeItem('queues')
            // localStorage.removeItem('usuario')
            // localStorage.removeItem('filtrosAtendimento')

            window.location.href = "/login";
        } catch (error) {
            toast.error(`Não foi possível realizar logout ${error}`)
        }
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {

        if (usuario) {
            setStatus(usuario.status === 'online');
        }
    }, []);
    return (
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>

            <Tooltip title='Notificações' arrow placement="left">
                <>
                    <Button onClick={handleClick}>
                        {+notificationsP.count + +notifications.count === 0 ? <NotificationsNoneIcon /> :
                            <Badge badgeContent={+notificationsP.count + +notifications.count} color="primary">
                                <NotificationsIcon />
                            </Badge>
                        }
                    </Button>
                    <StyledMenu
                        id="demo-customized-menu"
                        MenuListProps={{
                            'aria-labelledby': 'demo-customized-button',
                        }}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        open={open}>

                        {+notifications.count + +notificationsP.count === 0 ?
                            <MenuItem onClick={handleClose} disableRipple>
                                <Typography >Não a nada de novo por aqui!!</Typography>
                            </MenuItem> :
                            <MenuList sx={{ display: 'flex', gap: 2 }}>
                                <Typography>{+notifications.count + +notificationsP.count} Clientes pendentes na fila </Typography>
                                {notificationsP.tickets.map(ticket => (
                                    <MenuItem key={ticket.id} sx={{ display: 'flex', gap: 3 }}
                                        onClick={() => abrirChatContato(ticket)}>
                                        <Avatar src={ticket.profilePicUrl} />
                                        <div>
                                            <ListItemText>{ticket.name}</ListItemText>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                {ticket.lastMessage}
                                            </Typography>
                                        </div>
                                    </MenuItem>
                                ))}

                            </MenuList>
                        }

                    </StyledMenu>
                </>
            </Tooltip>
            <Tooltip
                title={
                    usuario?.status === "offline"
                        ? "Usuário Offiline"
                        : "Usuário Online"
                }
            >
                <Avatar
                    sx={{
                        width: 26,
                        height: 26,
                        bgcolor:
                            usuario?.status === "offline" ? red[400] : green[400],
                    }}
                />
            </Tooltip>
            <Button onClick={handleOpenNavMenu}>
                <AccountBoxRounded />
            </Button>
            <StyledMenu id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorElNav}
                onClose={handleCloseNavMenu}
                open={openNav}>
                <MenuList>
                    <Typography>Ola <b>{username}</b></Typography>
                    <Divider sx={{ mb: 1 }} />
                    <MenuItem>
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch
                                    checked={status}
                                    onChange={handleUpdateUser} />}
                                label={usuario.status} />
                        </FormGroup>
                    </MenuItem>
                    <MenuItem>
                        <Person />
                        <Typography>Perfil</Typography>
                    </MenuItem>
                    <MenuItem onClick={efetuarLogout}>
                        <Logout />
                        <Typography>Sair</Typography>
                    </MenuItem>
                    <Divider sx={{ mb: 1 }} />
                    <MenuItem sx={{ justifyContent: 'center' }}>
                        <SystemVersion />
                    </MenuItem>

                </MenuList>
            </StyledMenu>
            <ToggleColorMode
                data-screenshot="toggle-mode"
                mode={mode}
                toggleColorMode={handleToggleColor}
            />
            {/* <Select
                value={mode}
                onChange={(event) =>
                    setMode(event.target.value as 'system' | 'light' | 'dark')
                }
            >
                <MenuItem value="system">System</MenuItem>
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
            </Select> */}
        </Stack>
    )
}