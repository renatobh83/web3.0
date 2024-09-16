import { AppBar, Box, CssBaseline, Stack, Toolbar, Typography } from "@mui/material"
import { MenuDrawer } from "../components/MainComponents/MenuDrawer"
import { useState } from "react"
import { Header } from "../components/MainComponents/Header"
import AppNavbar from "../components/MainComponents/AppNavbar"
import AppTheme from "../Theme/AppTheme"





export const MainLayout: React.FC<{
    props?: {
        disableCustomTheme: boolean
    }
}> = ({ props }) => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    return (
        <AppTheme {...props} >
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex' }}>
                <MenuDrawer />

                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'center',
                            mx: 3,
                            pb: 10,
                            mt: 8,
                        }}
                    >
                        {/* header inside main */}
                        <Header />
                        <div>
                            Main..
                        </div>
                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    )
}