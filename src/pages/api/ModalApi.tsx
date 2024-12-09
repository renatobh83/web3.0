import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useWhatsappStore } from '../../store/whatsapp'
import { toast } from 'sonner'
import { CriarAPI, EditarAPI } from '../../services/api'
import { emiterApi } from '.'

interface ModalApiProps {
  open: boolean
  setClose: () => void
  apiEdit: object
}
export const ModalApi = ({ open, setClose, apiEdit }: ModalApiProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { whatsApps } = useWhatsappStore()

  const [stateModalApi, setStateModalApi] = useState<{
    name: string
    sessionId: string
    authToken: string
    isActive: boolean
    urlServiceStatus: string,
    urlMessageStatus: string
  }>({
    name: '',
    sessionId: '',
    authToken: '',
    isActive: true,
    urlMessageStatus: '',
    urlServiceStatus: ''
  })
  const onChangeState = (value: string | boolean, action: string) => {
    setStateModalApi(prev => ({
      ...prev,
      [action]: value,
    }))
  }
  const validateInputs = () => {
    if (
      !stateModalApi.name.trim() ||
      !stateModalApi.authToken.trim() ||
      !stateModalApi.sessionId
    ) {
      toast.error('Favor preencher todos os campos.')
      return false
    }
    return true
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (validateInputs()) {
      setIsLoading(true)
      try {
        if ('id' in apiEdit && apiEdit.id) {
          const apidata = {
            ...apiEdit,
            name: stateModalApi.name,
            isActive: stateModalApi.isActive,
            sessionId: stateModalApi.sessionId,
            authToken: stateModalApi.authToken,
            urlServiceStatus: stateModalApi.urlServiceStatus,
            urlMessageStatus: stateModalApi.urlMessageStatus
          }

          const { data } = await EditarAPI(apidata)
          emiterApi.emit('ApiEditada', data)
        } else {
          const { data } = await CriarAPI(stateModalApi)
          emiterApi.emit('ApiCriada', data)
        }
      } catch (error) {
      } finally {
        setIsLoading(false)
        setClose()
      }
    }
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if ('id' in apiEdit && apiEdit.id) {
      console.log(apiEdit)
      setStateModalApi({
        name: ('name' in apiEdit && apiEdit.name) as string,
        sessionId: ('sessionId' in apiEdit && apiEdit.sessionId) as string,
        isActive: ('isActive' in apiEdit && apiEdit.isActive) as boolean,
        authToken: ('authToken' in apiEdit && apiEdit.authToken) as string,
        urlMessageStatus: ('urlMessageStatus' in apiEdit && apiEdit.urlMessageStatus) as string,
        urlServiceStatus: ('urlServiceStatus' in apiEdit && apiEdit.urlServiceStatus) as string,
      })
    }
  }, [])
  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <Box onSubmit={handleSubmit} noValidate component="form">
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <TextField
                sx={{ maxWidth: '48%', width: '48%' }}
                label="Nome da Api"
                variant="filled"
                value={stateModalApi?.name || ''}
                required
                onChange={e => onChangeState(e.target.value, 'name')}
              />
              <FormControl
                sx={{ maxWidth: '48%', width: '48%' }}
                variant="filled"
              >
                <InputLabel>Enviar por:</InputLabel>
                <Select
                  labelId="Enviar por"
                  required
                  value={stateModalApi?.sessionId || ''}
                  onChange={e => onChangeState(e.target.value, 'sessionId')}
                >
                  {whatsApps?.map(sessao => (
                    <MenuItem key={sessao.id} value={sessao.id}>
                      {sessao.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: '12px', width: '100%' }}>


              <TextField
                sx={{ maxWidth: '100%', width: '100%' }}
                label="Token para autenticação"
                variant="filled"
                required
                value={stateModalApi?.authToken || ''}
                onChange={e => onChangeState(e.target.value, 'authToken')}
              />

              <TextField
                sx={{ maxWidth: '100%', width: '100%' }}
                label="Webook url Message Status"
                variant="filled"
                required
                value={stateModalApi?.urlMessageStatus || ''}
                onChange={e => onChangeState(e.target.value, 'urlMessageStatus')}
              />
              <TextField
                sx={{ maxWidth: '100%', width: '100%' }}
                label="Webook url Message Service"
                variant="filled"
                required
                value={stateModalApi?.urlServiceStatus || ''}
                onChange={e => onChangeState(e.target.value, 'urlServiceStatus')}
              />

            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ display: 'flex', justifyContent: 'space-between', px: '24px' }}
        >
          {"id" in apiEdit && apiEdit.id ? (
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateModalApi.isActive}
                    onChange={e => onChangeState(e.target.checked, 'isActive')}
                  />
                }
                label="Ativo"
              />
            </Box>
          ) : (
            <Box />
          )}
          <Box sx={{ gap: 2, display: 'flex' }}>
            <Button
              sx={{
                fontWeight: 'bold',
                font: 'message-box',
              }}
              onClick={setClose}
              variant="contained"
              color="error"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              sx={{
                fontWeight: 'bold',
                font: 'message-box',
              }}
              variant="contained"
              color="success"
              disabled={isLoading}
            >
              Salvar
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
