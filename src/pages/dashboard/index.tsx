import { Box, Button, Stack, Toolbar, Typography } from "@mui/material"

export const Dashboard: React.FC = () => {

    return (
        <>
            <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
                <Stack direction={{ md: 'row' }}
                    sx={{

                        gap: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid black',
                        p: 1,
                        flexWrap: 'wrap'
                    }}>
                    <Typography variant="h4">Painel de controle</Typography>
                    <Stack direction={'row'} gap={1}>
                        <input />
                        <input />
                        <Button>Gerar</Button>
                    </Stack>
                </Stack>
            </Box >
        </>
    )
}