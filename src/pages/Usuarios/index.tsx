// import { Close, Edit, QueueSharp } from "@mui/icons-material"
// import { Box, Button, IconButton, styled, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from "@mui/material"
// import { useUsuarioStore } from "../../store/usuarios";
// import { useCallback, useEffect, useState } from "react";
// import { DeleteUsuario, ListarUsuarios } from "../../services/user";
// import { ListarFilas } from "../../services/filas";
// import { toast } from "sonner";
// import { ModalUsuario, type Usuario } from "./ModalUsuario";
// import { CustomTableContainer } from "../../components/MaterialUi/CustomTable";


// const optionsProfile = [
//     { value: "user", label: "Usuário" },
//     { value: "super", label: "Supervisor" },
//     { value: "admin", label: "Administrador" },
// ];



// export const Usuarios: React.FC = () => {
//     const {
//         usuarios,
//         editarUsuario,
//         deletarUsuario,
//         toggleModalUsuario,
//         setUsuarioSelecionado,
//         loadUsuarios,
//         toggleModalFilaUsuario,
//     } = useUsuarioStore();
//     const [filter, setFilter] = useState("");
//     const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 10 });
//     const [loading, setLoading] = useState(false);
//     const [filas, setFilas] = useState([]);
//     const [params, setParams] = useState({
//         pageNumber: 1,
//         searchParam: null,
//         hasMore: true,
//     });

//     const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFilter(e.target.value);
//     };

//     const handlePageChange = (event: unknown, newPage: number) => {
//         setPagination((prev) => ({ ...prev, page: newPage }));
//     };

//     const handleRowsPerPageChange = (
//         event: React.ChangeEvent<HTMLInputElement>,
//     ) => {
//         setPagination({ page: 0, rowsPerPage: Number.parseInt(event.target.value, 10) });
//     };

//     const filteredUsuarios = usuarios.filter((user) =>
//         user.name.toLowerCase().includes(filter.toLowerCase()),
//     );
//     // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
//     const listarUsuarios = useCallback(async () => {
//         setLoading(true);
//         const { data } = await ListarUsuarios(params);

//         loadUsuarios(data.users);
//         setParams((prev) => {
//             return {
//                 ...prev,
//                 hasMore: data.hasMore,
//             };
//         });
//         setLoading(false);
//     }, []);
//     const listarFilas = useCallback(async () => {
//         const { data } = await ListarFilas();
//         setFilas(data);
//     }, []);
//     // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
//     useEffect(() => {
//         listarFilas();
//         listarUsuarios();
//     }, []);

//     const gerirFilasUsuario = (usuario: Usuario) => {
//         setUsuarioSelecionado(usuario);
//         toggleModalFilaUsuario();
//     };
//     const handlEditarUsuario = (usuario: Usuario) => {
//         setUsuarioSelecionado(usuario);
//         toggleModalUsuario();
//     };
//     const handleDeleteUsuario = (usuario: Usuario) => {
//         toast.info(
//             `Atenção!! Deseja realmente deletar o usuario "${usuario.name}"?`,
//             {
//                 position: "top-center",
//                 cancel: {
//                     label: "Cancel",
//                     onClick: () => console.log("Cancel!"),
//                 },
//                 action: {
//                     label: "Confirma",
//                     onClick: () => {
//                         DeleteUsuario(usuario.id).then(() => {
//                             toast.success("Usuario apagado", {
//                                 position: "top-center",
//                             });
//                             listarUsuarios()
//                         });
//                     },
//                 },
//             },
//         );
//     };

//     return (
//         <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
//                 <Typography variant="h6">Usuarios</Typography>
//                 <TextField
//                     label="Localize"
//                     variant="standard"
//                     size="small"
//                     sx={{ width: { xs: '200px', sm: '320px' } }}
//                     value={filter}
//                     onChange={handleFilterChange}
//                 />
//                 <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={() => {
//                         setUsuarioSelecionado(null);
//                         toggleModalUsuario();
//                     }}
//                 >
//                     Adicionar
//                 </Button>
//             </Box>
//             <CustomTableContainer sx={{ mt: 2, }}>
//                 <TableHead>
//                     <TableRow >
//                         <TableCell>ID</TableCell>
//                         <TableCell>Nome</TableCell>
//                         <TableCell>Perfil</TableCell>
//                         <TableCell sx={{ textAlign: 'center' }}>Ações</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {filteredUsuarios
//                         .slice(
//                             pagination.page * pagination.rowsPerPage,
//                             pagination.page * pagination.rowsPerPage +
//                             pagination.rowsPerPage,
//                         )
//                         .map((usuario) => (
//                             <TableRow key={usuario.id}>
//                                 <TableCell>{usuario.id}</TableCell>
//                                 <TableCell>{usuario.name}</TableCell>
//                                 <TableCell>{usuario.profile}</TableCell>
//                                 <TableCell>
//                                     <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }} className="flex space-x-2 justify-center">
//                                         <Tooltip title="Gestão de Filas do usuário">
//                                             <IconButton
//                                                 onClick={() => gerirFilasUsuario(usuario)}
//                                             >
//                                                 <QueueSharp />
//                                             </IconButton>
//                                         </Tooltip>
//                                         <Tooltip title="Editar usuário">
//                                             <IconButton
//                                                 onClick={() => handlEditarUsuario(usuario)}
//                                             >
//                                                 <Edit />
//                                             </IconButton>
//                                         </Tooltip>
//                                         <Tooltip title="Apagar usuário">
//                                             <IconButton
//                                                 onClick={() => handleDeleteUsuario(usuario)}
//                                             >
//                                                 <Close />
//                                             </IconButton>
//                                         </Tooltip>
//                                     </Box>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                 </TableBody>

