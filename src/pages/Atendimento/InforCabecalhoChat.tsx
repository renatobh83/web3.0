import { Toolbar, IconButton, Typography, Box, Button, Avatar, Stack, styled, Paper, Divider, ListItem, List, ListItemText, ListItemIcon, Skeleton, ButtonGroup, } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { type AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

import { CalendarMonth, FindInPage, TransferWithinAStation } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import { useAtendimentoStore } from "../../store/atendimento";

// biome-ignore lint/suspicious/noRedeclare: <explanation>
interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));



export const InfoCabecalhoMenssagens = () => {
    const { drawerWidth, isClosing, mobileOpen, setMobileOpen, isContactInfo, setIsContactInfo } = useAtendimentoStore()
    const isPerfil = true
    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    return (
        <AppBar
            open={isContactInfo}
            position="fixed"
            sx={{
                bgcolor: 'background.paper',
                width: isContactInfo ? { sm: "calc(100% -  300px)" } : { md: `calc(100% - ${drawerWidth}px)` },
                ml: isContactInfo ? { sm: `${drawerWidth}px` } : { sm: `${drawerWidth}px` },
                mr: isContactInfo ? { sm: '300px' } : '0',
            }}

        >
            <Toolbar disableGutters sx={{ px: 2 }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                    {!isPerfil ? (
                        <Box sx={{ width: { sm: 100, md: 300 } }}>
                            <Skeleton />
                            <Skeleton />
                        </Box>
                    ) : (
                        <Button
                            onClick={() => setIsContactInfo(!isContactInfo)}
                            sx={{
                                width: { sm: 150, md: 300 },
                                minHeight: 60, height: 60, display: 'flex',
                                justifyContent: 'flex-start'
                            }}>
                            <List sx={{ width: '100%' }} >
                                <ListItem sx={{ gap: 2 }} disablePadding>
                                    <ListItemIcon><Avatar /></ListItemIcon>
                                    <ListItemText secondary={'teste'}>
                                        <Typography sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '90%'
                                        }} >Renato Lucio de mendonca</Typography>
                                    </ListItemText>
                                    <ListItemText sx={{ display: 'flex', justifyContent: 'end' }}>
                                        <Typography variant="caption" sx={{ fontSize: 9 }}>Ticket 34</Typography>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Button>
                    )}
                    <Divider sx={{ flexGrow: '1', mx: 10 }} />
                    <ButtonGroup variant="outlined" aria-label="Basic button group" size="small">
                        <Button >Agendar</Button>
                        <Button>Resolver</Button>
                        <Button>Transferir</Button>
                    </ButtonGroup>
                </Box>
            </Toolbar>
        </AppBar >
    )
}