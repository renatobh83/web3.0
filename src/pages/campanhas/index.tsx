import { Box, Typography, Button, TableCell, TableHead, TableRow, TableBody, IconButton, Tooltip } from "@mui/material"
import { CustomTableContainer } from "../../components/MaterialUi/CustomTable"
import { format, parseISO } from "date-fns"
import { useCallback, useEffect, useState } from "react"
import { WhatsApp, Edit, Delete } from "@mui/icons-material"
import { DeletarCampanha, ListarCampanhas } from "../../services/campanhas"
import { ModalCampanha } from "./ModalCampanha"
import { toast } from "sonner"
const status = {
    pending: 'Pendente',
    scheduled: 'Programada',
    processing: 'Processando',
    canceled: 'Cancelada',
    finished: 'Finalizada'
}

export const Campanhas = () => {
    const [campanhas, setCampanhas] = useState([])
    const [campanhaId, setCampanhaId] = useState(null)
    const [open, setOpen] = useState(false)
    const handleCloseModal = () => {
        setOpen(false)
        setCampanhaId(null)
    }
    const listarCampanhas = useCallback(async () => {
        try {
            const { data } = await ListarCampanhas()
            setCampanhas(data)
        } catch (error) {
            setCampanhas([])
        }
    }, [])
    const handleEditarCampanha = (id) => {
        setCampanhaId(id)
        setOpen(true)
    }
    const handleDeleteCampanha = (campanha) => {
        toast.info(
            `Atenção!! Deseja realmente deletar a campamanha "${campanha.name}"?`,
            {
                cancel: {
                    label: 'Cancel',
                    onClick: () => console.log('Cancel!'),
                },
                action: {
                    label: 'Confirma',
                    onClick: () => {
                        DeletarCampanha(campanha)
                            .then(() => {
                                listarCampanhas()
                            })
                    },
                },
            }
        )
    }
    const columns = [
        { name: 'id', label: '#', field: 'id', align: 'left' },
        { name: 'name', label: 'Campanha', field: 'name', align: 'left' },
        {
            name: 'start',
            label: 'Início',
            field: 'start',
            align: 'center',
            renderCell: ({ value }) => format(parseISO(value), 'dd/MM/yyyy HH:mm')
        },
        {
            name: 'status',
            label: 'Status',
            field: 'status',
            renderCell: ({ value }) => value ? status[value] : ''

        },
        { name: 'contactsCount', label: 'Qtd. Contatos', field: 'contactsCount', align: 'center' },
        { name: 'pendentesEnvio', label: 'À Enviar', field: 'pendentesEnvio', align: 'center' },
        { name: 'pendentesEntrega', label: 'À Entregar', field: 'pendentesEntrega', align: 'center' },
        { name: 'recebidas', label: 'Recebidas', field: 'recebidas', align: 'center' },
        { name: 'lidas', label: 'Lidas', field: 'lidas', align: 'center' },
        {
            name: 'acoes', label: 'Ações', field: 'acoes', align: 'center',
            renderCell: (params: { row }) => (
                <Box
                    sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
                    className="flex justify-center space-x-2"
                >
                    {params.row.number && (
                        <Tooltip title="Abrir ticket">
                            <IconButton
                            // onClick={() => {
                            //     setContatoSelecionado(params.row)
                            //     handleSaveTicket(params.row)
                            // }}
                            >
                                <WhatsApp />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Edit">
                        <IconButton
                            onClick={() => handleEditarCampanha(params.row)}
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            onClick={() => handleDeleteCampanha(params.row)}
                        >
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        }
    ]
    useEffect(() => {
        listarCampanhas()
    }, [open])
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6">Campanhas</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(true)}
                >
                    Adicionar
                </Button>
            </Box>
            <CustomTableContainer sx={{ mt: 2 }}>
                <TableHead>
                    <TableRow>
                        {columns.map(col => (
                            <TableCell
                                key={col.name}
                                sx={{
                                    width: `${100 / columns.length}%`,
                                    flexGrow: 1,
                                    textAlign: 'center',
                                }}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {campanhas.map(row => (
                        <TableRow key={row.id}>
                            {columns.map(col => (
                                <TableCell
                                    key={col.field}
                                    sx={{ width: `${100 / columns.length}%`, flexGrow: 1, textAlign: 'center' }}
                                >
                                    {col.renderCell
                                        ? col.renderCell({ value: row[col.field], row })
                                        : row[col.field]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </CustomTableContainer>
            {open && <ModalCampanha open={open} setClose={handleCloseModal} campanhaId={campanhaId} />}
        </Box>

    )
}