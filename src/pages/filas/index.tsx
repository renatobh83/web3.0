import styled from "@emotion/styled";
import { Box, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { ModalFila } from "./ModalFila";
import { useCallback, useEffect, useState } from "react";
import { DeletarFila, ListarFilas } from "../../services/filas";
import { Check, Close, Delete, Edit } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import { toast } from "sonner";
import { update } from "lodash";

const CustomTableContainer = styled(Table)(({ theme }) => ({
    // Customize styles with Tailwind CSS classes
    padding: theme.spacing(2),
    width: '100%',
    backgroundColor: theme.palette.background.paper,

    boxShadow: theme.shadows[3],
    '& .MuiTableCell-root': {
        padding: theme.spacing(1),
    },
}))

export const Filas = () => {
    const [open, setOpen] = useState(false)

    const [filas, setFilas] = useState([])
    const [filaSelecionada, setFilaSelecionada] = useState({})


    const handleFilasUpdate = (novaFila: any) => {
        if (filaSelecionada?.id) {
            setFilas((prev) => {
                const index = prev.findIndex((fila) => fila.id === filaSelecionada.id)
                const updateFila = [...prev]
                updateFila[index] = novaFila
                return updateFila
            })
        } else {
            setFilas((prevFilas) => [...prevFilas, novaFila])
        }

    };
    const closeModal = () => {
        setOpen(false)
        setFilaSelecionada({})
    }
    const handleEditarFila = (fila) => {
        setFilaSelecionada(fila)
        setOpen(true)
    }
    const listarFilas = useCallback(async () => {
        const { data } = await ListarFilas()
        console.log(data)
        setFilas(data)
    }, [])
    const handleDeleteFila = (fila: any) => {
        toast.info(
            `Atenção!! Deseja realmente deletar a fila "${fila.queue}"?`,
            {
                position: "top-center",
                cancel: {
                    label: "Cancel",
                    onClick: () => console.log("Cancel!"),
                },
                action: {
                    label: "Confirma",
                    onClick: () => {
                        DeletarFila({ id: fila.id }).then(data => {
                            let newFilas = [...filas]
                            newFilas = newFilas.filter(f => f.id !== fila.id)
                            setFilas(newFilas)
                        })
                    },
                },
            },
        );
    };
    useEffect(() => {
        listarFilas()
    }, [])
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                <Typography variant="h6">Filas</Typography>
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
                    <TableRow >
                        <TableCell>#</TableCell>
                        <TableCell>Fila</TableCell>
                        <TableCell>Ativo</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filas.map(fila => (
                        <TableRow key={fila.id}>
                            <TableCell>{fila.id}</TableCell>
                            <TableCell>{(fila.queue).toUpperCase()}</TableCell>
                            <TableCell>
                                {fila.isActive ? <Check /> : <Close />}
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }} >
                                    <Tooltip title="Editar fila">
                                        <IconButton
                                            onClick={() => handleEditarFila(fila)}
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Apagar usuário">
                                        <IconButton
                                            onClick={() => handleDeleteFila(fila)}
                                        >
                                            <Delete sx={{ color: red[400] }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>

            </CustomTableContainer>
            {open && <ModalFila open={open} closeModal={closeModal} filaSelecionada={filaSelecionada} updateFilas={handleFilasUpdate} />}
        </Box >
    )
}