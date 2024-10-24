import styled from "@emotion/styled"
import { Table, Box, Typography, Button, TableCell, TableHead, TableRow, DialogActions, Checkbox, DialogContent, FormControl, FormControlLabel, FormLabel, Input, TableBody, IconButton, Tooltip } from "@mui/material"
import { ModalMensagemRapida } from "./ModalMensagemRapida"
import { SetStateAction, useCallback, useEffect, useState } from "react"
import { DeletarMensagemRapida, ListarMensagensRapidas } from "../../services/mensagensRapidas"
import { Edit, Delete } from "@mui/icons-material"
import { red } from "@mui/material/colors"
import { toast } from "sonner"
import { DeletarFila } from "../../services/filas"
import { CustomTableContainer } from "../../components/MaterialUi/CustomTable"


export const MensagensRapidas = () => {
    const [mensagensRapidas, setMensagensRapidas] = useState([])

    const [mensagensRapidasSelecionada, setMensagensRapidasSelecionada] = useState({})
    const [open, setOpen] = useState(false)
    const closeModal = () => {
        setOpen(false)
        setMensagensRapidasSelecionada({})
    }

    const handleEditarMensagemRapida = (mensagem) => {
        setMensagensRapidasSelecionada(mensagem)
        setOpen(true)
    }
    const handleMensagemRapidaUpdate = (novaMensagem: any) => {
        if (mensagensRapidasSelecionada?.id) {
            setMensagensRapidas((prev) => {
                const index = prev.findIndex((fila) => fila.id === mensagensRapidasSelecionada.id)
                const updateMensagemRapida = [...prev]
                updateMensagemRapida[index] = novaMensagem
                return updateMensagemRapida
            })
        } else {
            setMensagensRapidas((prevMensagem) => [...prevMensagem, novaMensagem])
        }

    };
    const listarMensagensRapidas = useCallback(async () => {
        const { data } = await ListarMensagensRapidas()
        setMensagensRapidas(data)
    }, [])

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        listarMensagensRapidas()
    }, [])


    const handleDeleteMessage = (msg: any) => {
        toast.info(
            `Atenção!! Deseja realmente deletar a mensamgem rapida "${msg.message}"?`,
            {
                position: "top-center",
                cancel: {
                    label: "Cancel",
                    onClick: () => console.log("Cancel!"),
                },
                action: {
                    label: "Confirma",
                    onClick: () => {
                        DeletarMensagemRapida({ id: msg.id }).then(_data => {
                            let newMessage = [...mensagensRapidas]
                            newMessage = newMessage.filter(f => f.id !== msg.id)
                            setMensagensRapidas(newMessage)
                        })
                    },
                },
            },
        );
    };
    return (

        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                <Typography variant="h6">Mensagens Rápidas </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpen(true)}
                >
                    Adicionar
                </Button>
            </Box>
            <CustomTableContainer sx={{ mt: 2 }}>
                <TableHead>
                    <TableRow >
                        <TableCell>#</TableCell>
                        <TableCell>Chave</TableCell>
                        <TableCell>Mensagem</TableCell>
                        {/* <TableCell>Arquivo</TableCell>
                        <TableCell>Áudio Gravado</TableCell> */}

                        <TableCell sx={{ textAlign: 'center' }}>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {mensagensRapidas.map((mensagemRapida) => (
                        <TableRow key={mensagemRapida.id}>
                            <TableCell>{mensagemRapida.id}</TableCell>
                            <TableCell>{mensagemRapida.key}</TableCell>
                            <TableCell>{mensagemRapida.message}</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }} >
                                    <Tooltip title="Editar mensagem radida">
                                        <IconButton
                                            onClick={() => handleEditarMensagemRapida(mensagemRapida)}
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Apagar mensagem rapida">
                                        <IconButton
                                            onClick={() => handleDeleteMessage(mensagemRapida)}
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
            {open && <ModalMensagemRapida
                open={open}
                closeModal={closeModal}
                mensagensRapidasSelecionada={mensagensRapidasSelecionada}
                updateMensagem={handleMensagemRapidaUpdate}
            />}
        </Box>
    )
}