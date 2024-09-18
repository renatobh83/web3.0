import { useOutletContext } from "react-router-dom";
import { InfoCabecalhoMenssagens } from "./InforCabecalhoChat"
import { Box, CssBaseline, Fade, Toolbar } from "@mui/material";
import AppTheme from "../../Theme/AppTheme";


export type OutletContextType = {
    drawerWidth: number;
    handleDrawerToggle: () => void;
};


export const Chat = () => {
    const { drawerWidth, handleDrawerToggle } = useOutletContext<OutletContextType>();
    const cMessages = []
    return (
    
        <Box sx={{  overflow: 'hidden', scrollbarWidth: 'none' }}>
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