import {
    Box, Button, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, InputLabel, MenuItem, OutlinedInput,
    Radio,
    RadioGroup,
    Select, Stack, TextField, Typography
} from "@mui/material"


import Grid from '@mui/material/Grid2'
import BasicDateTimePicker from "../../components/AtendimentoComponent/DateTimePicker"
import dayjs, { Dayjs } from "dayjs"
import { useForm } from "react-hook-form"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { MolduraCelular } from "../../components/MolduraCelular"
import { useEffect, useState } from "react"
import { ChatMensagem } from "../Atendimento/ChatMenssage"
import { useWhatsappStore } from "../../store/whatsapp"
import { AlterarCampanha, CriarCampanha } from "../../services/campanhas"
import { toast } from "sonner"
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker"
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
    campanhaId: any
}

export const ModalCampanha = ({ open, setClose, campanhaId }: ModalCampanhaProps) => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<Campanha>()
    const { whatsApps } = useWhatsappStore()
    function cSessions() {
        return whatsApps.filter(w => ["whatsapp", "baileys"].includes(w.type) && !w.isDeleted)
    }

    const [campanha, setCampanha] = useState({
        name: null,
        start: null,
        mediaUrl: null,
        message1: null,
        message2: null,
        message3: null,
        sessionId: null,
        delay: 20
    })
    const adjustedDate = (date) => {
        const dateUTC = dayjs(date).toISOString()
        const adjustedDate = dayjs(dateUTC).tz('America/Sao_Paulo').format()
        return adjustedDate
    }
    function resetarCampanha() {
        setCampanha({
            name: null,
            start: null,
            message1: null,
            message2: null,
            message3: null,
            mediaUrl: null,
            delay: 20,
            sessionId: null
        })
    }
    const handleCloseModal = () => {
        resetarCampanha()
        setClose()
    }
    const handleOnChange = (e, key) => {
        setCampanha(prev => ({
            ...prev,
            [key]: key === "start" ? adjustedDate(e) : e
        }))
    }
    const [messagemPreview, setMessagemPreview] = useState('message1')
    const msgArray = ['message1', 'message2', 'message3']
    const [messageTemplate, setMessageTemplate] = useState(
        {
            mediaUrl: null,
            id: null,
            ack: 3,
            read: true,
            fromMe: true,
            body: null,
            mediaType: 'chat',
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: '2021-02-20T23:26:24.311Z',
            quotedMsgId: null,
            delay: 20,
            ticketId: 0,
            contactId: null,
            userId: null,
            contact: null,
            quotedMsg: null
        }
    )

    const onSubimit = async () => {
        const medias = new FormData()
        console.log(campanha)
        // biome-ignore lint/complexity/noForEach: <explanation>
        Object.keys(campanha).forEach((key) => {
            medias.append(key, campanha[key])
        })
        try {
            if (campanhaId?.id) {
                const { data } = await AlterarCampanha(medias, campanhaId.id)
                toast.info('Campanha editada!')
                handleCloseModal()
            } else {
                const { data } = await CriarCampanha(medias)
                toast.info('Campanha criada!')
                handleCloseModal()
            }
        } catch (error) {
            console.log(error)
        }


        // console.log('ls', campanha, cSessions())
    }
    function cMessages() {
        const messages: { id: string; body: any; mediaUrl: null; ack: number; read: boolean; fromMe: boolean; mediaType: string; isDeleted: boolean; createdAt: string; updatedAt: string; quotedMsgId: null; delay: number; ticketId: number; contactId: null; userId: null; contact: null; quotedMsg: null }[] = []
        const msgArray = ['message1', 'message2', 'message3']
        // biome-ignore lint/complexity/noForEach: <explanation>
        msgArray.forEach(el => {
            if (messagemPreview === el) {
                const body = campanha[el]
                const msg = {
                    ...messageTemplate,
                    id: el,
                    body
                }
                messages.push(msg)
            }
        })
        return messages
    }
    useEffect(() => {
        if (campanhaId) {
            setCampanha({
                delay: campanhaId.delay,
                start: campanhaId.start,
                name: campanhaId.name,
                message1: campanhaId.message1,
                message2: campanhaId.message2,
                message3: campanhaId.message3,
                sessionId: campanhaId.sessionId,
                mediaUrl: campanhaId.mediaUrl
            })
        }
    }, [campanhaId])
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
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField fullWidth variant="outlined" label='Nome da campanha'
                                value={campanha?.name || ''}
                                onChange={e => handleOnChange(e.target.value, 'name')}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                                <Stack spacing={2} sx={{ minWidth: 305 }}>
                                    <MobileDateTimePicker
                                        value={dayjs(campanha.start) || ''}
                                        onChange={e => handleOnChange(e, 'start')}

                                    />

                                </Stack>
                            </LocalizationProvider>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Enviar por:</InputLabel>
                                <Select
                                    label='Enviar por'
                                    variant="outlined"
                                    value={campanha?.sessionId || ''}
                                    onChange={e => handleOnChange(Number(e.target.value), 'sessionId')}
                                >
                                    {cSessions().map(sessao => (
                                        <MenuItem key={sessao.id} value={sessao.id}>{sessao.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField sx={{ width: '100px' }} variant="outlined" label='Delay'
                                onChange={e => handleOnChange(Number(e.target.value), 'delay')} />
                            {/* <TextField fullWidth variant="outlined" label='Nome da campanha' /> */}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Box id="left" sx={{ minWidth: '400px' }}>
                                <Box id="1">
                                    <Typography>1º Menssagem</Typography>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        multiline
                                        rows={5}
                                        value={campanha?.message1 || ''}
                                        onChange={e => handleOnChange(e.target.value, 'message1')}
                                    />
                                </Box>
                                <Box id="2">
                                    <Typography>2º Menssagem</Typography>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        multiline
                                        rows={5}
                                        value={campanha?.message2 || ''}
                                        onChange={e => handleOnChange(e.target.value, 'message2')}
                                    />
                                </Box>
                                <Box id="3">
                                    <Typography>3º Menssagem</Typography>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        multiline
                                        rows={5}
                                        value={campanha?.message3 || ''}
                                        onChange={e => handleOnChange(e.target.value, 'message3')}
                                    />
                                </Box>
                            </Box>
                            <Box id="rigth" sx={{ width: '500px', display: 'flex', flexDirection: 'column' }}>
                                <RadioGroup
                                    value={messagemPreview}
                                    onChange={e => setMessagemPreview(e.target.value)}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {msgArray.map(i => (
                                        <FormControlLabel
                                            key={i}
                                            value={i}
                                            control={<Radio size="small" />}
                                            label={i === 'message1' ? 'Mensagem 1' : i === 'message2' ? 'Mensagem 2' : 'Mensagem 3'}
                                        />
                                    ))}
                                </RadioGroup>
                                <MolduraCelular>
                                    <ChatMensagem menssagens={cMessages()} />
                                </MolduraCelular>
                            </Box>
                        </Box>
                    </Box>
                    <DialogActions>
                        <Button variant="contained" color="success" type="submit">Salvar</Button>
                        <Button variant="contained" color="error" onClick={() => handleCloseModal()}>Cancelar</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog >)
}