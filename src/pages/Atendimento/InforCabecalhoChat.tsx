import { AppBar, Toolbar, IconButton, Typography, Box, Button, Avatar, Stack, styled, Paper, Divider } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import type { OutletContextType } from "./Chat";
import { CalendarMonth, FindInPage, TransferWithinAStation } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    flexGrow: 1,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

export const InfoCabecalhoMenssagens = ({ drawerWidth, handleDrawerToggle }: OutletContextType) => {
    return (
        <AppBar
            position="fixed"
            sx={{
                bgcolor: 'background.paper',
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
            }}
        >
            <Toolbar disableGutters sx={{ px: 2 }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                    <Button
                        sx={{
                            width: 300,
                            minHeight: 60, height: 60, display: 'flex',
                            justifyContent: 'flex-start'
                        }}>
                        <Box sx={{ pr: 2 }}>
                            <Avatar />
                        </Box>
                        <Box sx={{ flexGrow: '1', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap', maxWidth: '80%'
                            }} >Renato Lucio</Typography>
                            <Typography variant="caption">Atendido por </Typography>
                        </Box>
                        <Typography variant="caption" gutterBottom sx={{ display: 'block' }}> Ticket 34</Typography>
                    </Button>
                    <Divider sx={{ flexGrow: '1' }} />
                    <Box>
                        <IconButton>
                            <CalendarMonth />
                        </IconButton>
                        <IconButton>
                            <TransferWithinAStation />
                        </IconButton>
                        <IconButton>
                            <Close />
                        </IconButton>
                        <IconButton>
                            <FindInPage />
                        </IconButton>

                    </Box>
                </Box>
            </Toolbar>
        </AppBar >
    )
}