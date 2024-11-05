import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  FormControl,
  FormLabel,
  Input,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { CriarChatFlow, UpdateChatFlow } from '../../services/chatflow'
import { getDefaultFlow } from '../../components/FlowBuilderComponent/InitialChatFlow'

interface ModalChatFlowProps {
  open: boolean
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  flowSelecionado: any
  closeModal: () => void
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  updateFlow: (arg0: any) => void
}

export const ModalChatFlow = ({
  open,
  closeModal,
  flowSelecionado,
  updateFlow,
}: ModalChatFlowProps) => {
  const [flowError, setflowError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [flowErrorMessage, setflowErrorMessage] = useState('')
  const userId = +localStorage.getItem('userId')
  const [chatFlow, setChatFlow] = useState({
    name: '',
    action: 0,
    userId,
    celularTeste: '',
    isActive: true,
  })

  const validateInputs = () => {
    let isValid = true
    const name = document.getElementById('flow') as HTMLInputElement
    if (!name.value) {
      setflowError(true)
      setflowErrorMessage('Insira um nome para o chat flow.')
      isValid = false
    }
    return isValid
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    event.preventDefault()
    if (validateInputs()) {
      if ('id' in flowSelecionado && flowSelecionado?.id) {
        const { data } = await UpdateChatFlow(chatFlow)
        updateFlow(data)
        closeModal()
        setIsLoading(false)
      } else {
        const flowId = Date.now() // Exemplo simples de ID único
        const flow = { ...getDefaultFlow(), ...chatFlow, flowId: flowId }

        const { data } = await CriarChatFlow(flow)
        updateFlow(data)
        closeModal()
        setIsLoading(false)
      }
    }
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if ('id' in flowSelecionado && flowSelecionado?.id) {
      setChatFlow(flowSelecionado)
    }
  }, [])
  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogContent>
        <Typography sx={{ mb: 2 }} variant="h6">
          {'id' in flowSelecionado && flowSelecionado.id
            ? 'Editar flow'
            : 'Cadastrar Flow'}
        </Typography>
        <Box onSubmit={handleSubmit} noValidate component="form">
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <FormLabel htmlFor="fila">
              {flowError ? flowErrorMessage : 'Descricao flow'}
            </FormLabel>
            <Input
              id="flow"
              name="flow"
              value={chatFlow.name}
              error={flowError}
              color={flowError ? 'error' : 'primary'}
              onChange={e =>
                setChatFlow(prev => ({
                  ...prev,
                  name: e.target.value.toLowerCase(),
                }))
              }
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <FormControlLabel
              control={
                <Checkbox
                  checked={chatFlow.isActive}
                  onChange={e =>
                    setChatFlow(prev => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                />
              }
              label="Ativo"
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <FormLabel htmlFor="fila">Numero para Teste</FormLabel>
            <Input
              id="numberTeste"
              name="numberTeste"
              type="tel"
              // value={fila.queue}
              // onChange={(e) => setFila((prev) => ({
              //     ...prev,
              //     queue: (e.target.value).toLowerCase()
              // }))}
            />
            <Typography variant="caption">
              Deixe limpo para que a Auto resposta funcione. Caso contrário, irá
              funcionar somente para o número informado aqui.
            </Typography>
          </FormControl>
          <DialogActions>
            <Button
              sx={{
                fontWeight: 'bold',
                font: 'message-box',
              }}
              disabled={isLoading}
              variant="contained"
              color="error"
              onClick={closeModal}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              sx={{
                fontWeight: 'bold',
                font: 'message-box',
              }}
              disabled={isLoading}
              variant="contained"
              color="success"
              onClick={validateInputs}
            >
              Salvar
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
