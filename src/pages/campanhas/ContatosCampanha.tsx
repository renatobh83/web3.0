import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogContent,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { format, parseISO, sub } from 'date-fns'
import { CustomTableContainer } from '../../components/MaterialUi/CustomTable'
import { useCallback, useEffect, useState } from 'react'
import { RelatorioContatos } from '../../services/estatistica'
import { estadoPorDdd, estadosBR } from '../../utils/constants'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Delete } from '@mui/icons-material'
import {
  AdicionarContatosCampanha,
  DeletarContatoCampanha,
  DeletarTodosContatosCampanha,
  ListarContatosCampanha,
} from '../../services/campanhas'
import { toast } from 'sonner'

// interface ContatosCampanhaProps {
//     campanha: any
//     open: boolean
//     setClose: () => void
// }
export const ContatosCampanha = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { campanhaId } = useParams()
  if (!state) {
    return <Navigate to="/campanhas" />
  }

  const handleGoToCampanhas = () => {
    navigate('/campanhas') // Muda para a rota '/campanhas'
  }
  const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 10 })
  const [paginationModal, setPaginationModal] = useState({
    page: 0,
    rowsPerPage: 10,
  })

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
  const handlePageChangeModal = (_event: unknown, newPage: number) => {
    setPaginationModal(prev => ({ ...prev, page: newPage }))
  }

  const handleRowsPerPageChangeModal = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaginationModal({
      page: 0,
      rowsPerPage: Number.parseInt(event.target.value, 10),
    })
  }

  const [modalContato, setModalContato] = useState(false)
  const [contatosCampanha, setContatosCampanha] = useState([])
  const [campanha] = useState(state.campanha || '')
  const [contatos, setContatos] = useState([])
  const [pesquisa] = useState({
    startDate: format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    ddds: [],
    tags: [],
    wallets: [],
    searchParam: '',
  })
  const [ack] = useState({
    '-1': 'Error',
    0: 'Envio Pendente',
    1: 'Entrega Pendente',
    2: 'Recebida',
    3: 'Lida',
    4: 'Reproduzido',
  })

  const [contatosSelected, setContatosSelected] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectContact = contato => {


    if (
      contatosSelected.some(
        selectedContato => selectedContato.id === contato.id
      )
    ) {
      // Remove o contato se já estiver selecionado
      setContatosSelected(
        contatosSelected.filter(
          selectedContato => selectedContato.id !== contato.id
        )
      )
    } else {
      // Adiciona o contato completo ao estado
      setContatosSelected([...contatosSelected, contato])
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      // Se estiver selecionado, desmarcar todos
      setContatosSelected([])
    } else {
      // Seleciona todos os contatos completos
      setContatosSelected(contatos)
    }
    setSelectAll(!selectAll)
  }
  // const handleSelectContact = (contato) => {
  //     console.log(contato)
  //     if (contatosSelected.includes(contato.id)) {
  //         setContatosSelected(contatosSelected.filter(id => id !== contato.id));
  //     } else {
  //         setContatosSelected([...contatosSelected, contato.id]);
  //     }
  // };

  // const handleSelectAll = () => {
  //     if (selectAll) {
  //         setContatosSelected([]);
  //     } else {
  //         setContatosSelected(contatos.map(contato => contato.id));
  //     }
  //     setSelectAll(!selectAll);
  // };
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const listarAddContatos = useCallback(async () => {
    const { data } = await RelatorioContatos(pesquisa)
    setContatos(data.contacts)
  }, [])
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const listarContatosCampanha = useCallback(async () => {
    const { data } = await ListarContatosCampanha(campanhaId)
    setContatosCampanha(data)
  }, [])

  const definirEstadoNumero = numero => {
    const ddd = numero.substring(2, 4)
    return estadosBR.find(e => e.sigla === estadoPorDdd[ddd])?.nome || ''
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    listarAddContatos()
    listarContatosCampanha()
  }, [])
  const handleRemoverContatoCampanha = async contato => {
    DeletarContatoCampanha(campanhaId, contato.id).then(() => {
      toast.info('Contato excluído desta campanha')
      listarContatosCampanha()
    })
  }
  const columns = [
    {
      name: 'profilePicUrl',
      label: '',
      field: 'profilePicUrl',
      renderCell: ({ value }) => (
        <img
          src={value}
          alt="Profile"
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />
      ),
    },
    { name: 'name', label: 'Nome', field: 'name' },
    { name: 'number', label: 'WhatsApp', field: 'number' },
    {
      name: 'campaignContacts',
      label: 'Status',
      field: 'campaignContacts',
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      renderCell: (params: { value: any; contato: any }) =>
        params.value.length > 0
          ? ` ${ack[params.value[0].ack] || 'N/A'}`
          : 'N/A',
    },
    {
      name: 'tags',
      label: 'Etiquetas',
      field: 'tags',
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      renderCell: (params: { value: any; contato: any }) => {
        if (params.value && params.value.length > 0) {
          const tagsStr = params.value.map(tagObj => tagObj.tag).join(', ')
          return tagsStr || 'Sem etiquetas'
        }
        return 'Sem etiquetas'
      },
    },
    {
      name: 'estado',
      label: 'Estado',
      field: 'number',
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      renderCell: (params: { value: any; contato: any }) =>
        definirEstadoNumero(params.value),
    },
    {
      name: 'acoes',
      label: 'Ações',
      field: 'acoes',
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      renderCell: (params: { value: any; contato: any }) => (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
          className="flex justify-center space-x-2"
        >
          <Tooltip title="Remover usuario da campanha">
            <IconButton
              onClick={() => handleRemoverContatoCampanha(params.contato)}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]
  const columnsAdd = [
    {
      name: 'checkbox',
      label: <Checkbox checked={selectAll} onChange={handleSelectAll} />,
      field: 'checkbox',
    },
    { name: 'profilePicUrl', label: '', field: 'profilePicUrl' },
    { name: 'name', label: 'Nome', field: 'name' },
    { name: 'number', label: 'WhatsApp', field: 'number' },
    {
      name: 'estado',
      label: 'Estado',
      field: 'number',
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      renderCell: (params: { value: any; contato: any }) =>
        definirEstadoNumero(params.value),
    },
  ]
  const handlCloseModalAddContato = () => {
    setContatosSelected([])
    setModalContato(false)
    setSelectAll(false)
  }
  const handledeletarTodosContatosCampanha = () => {
    toast.info(
      'Atenção!! Deseja realmente retirar todos os contatos desta campanha? ',
      {
        cancel: {
          label: 'Cancel',
          onClick: () => console.log('Cancel!'),
        },
        action: {
          label: 'Confirma',
          onClick: () => {
            DeletarTodosContatosCampanha(campanhaId).then(() => {
              listarContatosCampanha()
              toast.info('Contato excluído desta campanha')
            })
          },
        },
      }
    )
  }

  const addContatosCampanha = async () => {
    if (!contatosSelected.length) {
      return toast.error('Nenhum contato selecionado')
    }
    try {
      await AdicionarContatosCampanha(contatosSelected, campanhaId)
      listarContatosCampanha()
      setContatosSelected([])
      setModalContato(false)
      setSelectAll(false)
    } catch (error) { }
  }
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 2 }}
      >
        <Card>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6">Campanha : {campanha.name}</Typography>
              <Typography>
                Início: {format(parseISO(campanha.start), 'dd/MM/yyyy HH:mm')} -
                Status {campanha.status}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleGoToCampanhas()}
              startIcon={<ArrowLeft />}
            >
              Listar Campanhas
            </Button>
          </Box>
        </Card>

        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Contatos</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => setModalContato(true)}
              >
                Adicionar contato
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handledeletarTodosContatosCampanha()}
              >
                Limpar campanha
              </Button>
            </Box>
          </Box>
          <CustomTableContainer sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                {columns.map(col => (
                  <TableCell
                    key={col.name}
                    sx={{
                      width: `${100 / columns.length}%`,
                      flexGrow: 1,
                      textAlign: 'center',
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {contatosCampanha?.map(contato => (
                <TableRow key={contato.id}>
                  {columns.map(col => (
                    <TableCell
                      key={col.name}
                      sx={{
                        width: `${100 / columns.length}%`,
                        flexGrow: 1,
                        textAlign: 'center',
                      }}
                    >
                      {
                        col.renderCell
                          ? col.renderCell({
                            value: contato[col.field],
                            contato,
                          }) // Usa o renderCell se estiver definido
                          : typeof contato[col.field] === 'object' &&
                            contato[col.field] !== null
                            ? JSON.stringify(contato[col.field]) // Formata se for objeto
                            : contato[col.field] // Caso contrário, renderiza diretamente
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </CustomTableContainer>
          <TablePagination
            component="div"
            count={contatosCampanha.length}
            page={pagination.page}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </CardContent>
      </Box>
      {modalContato && (
        <Dialog open={modalContato} fullWidth maxWidth="md">
          <DialogContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h4">Selecionar Contatos</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  onClick={() => addContatosCampanha()}
                  variant="contained"
                  color="success"
                >
                  Adiconar
                </Button>
                <Button
                  onClick={() => handlCloseModalAddContato()}
                  variant="contained"
                  color="error"
                >
                  Cancelar
                </Button>
              </Box>
            </Box>

            <CustomTableContainer sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  {columnsAdd.map(col => (
                    <TableCell
                      key={col.name}
                      sx={{
                        width: `${100 / columnsAdd.length}%`,
                        flexGrow: 1,
                        textAlign: 'center',
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {contatos.map(contato => (
                  <TableRow key={contato.id}>
                    {columnsAdd.map(col => (
                      <TableCell
                        key={col.name}
                        sx={{
                          width: `${100 / columnsAdd.length}%`,
                          flexGrow: 1,
                          textAlign: 'center',
                        }}
                      >
                        {col.name === 'checkbox' ? (
                          <Checkbox
                            checked={contatosSelected.some(
                              selectedContato =>
                                selectedContato.id === contato.id
                            )} // Verifica se o contato já está selecionado
                            onChange={() => handleSelectContact(contato)}
                          />
                        ) : col.renderCell ? (
                          col.renderCell({ value: contato[col.field], contato })
                        ) : (
                          contato[col.field]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </CustomTableContainer>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {contatosSelected.length > 0 ? (
                <Typography>
                  {contatosSelected.length} registro selecionado.
                </Typography>
              ) : (
                <Box />
              )}
              <TablePagination
                component="div"
                count={contatos.length}
                page={paginationModal.page}
                onPageChange={handlePageChangeModal}
                rowsPerPage={paginationModal.rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChangeModal}
              />
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  )
}
