import { ContentCut, Logout, NotificationAddOutlined, PlayCircleFilledRounded } from "@mui/icons-material";
import AccountBoxRounded from "@mui/icons-material/AccountBoxRounded";
import {
    alpha, Avatar, Badge, Box, Button, Divider, IconButton,
    ListItemIcon, ListItemText, Menu, MenuItem, MenuList,
    type MenuProps, type PaletteMode, Select, Stack, styled, Switch, Tooltip,
    Typography, useColorScheme
} from "@mui/material"
import { useState } from "react";
import ToggleColorMode from "../MaterialUi/Login/ToggleColorMode";



const StyledMenu = styled((props: MenuProps) => (
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
    const { mode, setMode } = useColorScheme()

    const toggleColorMode = () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode); // Save the selected mode to localStorage
    };

    const label = { inputProps: { 'aria-label': 'Switch demo' } };
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
    return (
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>

            <Tooltip title='Notificações' arrow placement="left">
                <>
                    <Button onClick={handleClick}>
                        <Badge badgeContent={4} color="primary">
                            <NotificationAddOutlined />
                        </Badge>
                    </Button>
                    <StyledMenu
                        id="demo-customized-menu"
                        MenuListProps={{
                            'aria-labelledby': 'demo-customized-button',
                        }}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        open={open}>

                        {1 !== 0 ?
                            <MenuList>
                                <MenuItem>
                                    <ListItemIcon>
                                        <ContentCut fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Cut</ListItemText>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        ⌘X
                                    </Typography>
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <ContentCut fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Cut</ListItemText>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        ⌘X
                                    </Typography>
                                </MenuItem>
                            </MenuList>
                            : <MenuItem onClick={handleClose} disableRipple>
                                <Typography >Não a nada de novo por aqui!!</Typography>
                            </MenuItem>
                        }

                    </StyledMenu>
                </>
            </Tooltip>
            <Avatar sx={{
                width: 26,
                height: 26,
            }} />
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
                    <Typography>Ola</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <MenuItem>
                        <Switch {...label} size="small" />
                    </MenuItem>
                    <MenuItem>
                        <PlayCircleFilledRounded />
                        <Typography>Perfil</Typography>
                    </MenuItem>
                    <MenuItem>
                        <Logout />
                        <Typography>Sair</Typography>
                    </MenuItem>
                    <Divider sx={{ mb: 1 }} />
                    <MenuItem>
                        <Typography>Versao do sistema</Typography>
                    </MenuItem>

                </MenuList>
            </StyledMenu>
            <ToggleColorMode
                data-screenshot="toggle-mode"
                mode={mode}
                toggleColorMode={toggleColorMode}
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