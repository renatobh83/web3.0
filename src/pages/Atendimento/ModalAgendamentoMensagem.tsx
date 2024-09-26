import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"
import { InputMenssagem } from "./InputMenssagem"

export const ModalAgendamentoMensagem = () => {
    return (
        <Dialog open={true} fullWidth maxWidth='sm'>
            <DialogTitle>
                <Typography>Agendamento de mensagem</Typography>
            </DialogTitle>
            <DialogContent>
                <InputMenssagem />
            </DialogContent>
        </Dialog>
    )
}