import { CalendarMonth, Close } from "@mui/icons-material";
import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { add } from "date-fns"
import { useEffect, useState } from "react";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/pt-br'; // Importa a localização em português
import utc from "dayjs/plugin/utc"; // Plugin para lidar com UTC
import timezone from "dayjs/plugin/timezone"; // Plugin para lidar com fusos horários

dayjs.locale('pt-br'); // Define a localidade para português
dayjs.extend(utc); // Extende dayjs com suporte para UTC
dayjs.extend(timezone); // Extende dayjs com suporte para timezone
export const AgendamentoComponent: React.FC<{ getScheduleDate: (date: string) => void }> = ({ getScheduleDate }) => {
    const schedule = {
        selected: { label: 'Agendamento customizado', value: 'custom', func: null },
        options: [
            { label: 'Agendamento customizado', value: 'custom', func: null },
            { label: 'Em 30 minutos', value: '30_mins', func: () => add(new Date(), { minutes: 30 }) },
            { label: 'Amanhã', value: 'amanha', func: () => add(new Date(), { days: 1 }) },
            { label: 'Próxima semana', value: 'prox_semana', func: () => add(new Date(), { weeks: 1 }) },
        ],
    }

    const [custom, setCustom] = useState(false)
    const [selectedValue, setSelectedValue] = useState(schedule.selected.value);
    const [resultData, setResultData] = useState('')
    const [customDate, setCustomDate] = useState<Dayjs | null>(null)


    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedOption = schedule.options.find(option => option.value === event.target.value);
        setSelectedValue(selectedOption?.value || '');
        if (selectedOption?.func) {
            const result = selectedOption.func(); // Executa a função associada
            // setResultData(dayjs(result).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm"))
            setResultData(result)
            setCustom(false)
        } else {
            setResultData('')
            setCustom(true)
        }
    }
    const handleCustomDate = (newValue) => {
        if (newValue) {
            const localTime = newValue.tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm");
            setResultData(newValue)
        } else {
            setResultData(''); // Limpa o resultado se não houver uma nova data
        }
        setCustomDate(newValue); // Atualiza a data customizada no estado

    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (resultData) {
            const dateUTC = dayjs(resultData).toISOString()
            const adjustedDate = dayjs(dateUTC).tz("America/Sao_Paulo").format();
            getScheduleDate(adjustedDate)
        }
    }, [resultData])

    return (
        <Box sx={{ mb: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
            <FormControl variant="standard" fullWidth>
                <Select
                    sx={{ p: 1 }}
                    labelId="schedule-select-label"
                    value={selectedValue}
                    onChange={(newDate) => handleChange(newDate)}
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
                <Box component="section" sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    border: '1px dashed grey', p: 1
                }}>

                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <MobileDateTimePicker sx={{ width: '100%', border: 'none' }}
                            value={dayjs(resultData.toString())}
                            // value={(resultData.toString())}
                            onChange={handleCustomDate}
                            slotProps={{
                                textField: {
                                    InputProps: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton>
                                                    <CalendarMonth />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },

                                },
                            }}


                        />
                    </LocalizationProvider>

                </Box>
            </FormControl >
        </Box >
    )
}