import * as React from "react";
import { useState } from "react";
import {
    styled,
    useTheme,
    type Theme,
    type CSSObject,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, {
    type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";

import AppNavbar from "./AppNavbar";
import { MenuComponent } from "./MenuComponent";



const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

export const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(["width", "margin"], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    variants: [
        {
            props: ({ open }) => open,
            style: {
                ...openedMixin(theme),
                "& .MuiDrawer-paper": openedMixin(theme),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
                ...closedMixin(theme),
                "& .MuiDrawer-paper": closedMixin(theme),
            },
        },
    ],
}));
export const MenuDrawer: React.FC = () => {

    const [usuario, setUsuario] = useState(
        JSON.parse(localStorage.getItem("usuario") || "null"),
    );
    const profile = localStorage.getItem("profile") || null;


    const [miniState, setMiniState] = useState(true);

    const username = localStorage.getItem("username");
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
        setMiniState(false);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setMiniState(true);

    };

    return (
        <Box sx={{ display: "flex", flexDirection: 'column' }}>
            <AppBar position="fixed">
                <AppNavbar DrawOpen={handleDrawerOpen} DrawClose={handleDrawerClose} open={open} />
            </AppBar>
            <Drawer
                variant="permanent"
                open={open}
                onMouseOver={handleDrawerOpen}
                onMouseOut={handleDrawerClose}
            >
                <DrawerHeader />
                <Divider />
                <MenuComponent userProfile={'admin'} state={open} />
            </Drawer>
        </Box>
    );
};
