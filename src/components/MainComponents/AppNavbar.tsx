import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import MuiToolbar from '@mui/material/Toolbar';
import { tabsClasses } from '@mui/material/Tabs';
import { IconButton } from '@mui/material';
import { MenuOutlined } from '@mui/icons-material';
import { MenusNavbar } from './MenusNavbar';



const Toolbar = styled(MuiToolbar)({
    width: '100%',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    gap: '12px',
    flexShrink: 0,
    [`& ${tabsClasses.flexContainer}`]: {
        gap: '8px',
        p: '8px',
        pb: 0,
    },
});

interface appNavbarProps {
    DrawOpen: () => void,
    DrawClose: () => void
    open: boolean
}

export default function AppNavbar({ DrawClose, DrawOpen, open }: appNavbarProps) {
    return (
        <AppBar
            position="fixed"
            sx={{
                boxShadow: 0,
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                top: 'var(--template-frame-height, 0px)',
            }}
        >
            <Toolbar variant="regular">
                <Stack
                    direction="row"
                    sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexGrow: 1,
                        width: '100%',
                    }}
                >
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={open ? DrawClose : DrawOpen}
                            edge="start"
                            sx={[
                                {
                                    marginRight: 5,
                                }

                            ]}
                        >
                            <MenuOutlined />
                        </IconButton>
                    </Stack>
                    <MenusNavbar />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
