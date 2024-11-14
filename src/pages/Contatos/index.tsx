import {
  Avatar,
  Box,
  Button,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import { useCallback, useEffect, useState } from 'react'
import { useContatosStore } from '../../store/contatos'
import { useWhatsappStore } from '../../store/whatsapp'
import { Delete, Edit, WhatsApp } from '@mui/icons-material'

import { ModalNovoTicket } from '../Atendimento/ModalNovoTicket'
import { DeletarContato, ListarContatos } from '../../services/contatos'
import { ContatoModal } from './ModalContato'
import { toast } from 'sonner'

const CustomTableContainer = styled(Table)(({ theme }) => ({
  // Customize styles with Tailwind CSS classes
  padding: theme.spacing(2),
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  '& .MuiTableCell-root': {
    padding: theme.spacing(1),
  },
}))
export const Contatos: React.FC<{
  isChatContact?: boolean
}> = ({ isChatContact = false }) => {
  const [openModalNovoTicket, setOpenModalNovoTicket] = useState(false)
  const handleSaveTicket = async contact => {
    if (!contact.id) return
    setContatoSelecionado(contact)
    setOpenModalNovoTicket(true)
  }
  const columns = [
    {
      name: 'profilePicUrl',
      label: '',
      field: 'profilePicUrl',
      renderCell: (params: { value: string | undefined }) => (
        <Box
          sx={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 1,
            overflow: 'hidden',
          }}
        >
          {params.value ? (
            <Box
              component={'img'}
              sx={{ objectFit: 'cover', width: '100%', height: '100%' }}
              src={params.value}
              alt="Profile"
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <Avatar />
            </Box>
          )}
        </Box>
      ),
    },
    {
      name: 'name',
      label: 'Nome',
      field: 'name',
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      format: (_v: any, r: { number: any; name: any; pushname: any }) =>
        r.number && r.name === r.number && r.pushname ? r.pushname : r.name,
    },
    {
      name: 'number',
      label: 'WhatsApp',
      field: 'number',
    },
    {
      name: 'wallet',
      label: 'Carteira',
      field: 'wallet',
    },
    {
      name: 'tags',
      label: 'Etiquetas',
      field: 'tags',
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      renderCell: (params: { value: any }) => (
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        <div dangerouslySetInnerHTML={{ __html: params.value }} />
      ),
    },
    {
      name: 'email',
      label: 'Email',
      field: 'email',
    },

    {
      name: 'birthdayDate',
      label: 'Aniversário',
      field: 'birthdayDate',
    },

    {
      name: 'acoes',
      label: 'Ações',
      field: 'acoes',
      renderCell: (params: { row }) => (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
          className="flex justify-center space-x-2"
        >
          {params.row.number && cSessionsWpp().length > 0 && (
            <Tooltip title="Abrir ticket">
              <IconButton
                onClick={() => {
                  handleSaveTicket(params.row)
                }}
              >
                <WhatsApp />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]
  function cSessionsWpp() {
    return whatsapp.filter(
      w =>
        ['whatsapp'].includes(w.type) &&
        !w.isDeleted &&
        w.status === 'CONNECTED'
    )
  }
  const closeModalNovoTicket = () => {
    setOpenModalNovoTicket(false)
    setContatoSelecionado({})
  }
  const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 10 })
  const [filter, setFilter] = useState('')
  const { contatos, loadContacts } = useContatosStore()
  const whatsapp = useWhatsappStore(s => s.whatsApps)
  const [contatoSelecionado, setContatoSelecionado] = useState({})

  const [modalOpen, setModalOpen] = useState(false)
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

  const handleEdit = contato => {
    setContatoSelecionado(contato)
    setModalOpen(true)
  }

  const handleDelete = contato => {
    toast.message(
      `Atenção!! Deseja realmente deletar o contto "${contato.name}"?`,
      {
        description: '',
        position: 'top-center',
        cancel: {
          label: 'Cancel',
          onClick: () => console.log('Cancel!'),
        },
        action: {
          label: 'Confirma',
          onClick: () => {
            DeletarContato(contato.id).then(async _data => {
              toast.success('Contato apagado', {
                position: 'top-center',
              })
              console.log(contatos)
            })
          },
        },
      }
    )
  }
  const closeModal = () => {
    setModalOpen(false)
    setContatoSelecionado(null)
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const listaContatos = useCallback(async () => {
    const { data } = await ListarContatos({})
    loadContacts(data.contacts)
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!contatos.length) listaContatos()
  }, [])

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { sm: '100%', md: '1700px' },
        px: 2,
        pt: 2,
      }}
    >
      {isChatContact && <Toolbar />}

      <Box
        sx={{ display: 'flex', p: 2, gap: 1, justifyContent: 'space-between' }}
      >
        <Typography component="h2" variant="h6">
          Contatos
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Localize"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        // InputProps={{
        //   startAdornment: <SearchIcon />,
        // }}
        />
        <Box sx={{ gap: 2, display: { sm: 'none', xs: 'none', md: 'flex' }, }}>
          {/*        <Button
            sx={{ display: isChatContact ? 'none' : 'flex' }}
            variant="contained"
            color="warning"
            // onClick={handleImport}
            startIcon={<ImportExportIcon />}
          >
            Importar
          </Button>
          <Button
            sx={{ display: isChatContact ? 'none' : 'flex' }}
            variant="contained"
            color="warning"
            // onClick={handleExport}
            startIcon={<ImportExportIcon />}
          >
            Exportar
          </Button> */}
          <Button
            variant="contained"
            color="success"
            onClick={() => setModalOpen(true)}
          >
            Adicionar
          </Button>
        </Box>
      </Box>
      <CustomTableContainer
        // component={'table'}
        sx={{ mt: '4px' }}
        id={`tabela-contatos-${isChatContact ? 'atendimento' : ''}`}
      >
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
          {contatos
            ?.filter(row =>
              row?.name?.toLowerCase().includes(filter.toLowerCase())
            )
            .slice(
              pagination.page * pagination.rowsPerPage,
              pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
            )
            .map(row => (
              <TableRow key={row.id}>
                {columns.map(col => (
                  <TableCell
                    key={col.field}
                    sx={{ width: `${100 / columns.length}%`, flexGrow: 1 }}
                  >
                    {col.renderCell
                      ? col.renderCell({ value: row[col.field], row })
                      : row[col.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </CustomTableContainer>
      <TablePagination
        component="div"
        count={contatos.length}
        page={pagination.page}
        onPageChange={handlePageChange}
        rowsPerPage={pagination.rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      {openModalNovoTicket && (
        <ModalNovoTicket
          open={openModalNovoTicket}
          close={closeModalNovoTicket}
          isContact={contatoSelecionado}
        />
      )}
      {modalOpen && (
        <ContatoModal
          open={modalOpen}
          close={closeModal}
          contact={contatoSelecionado}
        />
      )}
    </Box>
  )
}
