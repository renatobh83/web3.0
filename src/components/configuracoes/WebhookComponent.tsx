import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Edit, Delete } from '@mui/icons-material'
import {
  CriarWebhook,
  DeletarApi,
  ListarWebhook,
  UpdateApi,
} from '../../services/webhooks'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { Errors } from '../../utils/error'

const TIPO_ACAO = [
  'consulta',
  'sendpreparo',
  'agendamento',
  'confirmacao',
  'laudo',
  'preparo',
  'pdf',
  'consultacpf',
  'validacpf',
  'planos',
]

interface webhookProps {
  id?: string
  action: string[]
  nomeApi: string
  usuario: string
  senha: string
  expDate: string
  baseURl: string
}

export const WebhookConfiguracao = () => {
  const { decryptData } = useAuth()
  const [isLoading, setIsloading] = useState(false)
  const profile = decryptData('profile')
  if (profile !== 'admin') {
    return Navigate({ to: '/configuracoes' })
  }

  const [tempValue, setTempValue] = useState('')
  const [open, setOpen] = useState(false)
  const [webhookEdit, setWebhookEdit] = useState<webhookProps | null>(null)
  const [stateWebhook, setStateWebhook] = useState<webhookProps>({
    expDate: '',
    action: [],
    nomeApi: '',
    usuario: '',
    senha: '',
    baseURl: '',
  })

  const [webhooks, setWebhooks] = useState([])

  const handelEditWebhook = (webhook: webhookProps) => {
    setWebhookEdit(webhook)
    setStateWebhook(webhook)
    setOpen(true)
  }
  const columns = [
    { field: 'Descricao', headerName: 'desc', name: 'nomeApi' },
    { field: 'Usuario', headerName: 'usuario', name: 'usuario' },
    { field: 'Senha', headerName: 'senha', name: 'senha' },
    { field: 'Status', headerName: 'status', name: 'status' },
    { field: 'Link', headerName: 'baseURl', name: 'baseURl' },
    {
      field: 'Operações',
      headerName: 'oper',
      name: 'action',
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      renderCell: (params: any) => {
        return params.row?.join(', ') || ''
      },
    },
    {
      headerName: 'acoes',
      field: 'Ações',
      renderCell: (params: { row: { id: number }; webhook: webhookProps }) => (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
          className="flex justify-center space-x-2"
        >
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                handelEditWebhook(params.webhook)
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteApi(params.webhook)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]
  const handleOnChange = (value: string, acao: string) => {
    setStateWebhook(prev => ({
      ...prev,
      [acao]: acao === 'nomeApi' ? value.toUpperCase() : value,
    }))
  }
  const handleChangeInputChips = (value: string) => {
    setTempValue(value)
  }
  const handleDeleteInputChips = (chipToDelete: string) => {

    setStateWebhook(prev => ({
      ...prev,
      action: prev.action.filter(chip => chip !== chipToDelete),
    }))
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter' && tempValue.trim()) {
      if (TIPO_ACAO.includes(tempValue.toLowerCase().trim())) {
        setStateWebhook(prev => ({
          ...prev,
          action: [...prev.action, tempValue.trim()],
        }))
        setTempValue('')
        return
      }
      toast.error('Favor inserir apenas as opções aceitas para esse webhook')
    }
  }
  const handleSalvar = async () => {

    if (!stateWebhook.usuario.trim() || !stateWebhook.senha.trim()) {
      toast.info('Preencher todas as informações')
      return
    }
    try {
      setIsloading(true)
      const data = {
        ...stateWebhook,
        status: 'DESCONECTADA',
      }
      if (webhookEdit?.id) {
        const { data } = await UpdateApi(webhookEdit.id, stateWebhook)
        setWebhooks(prevApis =>
          prevApis.map(item => (item.id === webhookEdit?.id ? data : item))
        )
        setOpen(false)
        setIsloading(false)
        setWebhookEdit({
          expDate: '',
          action: [],
          nomeApi: '',
          usuario: '',
          senha: '',
          baseURl: '',
        })
        setStateWebhook({
          expDate: '',
          action: [],
          nomeApi: '',
          usuario: '',
          senha: '',
          baseURl: '',
        })
      } else {
        CriarWebhook(data)
          .then(_ => {
            listaWebhook()
            setOpen(false)
            setIsloading(false)
            setStateWebhook({
              expDate: '',
              action: [],
              nomeApi: '',
              usuario: '',
              senha: '',
              baseURl: '',
            })
          })
          .catch(err => Errors(err))
      }
    } catch (error) {
      Errors(error)
      setIsloading(false)
    } finally {
      setIsloading(false)
    }
  }

  const listaWebhook = useCallback(async () => {
    const { data } = await ListarWebhook()
    setWebhooks(data)

  }, [])

  // const handlConnectApi = async (api) => {
  //     try {
  //         await ConectarApi(api)
  //         listaWebhook()
  //     } catch (error) {
  //         Errors(error)
  //     }

  // }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    listaWebhook()
  }, [])
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleDeleteApi = (api: any) => {
    toast.info(`Atenção!! Deseja realmente deletar a api "${api.nomeApi}"?`, {
      position: 'top-center',
      cancel: {
        label: 'Cancel',
        onClick: () => console.log('Cancel!'),
      },
      action: {
        label: 'Confirma',
        onClick: () => {
          try {
            DeletarApi(api.id).then(_ => {
              toast.info('Api deleta')
              listaWebhook()
            })
          } catch (error) {
            Errors(error)
          }
        },
      },
    })
  }
  const handleCloseModalApi = () => {
    setWebhookEdit({
      expDate: '',
      action: [],
      nomeApi: '',
      usuario: '',
      senha: '',
      baseURl: '',
    })
    setStateWebhook({
      expDate: '',
      action: [],
      nomeApi: '',
      usuario: '',
      senha: '',
      baseURl: '',
    })
    setOpen(false)
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Webhooks</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpen(true)}
        >
          Adicionar
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell
                  key={col.headerName}
                  sx={{
                    width: `${100 / columns.length}%`,
                    flexGrow: 1,
                    textAlign: 'center',
                  }}
                >
                  {col.field}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {webhooks.map(webhook => (
              <TableRow key={webhook.id}>
                {columns.map(col => (
                  <TableCell
                    key={col.field}
                    sx={{
                      width: `${100 / columns.length}%`,
                      flexGrow: 1,
                      textAlign: 'center',
                    }}
                  >
                    {col.renderCell
                      ? col.renderCell({ row: webhook[col.name], webhook })
                      : webhook[col.name]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {open && (
        <Dialog open={open} fullWidth maxWidth="md">
          <DialogContent
            sx={{ display: 'flex', gap: 4, flexDirection: 'column' }}
          >
            <Typography variant="h4">
              {webhookEdit?.id ? 'Editar webhook' : 'Cadastrar webhook'}
            </Typography>
            <TextField
              variant="filled"
              label="Descricao api"
              value={stateWebhook?.nomeApi}
              onChange={e => handleOnChange(e.target.value, 'nomeApi')}
            />
            <Box sx={{ display: 'flex', gap: 4 }}>
              <TextField
                variant="filled"
                label="Usuario"
                value={stateWebhook?.usuario}
                onChange={e => handleOnChange(e.target.value, 'usuario')}
              />
              <TextField
                variant="filled"
                label="Senha"
                value={stateWebhook?.senha}
                onChange={e => handleOnChange(e.target.value, 'senha')}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Link"
                value={stateWebhook?.baseURl}
                onChange={e => handleOnChange(e.target.value, 'baseURl')}
              />
            </Box>
            <FormControl fullWidth>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {stateWebhook?.action?.map((chip, index) => (
                  <Chip
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
                    label={chip}
                    onDelete={() => handleDeleteInputChips(chip)}
                    sx={{ margin: '4px' }}
                  />
                ))}
                <TextField
                  label="Ações"
                  variant="filled"
                  value={tempValue || ''}
                  onChange={e => handleChangeInputChips(e.target.value)}
                  sx={{ width: '100%', margin: '4px' }}
                  onKeyDown={e => handleKeyDown(e)} // Lida com a tecla Enter
                />
                <Typography variant="caption">
                  Digite e pressione Enter - Opções disponiveis consulta,
                  agendamento, confirmacao, laudo, preparo
                </Typography>
              </Box>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              disabled={isLoading}
              color="success"
              onClick={() => handleSalvar()}
            >
              Salvar
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={isLoading}
              onClick={() => handleCloseModalApi()}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}
