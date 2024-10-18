import { Box, Button, Card, CardContent, CardHeader, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography, useTheme } from "@mui/material"
import Grid from '@mui/material/Grid2';
import { useState } from "react";

const optType = [
    { value: 'O', label: 'Aberto' },
    { value: 'C', label: 'Fechado' },
    { value: 'H', label: 'Horário' }
]
const businessHours = [
    { day: 0, label: 'Domingo', type: 'O', hr1: '08:00', hr2: '12:00', hr3: '14:00', hr4: '18:00' },
    { day: 1, label: 'Segunda-Feira', type: 'O', hr1: '08:00', hr2: '12:00', hr3: '14:00', hr4: '18:00' },
    { day: 2, label: 'Terça-Feira', type: 'O', hr1: '08:00', hr2: '12:00', hr3: '14:00', hr4: '18:00' },
    { day: 3, label: 'Quarta-Feira', type: 'O', hr1: '08:00', hr2: '12:00', hr3: '14:00', hr4: '18:00' },
    { day: 4, label: 'Quinta-Feira', type: 'O', hr1: '08:00', hr2: '12:00', hr3: '14:00', hr4: '18:00' },
    { day: 5, label: 'Sexta-Feira', type: 'O', hr1: '08:00', hr2: '12:00', hr3: '14:00', hr4: '18:00' },
    { day: 6, label: 'Sábado', type: 'O', hr1: '08:00', hr2: '12:00', hr3: '14:00', hr4: '18:00' }
]


export const HorarioAtendimento = () => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === 'dark';
    const [type, setType] = useState(optType)
    const [businessHour, setBusinessHour] = useState(businessHours)

    const [typeSelected, setTypeSelected] = useState(
        businessHours.reduce((acc, curr) => {
            acc[curr.day] = { type: curr.type };
            return acc;
        }, {} as { [key: number]: { type: string } })
    );

    const handleChangeRadio = (day: number, newType: string) => {
        setTypeSelected((prevState) => ({
            ...prevState,
            [day]: { type: newType }
        }));
    };





    return (
        <Box
            sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                    Horário de Atendimento
                </Typography>
                <Button
                    variant="contained"
                    color="info"
                // onClick={() => setOpen(true)}
                >
                    Salvar
                </Button>
            </Box>
            <Box sx={{
                padding: 2,
                position: 'relative',
                width: '100%'
            }}>
                <Card id='Cards' sx={{
                    mt: '-8px',
                    ml: '-8px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.background.default,
                    width: '100%'
                }}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ width: '100%' }}>
                        {businessHour.map((v, index) => (
                            <Grid key={v.day} size={{ xs: 2, sm: 4, md: 4 }} sx={{ border: '1px solid #ccdd' }}>
                                <CardHeader sx={{ pl: 1, py: 1 / 2, backgroundColor: isDarkMode ? theme.palette.grey[600] : theme.palette.grey[200], color: 'black !important' }}
                                    subheader={v.label} />
                                <CardContent sx={{ px: 2, paddingBottom: "16px !important", }}>
                                    <RadioGroup
                                        value={typeSelected[v.day].type}
                                        onChange={(e) => handleChangeRadio(v.day, e.target.value)}
                                        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                        {type.map(i => (
                                            <FormControlLabel
                                                key={i.value}
                                                value={i.value}
                                                control={<Radio size="small" />}
                                                label={i.label} />
                                        ))}

                                    </RadioGroup>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                            <TextField id="outlined-basic" value={v.hr1} disabled={typeSelected[v.day].type !== "H"} />
                                            <span> ás</span>
                                            <TextField id="outlined-basic" value={v.hr2} disabled={typeSelected[v.day].type !== "H"} />
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                            <TextField id="outlined-basic" value={v.hr3} disabled={typeSelected[v.day].type !== "H"} />
                                            <span> ás</span>
                                            <TextField id="outlined-basic" value={v.hr4} disabled={typeSelected[v.day].type !== "H"} />
                                        </Box>
                                    </Stack>
                                </CardContent>

                            </Grid>
                        ))}
                    </Grid>

                </Card>

            </Box>
        </Box>
    )
}