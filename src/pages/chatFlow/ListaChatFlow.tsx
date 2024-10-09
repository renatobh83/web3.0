import { Box, Typography, Button, TableCell, TableHead, TableRow, TableBody, IconButton, Tooltip } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { ModalChatFlow } from "./ModalChatFlow"
import { CustomTableContainer } from "../../components/MaterialUi/CustomTable"
import { ListarChatFlow } from "../../services/chatflow"
import { Check, Close, Delete, Edit } from "@mui/icons-material"
import { red } from "@mui/material/colors"
import LanIcon from '@mui/icons-material/Lan';
import useChatFlowStore from "../../store/chatFlow"
import { ListarFilas } from "../../services/filas"
import { ListarUsuarios } from "../../services/user"
import { useNavigate } from "react-router-dom"

export const ListaChatFlow: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [flowSelecionado, setFlowSelecionado] = useState({})
    const [chatFlows, setChatFlows] = useState([])
    const closeModal = () => {
        setOpen(false)
        setFlowSelecionado({})
    }
    const handleFlowCreateOrUpdate = (novoFlow: any) => {

        if (flowSelecionado?.id) {
            setChatFlows((prev) => {
                const index = prev.findIndex((flow) => flow.id === flowSelecionado.id)
                const updateFlow = [...prev]
                updateFlow[index] = novoFlow
                return updateFlow
            })
        } else {
            setChatFlows((prevFlow) => [...prevFlow, novoFlow])
        }
    };
    const listaChatFlow = useCallback(async () => {
        const { data } = await ListarChatFlow()
        setChatFlows(data.chatFlow)

    }, [])
    const [filas, setFilas] = useState([])
    const [usuarios, setUsuarios] = useState([])

    async function listarFilas() {
        const { data } = await ListarFilas()
        setFilas(data.filter(q => q.isActive))
    }
    async function listarUsuarios() {
        const { data } = await ListarUsuarios()
        setUsuarios(data.users)
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        listarFilas()
        listarUsuarios()
        listaChatFlow()
    }, [])
    const { setFlowData } = useChatFlowStore()
    const nav = useNavigate()
    const handleOpenFlow = (ChatFlow: any) => {
        setFlowData({
            flow: ChatFlow.flow,
            usuarios,
            filas
        })
        nav("builder")
    }
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                <Typography variant="h6">Fluxos</Typography>
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
                        <TableCell>Nome</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Celular Teste</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {chatFlows.map(chatFlow => (
                        <TableRow key={chatFlow.id}>
                            <TableCell>{chatFlow.name}</TableCell>
                            <TableCell>
                                {chatFlow.isActive ? 'Ativo' : "Inativo"}
                            </TableCell>
                            <TableCell>{chatFlow.celularTeste}</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }} >
                                    <Tooltip title="Editar flow">
                                        <IconButton
                                        // onClick={() => handleEditarFila(fila)}
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Abrir Fluxo">
                                        <IconButton
                                            onClick={() => handleOpenFlow(chatFlow)}
                                        >
                                            <LanIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Apagar Flow">
                                        <IconButton
                                        // onClick={() => handleDeleteFila(fila)}
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


            {open && <ModalChatFlow open={open} closeModal={closeModal} flowSelecionado={flowSelecionado} updateFlow={handleFlowCreateOrUpdate} />}
        </Box>
    )
}