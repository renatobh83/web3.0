import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { InputMenssagem } from './InputMenssagem'
import { Close } from '@mui/icons-material'
import { useAtendimentoStore } from '../../store/atendimento'
import { useOutletContext } from 'react-router-dom'

export const ModalAgendamentoMensagem = () => {
  const { mensagensRapidas } = useOutletContext()

  const modalagendamento = useAtendimentoStore(s => s.modalAgendamento)
  const setModalAgendamento = useAtendimentoStore(s => s.setModalAgendamento)
  return (
    <Dialog open={modalagendamento} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Agendamento de mensagem</Typography>
          <Button size="small" onClick={setModalAgendamento}>
            <Close fontSize="small" />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <InputMenssagem
          isScheduleDate={true}
          mensagensRapidas={mensagensRapidas}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={setModalAgendamento}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  )
}