//             </CustomTableContainer>
//             <TablePagination
//                 component="div"
//                 count={filteredUsuarios.length}
//                 page={pagination.page}
//                 onPageChange={handlePageChange}
//                 rowsPerPage={pagination.rowsPerPage}
//                 onRowsPerPageChange={handleRowsPerPageChange}
//             />

//         </Box >
//     )
// }
import { Close, Edit, QueueSharp } from "@mui/icons-material";
import {
    Box,
    Button,
    IconButton,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { useUsuarioStore } from "../../store/usuarios";
import { useCallback, useEffect, useState, useMemo } from "react";
import { DeleteUsuario, ListarUsuarios } from "../../services/user";
// import { ListarFilas } from "../../services/filas";
import { toast } from "sonner";
import type { Usuario } from "./ModalUsuario";
import { CustomTableContainer } from "../../components/MaterialUi/CustomTable";

// const optionsProfile = [
//     { value: "user", label: "Usuário" },
//     { value: "super", label: "Supervisor" },
//     { value: "admin", label: "Administrador" },
// ];

export const Usuarios: React.FC = () => {
    const {
        usuarios,
        toggleModalUsuario,
        setUsuarioSelecionado,
        loadUsuarios,
        toggleModalFilaUsuario,
    } = useUsuarioStore();

    const [filter, setFilter] = useState("");
    const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 10 });

    // const [filas, setFilas] = useState([]);
    // const [params, setParams] = useState({
    //     pageNumber: 1,
    //     searchParam: null,
    //     hasMore: true,
    // });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value);

    const handlePageChange = (_event: unknown, newPage: number) =>
        setPagination((prev) => ({ ...prev, page: newPage }));

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setPagination({ page: 0, rowsPerPage: Number.parseInt(event.target.value, 10) });

    const filteredUsuarios = useMemo(() => {
        return usuarios.filter((user) =>
            user.name.toLowerCase().includes(filter.toLowerCase())
        );
    }, [filter, usuarios]);


    const listarUsuarios = useCallback(async () => {
        try {
            const { data } = await ListarUsuarios();
            loadUsuarios(data.users);
            // setParams((prev) => ({ ...prev, hasMore: data.hasMore }));
        } catch (error) {
            toast.error("Erro ao listar usuários");
        }
    }, [loadUsuarios]);

    // const listarFilas = useCallback(async () => {
    //     try {
    //         const { data } = await ListarFilas();
    //         setFilas(data);
    //     } catch (error) {
    //         toast.error("Erro ao listar filas");
    //     }
    // }, []);

    useEffect(() => {
        // listarFilas();
        listarUsuarios();
    }, [listarUsuarios]);

    const handleManageUserQueues = (usuario: Usuario) => {
        setUsuarioSelecionado(usuario);
        toggleModalFilaUsuario();
    };

    const handleEditUser = (usuario: Usuario) => {
        setUsuarioSelecionado(usuario);
        toggleModalUsuario();
    };

    const handleDeleteUser = (usuario: Usuario) => {
        toast.info(`Atenção!! Deseja realmente deletar o usuario "${usuario.name}"?`, {
            position: "top-center",
            cancel: {
                label: "Cancelar",
                onClick: () => console.log('Cancel!'),
            },
            action: {

                label: "Confirmar",
                onClick: async () => {
                    try {
                        await DeleteUsuario(usuario.id);
                        toast.success("Usuário apagado", { position: "top-center" });
                        listarUsuarios();
                    } catch (error) {
                        toast.error("Erro ao apagar usuário");
                    }
                },
            },
        });
    };

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Usuarios</Typography>
                <TextField
                    label="Localize"
                    variant="standard"
                    size="small"
                    sx={{ width: { xs: '200px', sm: '320px' } }}
                    value={filter}
                    onChange={handleFilterChange}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        setUsuarioSelecionado(null);
                        toggleModalUsuario();
                    }}
                >
                    Adicionar
                </Button>
            </Box>
            <CustomTableContainer sx={{ mt: 2 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>Perfil</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredUsuarios
                        .slice(
                            pagination.page * pagination.rowsPerPage,
                            pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
                        )
                        .map((usuario) => (
                            <TableRow key={usuario.id}>
                                <TableCell>{usuario.id}</TableCell>
                                <TableCell>{usuario.name}</TableCell>
                                <TableCell>{usuario.profile}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <Tooltip title="Gestão de Filas do usuário">
                                            <IconButton onClick={() => handleManageUserQueues(usuario)}>
                                                <QueueSharp />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar usuário">
                                            <IconButton onClick={() => handleEditUser(usuario)}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Apagar usuário">
                                            <IconButton onClick={() => handleDeleteUser(usuario)}>
                                                <Close />
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
                count={filteredUsuarios.length}
                page={pagination.page}
                onPageChange={handlePageChange}
                rowsPerPage={pagination.rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </Box>
    );
};
