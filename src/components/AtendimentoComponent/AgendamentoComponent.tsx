import { CalendarMonth } from "@mui/icons-material";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { add } from "date-fns"
import { useState } from "react";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
export const AgendamentoComponent = () => {
    const schedule = {
        selected: { label: 'Agendamento customizado', value: 'custom', func: null },
        options: [
            { label: 'Agendamento customizado', value: 'custom', func: null },
            { label: 'Em 30 minutos', value: '30_mins', func: () => add(new Date(), { minutes: 30 }) },
            { label: 'Amanhã', value: 'amanha', func: () => add(new Date(), { days: 1 }) },
            { label: 'Próxima semana', value: 'prox_semana', func: () => add(new Date(), { weeks: 1 }) },
        ],
    }
    const [selectedValue, setSelectedValue] = useState(schedule.selected.value);
    const [resultData, setResultData] = useState('')

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedOption = schedule.options.find(option => option.value === event.target.value);

        setSelectedValue(selectedOption?.value || '');
        if (selectedOption?.func) {
            const result = selectedOption.func(); // Executa a função associada

            setResultData(result)
        } else {
            setResultData('')
        }
    }
    return (
        <Box sx={{ mb: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
            <FormControl variant="standard" fullWidth>
                <InputLabel id="demo-simple-select-standard-label">Agendamento</InputLabel>
                <Select
                    sx={{ p: 1 }}
                    labelId="schedule-select-label"
                    value={selectedValue}
                    onChange={handleChange}
                    label="Agendamento"
                >
                    {schedule.options.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>

                <Box component="section" sx={{ display: 'flex', gap: 1, p: 2, justifyContent: 'space-between', border: '1px dashed grey' }}>
                    <Typography sx={{ flexGrow: 1 }}>{resultData.toString()}</Typography>

                </Box>

            </FormControl>
        </Box>
    )
}