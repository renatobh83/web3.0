// import styled from '@emotion/styled'
// import {
//   Box,
//   Button,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Tooltip,
//   Typography,
// } from '@mui/material'
// import { ModalFila } from './ModalFila'
// import { useCallback, useEffect, useState } from 'react'
// import { DeletarFila, ListarFilas } from '../../services/filas'
// import { Check, Close, Delete, Edit } from '@mui/icons-material'
// import { red } from '@mui/material/colors'
// import { toast } from 'sonner'
// import { update } from 'lodash'
// import { CustomTableContainer } from '../../components/MaterialUi/CustomTable'

// export const Filas = () => {
//   const [open, setOpen] = useState(false)

//   const [filas, setFilas] = useState([])
//   const [filaSelecionada, setFilaSelecionada] = useState({})

//   const handleFilasUpdate = (novaFila: any) => {
//     if (filaSelecionada?.id) {
//       setFilas(prev => {
//         const index = prev.findIndex(fila => fila.id === filaSelecionada.id)
//         const updateFila = [...prev]
//         updateFila[index] = novaFila
//         return updateFila
//       })
//     } else {
//       setFilas(prevFilas => [...prevFilas, novaFila])
//     }
//   }
//   const closeModal = () => {
//     setOpen(false)
//     setFilaSelecionada({})
//   }
//   const handleEditarFila = fila => {
//     setFilaSelecionada(fila)
//     setOpen(true)
//   }
//   const listarFilas = useCallback(async () => {
//     const { data } = await ListarFilas()

//     setFilas(data)
//   }, [])

//   const handleDeleteFila = (fila: any) => {
//     toast.info(`Atenção!! Deseja realmente deletar a fila "${fila.queue}"?`, {
//       position: 'top-center',
//       cancel: {
//         label: 'Cancel',
//         onClick: () => console.log('Cancel!'),
//       },
//       action: {
//         label: 'Confirma',
//         onClick: () => {
//           DeletarFila({ id: fila.id }).then(data => {
//             let newFilas = [...filas]
//             newFilas = newFilas.filter(f => f.id !== fila.id)
//             setFilas(newFilas)
//           })
//         },
//       },
//     })
//   }
//   useEffect(() => {
//     listarFilas()
//   }, [])
//   const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 10 })
//   const handlePageChange = (event: unknown, newPage: number) => {
//     setPagination(prev => ({ ...prev, page: newPage }))
//   }

//   const handleRowsPerPageChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setPagination({
//       page: 0,
//       rowsPerPage: Number.parseInt(event.target.value, 10),
//     })
//   }
//   return (
//     <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <Typography variant="h6">Filas</Typography>
//         <Button
//           variant="contained"
//           color="secondary"
//           onClick={() => setOpen(true)}
//         >
//           Adicionar
//         </Button>
//       </Box>
//       <CustomTableContainer sx={{ mt: 2 }}>
//         <TableHead>
//           <TableRow>
//             <TableCell>#</TableCell>
//             <TableCell>Fila</TableCell>
//             <TableCell>Ativo</TableCell>
//             <TableCell sx={{ textAlign: 'center' }}>Ações</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {filas
//             .slice(
//               pagination.page * pagination.rowsPerPage,
//               pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
//             )
//             .map(fila => (
//               <TableRow key={fila.id}>
//                 <TableCell>{fila.id}</TableCell>
//                 <TableCell>{fila.queue.toUpperCase()}</TableCell>
//                 <TableCell>{fila.isActive ? <Check /> : <Close />}</TableCell>
//                 <TableCell>
//                   <Box
//                     sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
//                   >
//                     <Tooltip title="Editar fila">
//                       <IconButton onClick={() => handleEditarFila(fila)}>
//                         <Edit />
//                       </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Apagar fila">
//                       <IconButton onClick={() => handleDeleteFila(fila)}>
//                         <Delete sx={{ color: red[400] }} />
//                       </IconButton>
//                     </Tooltip>
//                   </Box>
//                 </TableCell>
//               </TableRow>
//             ))}
//         </TableBody>
//       </CustomTableContainer>
//       <TablePagination
//         component="div"
//         count={filas.length}
//         page={pagination.page}
//         onPageChange={handlePageChange}
//         rowsPerPage={pagination.rowsPerPage}
//         onRowsPerPageChange={handleRowsPerPageChange}
//       />
//       {open && (
//         <ModalFila
//           open={open}
//           closeModal={closeModal}
//           filaSelecionada={filaSelecionada}
//           updateFilas={handleFilasUpdate}
//         />
//       )}
//     </Box>
//   )
// }

import {
  Box,
  Button,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { ModalFila } from './ModalFila';
import { useCallback, useEffect, useState } from 'react';
import { DeletarFila, ListarFilas } from '../../services/filas';
import { Check, Close, Delete, Edit } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import { toast } from 'sonner';
import { CustomTableContainer } from '../../components/MaterialUi/CustomTable';

interface Fila {
  id: string;
  queue: string;
  isActive: boolean;
}

export const Filas = () => {
  const [open, setOpen] = useState(false);
  const [filas, setFilas] = useState<Fila[]>([]);
  const [filaSelecionada, setFilaSelecionada] = useState<Fila | null>(null);
  const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 10 });

  const handleFilasUpdate = (novaFila: Fila) => {
    setFilas(prev =>
      filaSelecionada?.id
        ? prev.map(fila => (fila.id === filaSelecionada.id ? novaFila : fila))
        : [...prev, novaFila]
    );
  };

  const closeModal = () => {
    setOpen(false);
    setFilaSelecionada(null);
  };

  const handleEditarFila = (fila: Fila) => {
    setFilaSelecionada(fila);
    setOpen(true);
  };

  const listarFilas = useCallback(async () => {
    try {
      const { data } = await ListarFilas();
      setFilas(data);
    } catch (error) {
      console.error("Erro ao listar filas:", error);
      toast.error("Erro ao carregar filas.");
    }
  }, []);

  const handleDeleteFila = async (fila: Fila) => {
    const confirmed = window.confirm(`Deseja realmente deletar a fila "${fila.queue}"?`);
    if (confirmed) {
      try {
        await DeletarFila({ id: fila.id });
        setFilas(prev => prev.filter(f => f.id !== fila.id));
        toast.success("Fila deletada com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar fila:", error);
        toast.error("Erro ao deletar fila.");
      }
    }
  };

  useEffect(() => {
    listarFilas();
  }, [listarFilas]);

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination({ page: 0, rowsPerPage: Number.parseInt(event.target.value, 10) });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Filas</Typography>
        <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>
          Adicionar
        </Button>
      </Box>
      <CustomTableContainer sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Fila</TableCell>
            <TableCell>Ativo</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filas
            .slice(
              pagination.page * pagination.rowsPerPage,
              pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
            )
            .map(fila => (
              <TableRow key={fila.id}>
                <TableCell>{fila.id}</TableCell>
                <TableCell>{fila.queue.toUpperCase()}</TableCell>
                <TableCell>{fila.isActive ? <Check /> : <Close />}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title="Editar fila">
                      <IconButton onClick={() => handleEditarFila(fila)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Apagar fila">
                      <IconButton onClick={() => handleDeleteFila(fila)}>
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
        count={filas.length}
        page={pagination.page}
        onPageChange={handlePageChange}
        rowsPerPage={pagination.rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      {open && (
        <ModalFila
          open={open}
          closeModal={closeModal}
          filaSelecionada={filaSelecionada ?? { queue: '', isActive: true }}
          updateFilas={handleFilasUpdate}
        />
      )}
    </Box>
  );
};
