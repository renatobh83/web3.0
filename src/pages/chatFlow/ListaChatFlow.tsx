import {
  Box,
  Typography,
  Button,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  IconButton,
  Tooltip,
  TablePagination,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { ModalChatFlow } from './ModalChatFlow'
import { CustomTableContainer } from '../../components/MaterialUi/CustomTable'
import { DeletarChatFlow, ListarChatFlow } from '../../services/chatflow'
import { Delete, Edit } from '@mui/icons-material'
import { red } from '@mui/material/colors'
import LanIcon from '@mui/icons-material/Lan'
import useChatFlowStore from '../../store/chatFlow'
import { ListarFilas } from '../../services/filas'
import { ListarUsuarios } from '../../services/user'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Errors } from '../../utils/error'

export const ListaChatFlow: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [flowSelecionado, setFlowSelecionado] = useState({})
  const [chatFlows, setChatFlows] = useState([])
  const { setFlowData } = useChatFlowStore()
  const nav = useNavigate()

  const closeModal = () => {
    setOpen(false)
    if ('id' in flowSelecionado && flowSelecionado.id) {
      setFlowSelecionado({})
    }
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleEditarFlow = (flow: any) => {
    setOpen(true)
    setFlowSelecionado(flow)
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleFlowCreateOrUpdate = (novoFlow: any) => {
    if ('id' in flowSelecionado && flowSelecionado?.id) {
      setChatFlows(prev => {
        const index = prev.findIndex(flow => flow.id === flowSelecionado.id)
        const updateFlow = [...prev]
        updateFlow[index] = novoFlow
        return updateFlow
      })
    } else {
      setChatFlows(prevFlow => [...prevFlow, novoFlow])
    }
  }
  const listaChatFlow = useCallback(async () => {
    try {
      const { data } = await ListarChatFlow()
      setChatFlows(data.chatFlow)
    } catch (error) {
      Errors(error)
    }

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

  const handleOpenFlow = (ChatFlow: any) => {
    setFlowData({
      flow: ChatFlow,
      usuarios,
      filas,
    })
    nav('builder')
  }
  const handleDeleteFlow = (chatFlow: any) => {
    toast.info(
      `Atenção!! Deseja realmente deletar o chatFlow "${chatFlow.name}"?`,
      {
        position: 'top-center',
        cancel: {
          label: 'Cancel',
          onClick: () => console.log('Cancel!'),
        },
        action: {
          label: 'Confirma',
          onClick: () => {
            DeletarChatFlow(chatFlow).then(() => {
              let NewchatFlows = [...chatFlows]
              NewchatFlows = NewchatFlows.filter(f => f.id !== chatFlow.id)
              setChatFlows(NewchatFlows)
            })
          },
        },
      }
    )
  }
  const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 10 })
  const handlePageChange = (_event: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPagination({
      page: 0,
      rowsPerPage: Number.parseInt(event.target.value, 10),
    })
  }
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Fluxos</Typography>
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
          <TableRow>

            <TableCell>Fluxo Id</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Celular Teste</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chatFlows
            .slice(
              pagination.page * pagination.rowsPerPage,
              pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
            )
            .map(chatFlow => (
              <TableRow key={chatFlow.id}>
                <TableCell>{chatFlow.id}</TableCell>
                <TableCell>{chatFlow.name}</TableCell>
                <TableCell>{chatFlow.isActive ? 'Ativo' : 'Inativo'}</TableCell>
                <TableCell>{chatFlow.celularTeste}</TableCell>
                <TableCell>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
                  >
                    <Tooltip title="Editar flow">
                      <IconButton onClick={() => handleEditarFlow(chatFlow)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Abrir Fluxo">
                      <IconButton onClick={() => handleOpenFlow(chatFlow)}>
                        <LanIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Apagar Flow">
                      <IconButton onClick={() => handleDeleteFlow(chatFlow)}>
                        <Delete sx={{ color: red[400] }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </CustomTableContainer>
      <TablePagination
        component="div"
        count={chatFlows.length}
        page={pagination.page}
        onPageChange={handlePageChange}
        rowsPerPage={pagination.rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {open && (
        <ModalChatFlow
          open={open}
          closeModal={closeModal}
          flowSelecionado={flowSelecionado}
          updateFlow={handleFlowCreateOrUpdate}
        />
      )}
    </Box>
  )
}
