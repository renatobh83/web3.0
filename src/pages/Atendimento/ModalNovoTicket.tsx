import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'

import { PesquisaContato } from '../../components/AtendimentoComponent/PesquisaContato'
import { ChangeEvent, useEffect, useState } from 'react'
import { useWhatsappStore } from '../../store/whatsapp'
import { Errors } from '../../utils/error'
import { CriarTicket } from '../../services/tickets'
import { toast } from 'sonner'
import { useAtendimentoTicketStore } from '../../store/atendimentoTicket'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../../store/application'

interface ModalNovoTicketProps {
  open: boolean
  close: () => void

}

export const ModalNovoTicket = ({
  open,
  close,

}: ModalNovoTicketProps) => {

  const userId = +localStorage.getItem('userId')
  const navigate = useNavigate()
  const ticketFocado = useAtendimentoTicketStore(s => s.ticketFocado)
  const setHasMore = useAtendimentoTicketStore(s => s.setHasMore)
  const AbrirChatMensagens = useAtendimentoTicketStore(
    s => s.AbrirChatMensagens
  )
  const whatsApps = useWhatsappStore(s => s.whatsApps)
  const { contatoSelecionado, setContatoSelecionado } = useApplicationStore()


  const [canalSelecionado, setCanaSelecionado] = useState(null)

  const [modalCanal, setModalCanal] = useState(false)
  const [canais, setCanais] = useState([])
  const goToChat = async (id: string) => {
    try {
      const timestamp = new Date().getTime()
      navigate(`/atendimento/${id}?t=${timestamp}`, {
        replace: false,
        state: { t: new Date().getTime() },
      })
    } catch (error) { }
  }

  useEffect(() => {

    if (contatoSelecionado?.id) {
      setContatoSelecionado(contatoSelecionado)
      handleSelectChannel()
    }
  }, [contatoSelecionado])


  const handleCloseModalCanal = () => {
    setModalCanal(false)
    close()
  }
  const handleSelectChannel = () => {
    if (contatoSelecionado && !contatoSelecionado.id) return
    setModalCanal(true)

  }
  const abrirChatContato = ticket => {
    if (
      !(
        ticket.status !== 'pending' &&
        (ticket.id !== ticketFocado?.id || location.pathname !== 'chat')
      )
    )
      return
    setHasMore(true)
    AbrirChatMensagens(ticket)
    goToChat(ticket.id)
    close()
  }

  const abrirAtendimentoExistente = (
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    contato: { name?: any },
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ticket: { id: any }
  ) => {
    toast.info(
      `${contato.name} possui um atendimento em curso (Atendimento: ${ticket.id}).`,
      {
        position: 'top-center',
        action: {
          label: 'Deseja abrir o atendimento?',
          onClick: () => abrirChatContato(ticket),
        },
      }
    )
  }

  const handleCreateTicket = async () => {
    if (!canalSelecionado) return
    try {
      const { data: ticket } = await CriarTicket({
        contactId: contatoSelecionado?.id,
        isActiveDemand: true,
        userId: userId,
        channel: 'whatsapp',
        canalSelecionado,
        status: 'open',
      })
      setHasMore(true)
      setModalCanal(false)
      close()
      AbrirChatMensagens(ticket)
      goToChat(ticket.id)
    } catch (error) {
      if (error.status === 409) {
        const ticketAtual = JSON.parse(error.data.error)
        abrirAtendimentoExistente(contatoSelecionado, ticketAtual)
        setModalCanal(false)
        return
      }
      Errors(error)
    }
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCanaSelecionado(e.target.value)
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {

    const itens:
      | ((prevState: never[]) => never[])
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      | { label: any; value: any }[] = []
    // biome-ignore lint/complexity/noForEach: <explanation>
    whatsApps.forEach(w => {
      if (w.type === 'whatsapp') {
        itens.push({ label: w.name, value: w.id })
      }
    })
    setCanais(itens)
    return () => {
      setCanais([])
    }
  }, [contatoSelecionado])

  return (
    <>
      {open && contatoSelecionado === undefined &&
        <Dialog open={open} fullWidth maxWidth="xs" >
          <DialogTitle>Criar ticket</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <PesquisaContato getContatoSelecionado={setContatoSelecionado} />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button variant='contained' color='error' onClick={() => close()}>Cancelar</Button>
            <Button variant='contained' color='success' onClick={() => handleSelectChannel()}>Salvar</Button>
          </DialogActions>
        </Dialog>
      }
      {modalCanal && (
        <Dialog
          open={modalCanal}
          onClose={() => handleCloseModalCanal()}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>
            <DialogTitle>

              {!canais.length ? "Nenhum canal conectado favor verificar em Canais" : `Abrir um novo ticket para ${contatoSelecionado.name}`}

            </DialogTitle>

            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                {canais.length ? "Selecione o canal para iniciar o atendimento." : ''}
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                onChange={canal => handleChange(canal)}
                name="radio-buttons-group"
              >
                {' '}
                {canais.map(canal => (
                  <FormControlLabel
                    key={canal.value}
                    value={canal.value}
                    control={<Radio />}
                    label={canal.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button variant='contained' color='error' onClick={() => handleCloseModalCanal()}>Cancelar</Button>
            <Button disabled={!canais.length} variant='contained' color='success' onClick={() => handleCreateTicket()}>Criar ticket</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}
