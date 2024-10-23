import { Box, Button, Chip, Dialog, DialogActions, DialogContent, FormControl, IconButton, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material"
import { CustomTableContainer } from "../MaterialUi/CustomTable"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Group, AccessTime, Cancel, Edit, Delete } from "@mui/icons-material"
import { CriarWebhook, ListarWebhook } from "../../services/webhooks"

const TIPO_ACAO = ["consulta", "agendamento", "confirmacao", "laudo", "preparo"]
export const WebhookConfiguracao = () => {
    const [tempValue, setTempValue] = useState('')
    const [open, setOpen] = useState(false)
    const [webhookEdit, setWebhookEdit] = useState<{
        action: string[],
        usuario: string,
        senha: string
    }>({
        action: [],
        usuario: '',
        senha: '',
    })

    const [webhooks, setWebhooks] = useState([])

    const [stateWebhook, setStateWebhook] = useState<{
        action: string[],
        usuario: string,
        senha: string
    }>({
        action: [],
        usuario: '',
        senha: '',
    })

    const columns = [
        { field: 'id', headerName: 'ID', name: 'id' },
        { field: 'Usuario', headerName: 'usuario', name: "usuario" },
        { field: 'Senha', headerName: 'senha', name: "senha" },
        { field: 'Status', headerName: 'status', name: "status" },
        {
            field: 'Operações', headerName: 'oper', name: "action",
            renderCell: (params: any) => {
                return params.value?.join(", ") || ''
            },

        },
        {
            headerName: 'acoes', field: 'Ações',
            renderCell: (params: { row: { id: any } }) => (
                <Box
                    sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
                    className="flex justify-center space-x-2"
                >

                    <Tooltip title="Lista de contato da campanha">
                        <IconButton
                        // onClick={() => handleAddContatosCampanha(params.row)}
                        >
                            <Group />
                        </IconButton>
                    </Tooltip>
                    {/* {['pending', 'canceled'].includes(params.row.status) && (
                        <Tooltip title="Programar envio">
                            <IconButton
                                onClick={() => iniciarCampanha(params.row)}
                            >
                                <AccessTime />
                            </IconButton>
                        </Tooltip>
                    )} */}
                    {/* {['scheduled', 'processing'].includes(params.row.status) &&
                        (
                            <Tooltip title="Cancelar envio">
                                <IconButton
                                    onClick={() => cancelarCampanha(params.row)}
                                >
                                    <Cancel />
                                </IconButton>
                            </Tooltip>
                        )} */}
                    <Tooltip title="Edit">
                        <IconButton
                            onClick={() => {

                                setWebhookEdit(params.webhook)
                                setOpen(true)
                            }}
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                        // onClick={() => handleDeleteCampanha(params.row)}
                        >
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        }
    ];
    const handleOnChange = (value: string, acao: string) => {
        setStateWebhook(prev => ({
            ...prev,
            [acao]: value
        }))
    }
    const handleChangeInputChips = (value: string) => {
        setTempValue(value)
    }
    const handleDeleteInputChips = (chipToDelete: string) => {
        setStateWebhook(prev => ({
            ...prev,
            acoes: prev.action.filter(chip => chip !== chipToDelete)
        }))

    }
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && tempValue.trim()) {
            if (TIPO_ACAO.includes((tempValue.toLowerCase().trim()))) {
                setStateWebhook(prev => ({
                    ...prev,
                    action: [...prev.action, tempValue.trim()]
                }))
                setTempValue('')
                return
            }
            toast.error('Favor inserir apenas as opções aceitas para esse webhook')

        }
    }
    const handleSalvar = () => {
        if (!stateWebhook.usuario.trim() || !stateWebhook.senha.trim()) {
            toast.info('Preencher todas as informações')
            return
        }
        CriarWebhook(stateWebhook).then(data => console.log(data))
    }

    const listaWebhook = useCallback(async () => {
        const { data } = await ListarWebhook()
        setWebhooks(data)
    }, [])
    useEffect(() => {
        listaWebhook()
    }, [])

    useEffect(() => {
        if (webhookEdit.id) {
            setStateWebhook(webhookEdit)
        }
    }, [webhookEdit])
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6">Webhooks</Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpen(true)}
                >
                    Adicionar
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map(col => (
                                <TableCell
                                    key={col.headerName}
                                    sx={{
                                        width: `${100 / columns.length}%`,
                                        flexGrow: 1,
                                        textAlign: 'center',
                                    }}
                                >
                                    {col.field}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {webhooks.map(webhook => (
                            <TableRow key={webhook.id}>
                                {columns.map(col => (
                                    <TableCell
                                        key={col.field}
                                        sx={{ width: `${100 / columns.length}%`, flexGrow: 1, textAlign: 'center' }}
                                    >
                                        {col.renderCell
                                            ? col.renderCell({ value: webhook[col.name], webhook })
                                            : webhook[col.name]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {open && <Dialog open={open} fullWidth maxWidth='md'>

                <DialogContent sx={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                        <TextField variant="filled" label='Usuario'
                            value={stateWebhook.usuario}
                            onChange={e => handleOnChange(e.target.value, 'usuario')} />
                        <TextField variant="filled" label='Senha'
                            value={stateWebhook.senha}
                            onChange={e => handleOnChange(e.target.value, 'senha')} />
                    </Box>
                    <FormControl fullWidth>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                        }}>
                            {stateWebhook.action.map((chip, index) => (
                                <Chip
                                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                    key={index}
                                    label={chip}
                                    onDelete={() =>
                                        handleDeleteInputChips(chip)
                                    }
                                    sx={{ margin: '4px' }}
                                />
                            ))}
                            <TextField label='Ações' variant="filled"
                                value={tempValue || ''}
                                onChange={e =>
                                    handleChangeInputChips(e.target.value)
                                }
                                sx={{ width: '100%', margin: '4px' }}
                                onKeyDown={e => handleKeyDown(e)} // Lida com a tecla Enter
                            />
                            <Typography variant="caption">Digite e pressione Enter - Opções disponiveis consulta, agendamento, confirmacao, laudo, preparo</Typography>
                        </Box>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="success" onClick={() => handleSalvar()}>Salvar</Button>
                    <Button variant="contained" color="error"
                        onClick={() => {
                            setWebhookEdit({})
                            setOpen(false)
                        }}
                    >Cancelar</Button>
                </DialogActions>
            </Dialog >
            }
        </>
    )
}