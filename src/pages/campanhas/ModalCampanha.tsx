import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2'
import BasicDateTimePicker from "../../components/AtendimentoComponent/DateTimePicker"
import { Dayjs } from "dayjs"
import { useForm } from "react-hook-form"
const variaveis = [
    { label: 'Nome', value: '{{name}}' },
    { label: 'E-mail (se existir)', value: '{{email}}' },
    { label: 'Telefone', value: '{{phoneNumber}}' },
    { label: 'Kanban', value: '{{kanban}}' },
]
const optRadio = [
    { label: 'Msg.1', value: 'message1' },
    { label: 'Msg. 2', value: 'message2' },
    { label: 'Msg. 3', value: 'message3' }
]

interface Campanha {
    name: string,
    data: string
}


interface ModalCampanhaProps {
    open: boolean,
    setClose: () => void
}

export const ModalCampanha = ({ open, setClose }: ModalCampanhaProps) => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<Campanha>()

    const onSubimit = contato => {
        console.log('ls')
    }
    return (
        <Dialog open={open} fullWidth maxWidth='md' >
            <DialogContent >
                <Box sx={{ mb: 2 }}>

                    <Typography sx={{ mb: 2 }} variant="h3">{'Cadastrar Campanha'}</Typography>
                    <Typography variant="subtitle2">As mensagens sempre serão enviadas em horário comercial e dias úteis.</Typography>
                </Box>
                <form
                    onSubmit={handleSubmit(onSubimit)}
                >
                    <Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField margin="dense" />
                            <BasicDateTimePicker />
                        </Box>
                    </Box>
                    <DialogActions>
                        <Button variant="contained" color="success" type="submit">Salvar</Button>
                        <Button variant="contained" color="error" onClick={() => setClose()}>Cancelar</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog >)
}