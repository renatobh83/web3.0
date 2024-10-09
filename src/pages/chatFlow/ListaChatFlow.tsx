import { Box, Typography, Button, TableCell, TableHead, TableRow } from "@mui/material"
import { useState } from "react"
import { ModalChatFlow } from "./ModalChatFlow"
import { CustomTableContainer } from "../../components/MaterialUi/CustomTable"

export const ListaChatFlow: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [flowSelecionado, setFlowSelecionado] = useState({})

    const closeModal = () => {
        setOpen(false)
        setFlowSelecionado({})
    }
    const handleFlowCreateOrUpdate = (novoFlow: any) => {
        if (flowSelecionado?.id) {
            setFlowSelecionado((prev) => {
                const index = prev.findIndex((flow) => flow.id === flowSelecionado.id)
                const updateFlow = [...prev]
                updateFlow[index] = novoFlow
                return updateFlow
            })
        } else {
            setFlowSelecionado((prevFlow) => [...prevFlow, novoFlow])
        }
    };
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
            </CustomTableContainer>

            {open && <ModalChatFlow open={open} closeModal={closeModal} flowSelecionado={flowSelecionado} updateFlow={handleFlowCreateOrUpdate} />}
        </Box>
    )
}