import { useOutletContext } from "react-router-dom";
import { InfoCabecalhoMenssagens } from "./InforCabecalhoChat"
import { Box, Fade, FormControlLabel, Paper, Switch, Toolbar } from "@mui/material";

import { useState } from "react";
export type OutletContextType = {
    drawerWidth: number;
    handleDrawerToggle: () => void;
};

const icon = (
    <Paper sx={{ m: 1, width: 100, height: 100 }} elevation={4}>
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
        <svg>
            <Box
                component="polygon"
                points="0,100 50,00, 100,100"
                sx={(theme) => ({
                    fill: theme.palette.common.white,
                    stroke: theme.palette.divider,
                    strokeWidth: 1,
                })}
            />
        </svg>
    </Paper>
);
export const Chat = () => {
    const { drawerWidth, handleDrawerToggle } = useOutletContext<OutletContextType>();
    const cMessages = []
    return (
        <Box sx={{ bgcolor: 'white', overflow: 'hidden', scrollbarWidth: 'none' }}>
            <InfoCabecalhoMenssagens drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
            <Toolbar />
            <Box >
                {!cMessages.length ? (

                    <Fade in={true} timeout={4000}>
                        <div>Nao tem nada de novo</div>
                    </Fade>
                ) :
                    <div>menssagens</div>

                }

            </Box>
        </Box>
    )
}