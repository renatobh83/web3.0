import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider, type PaletteMode } from '@mui/material/styles';


import getSignInSideTheme from '../components/MaterialUi/getSignInSideTheme';

import SignInCard from '../components/MaterialUi/Login/SignInCard';
import Content from '../components/MaterialUi/Login/Content';
import { Box } from '@mui/material';


const getSystemMode = (): PaletteMode => {
    if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }
    return "light"; // Padrão caso a API não esteja disponível
};

export default function Login() {

    const mode: PaletteMode = getSystemMode();
    localStorage.setItem('mui-mode', mode)
    localStorage.setItem('themeMode', mode)
    const SignInSideTheme = createTheme(getSignInSideTheme(mode));
    // This code only runs on the client side, to determine the system color preference
    // React.useEffect(() => {

    //     // Check if there is a preferred mode in localStorage
    //     const savedMode = localStorage.getItem('mui-mode') as PaletteMode | null;

    //     if (savedMode) {
    //         setMode(savedMode);
    //     } else {
    //         // If no preference is found, it uses system preference
    //         const systemPrefersDark = window.matchMedia(
    //             '(prefers-color-scheme: dark)',
    //         ).matches;
    //         console.log(systemPrefersDark)
    //         setMode(systemPrefersDark ? 'dark' : 'light');
    //     }
    // }, []);

    return (
        <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
            <ThemeProvider theme={SignInSideTheme}>
                <CssBaseline enableColorScheme />
                <Stack
                    direction="column"
                    component="main"
                    sx={[
                        {
                            justifyContent: 'space-between',
                            height: { xs: 'auto', md: '100%' },
                        },
                        (theme) => ({
                            backgroundImage:
                                'radial-gradient(ellipse at 70% 51%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                            backgroundSize: 'cover',
                            ...theme.applyStyles('dark', {
                                backgroundImage:
                                    'radial-gradient(at 70% 51%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
                            }),
                        }),
                    ]}
                >
                    <Stack
                        direction={{ xs: 'column-reverse', md: 'row' }}
                        sx={{
                            justifyContent: 'center',
                            gap: { xs: 6, sm: 12 },
                            p: 2,
                            m: 'auto',
                        }}
                    >
                        <Content />
                        <SignInCard />
                    </Stack>
                </Stack>
            </ThemeProvider>
        </Box>
    );
}