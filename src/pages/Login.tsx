import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider, PaletteMode } from '@mui/material/styles';


import getSignInSideTheme from '../components/MaterialUi/getSignInSideTheme';
import TemplateFrame from '../components/MaterialUi/Login/TemplateFrame';

import SignInCard from '../components/MaterialUi/Login/SignInCard';
import Content from '../components/MaterialUi/Login/Content';
import { Box } from '@mui/material';




export default function Login() {
    const [mode, setMode] = React.useState<PaletteMode>('light');
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const defaultTheme = createTheme({ palette: { mode } });
    const SignInSideTheme = createTheme(getSignInSideTheme(mode));
    // This code only runs on the client side, to determine the system color preference
    React.useEffect(() => {
        // Check if there is a preferred mode in localStorage
        const savedMode = localStorage.getItem('themeMode') as PaletteMode | null;
        if (savedMode) {
            setMode(savedMode);
        } else {
            // If no preference is found, it uses system preference
            const systemPrefersDark = window.matchMedia(
                '(prefers-color-scheme: dark)',
            ).matches;
            setMode(systemPrefersDark ? 'dark' : 'light');
        }
    }, []);

    const toggleColorMode = () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode); // Save the selected mode to localStorage
    };

    const toggleCustomTheme = () => {
        setShowCustomTheme((prev) => !prev);
    };

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