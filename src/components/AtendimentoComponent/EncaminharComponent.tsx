import { Close, Tune } from "@mui/icons-material"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material"
import { useState } from "react"
import { ChatMensagem } from "../../pages/Atendimento/ChatMenssage"
import { PesquisaContato } from "./PesquisaContato"

interface EncaminharComponentProps {
    menssagemParaEncaminhar: any
    open: boolean,
    setClose: (value: boolean) => void
    resetMensagenParaEncaminhar: () => void
}
export const EncaminharComponent = ({ menssagemParaEncaminhar, open, setClose, resetMensagenParaEncaminhar }: EncaminharComponentProps) => {


    const [contatoSeleciondo, setContatoSelecionado] = useState('')


    const handleCloseModal = () => {
        resetMensagenParaEncaminhar()
        setClose(false)
    }
    const handleConfirmarEncaminhamentoMensagem = () => {
        if (!contatoSeleciondo?.id) return

    }
    return (
        <Dialog open={open} fullWidth maxWidth='sm'>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Typography>Encaminhando Menssagem</Typography>
                    <Button onClick={() => handleCloseModal()}><Close /></Button>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <ChatMensagem menssagens={menssagemParaEncaminhar} />

                    </Box>
                    <PesquisaContato getContatoSelecionado={setContatoSelecionado} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="success" onClick={() => handleConfirmarEncaminhamentoMensagem()}>Enviar</Button>
            </DialogActions>
        </Dialog>
    )
}