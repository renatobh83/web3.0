import { Edit } from "@mui/icons-material"
import { Box, Button, IconButton, styled, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from "@mui/material"
import { useUsuarioStore } from "../../store/usuarios";
import { useCallback, useEffect, useState } from "react";
import { DeleteUsuario, ListarUsuarios } from "../../services/user";
import { ListarFilas } from "../../services/filas";
import { toast } from "sonner";
import { ModalUsuario, type Usuario } from "./ModalUsuario";



const CustomTableContainer = styled(Table)(({ theme }) => ({
    // Customize styles with Tailwind CSS classes
    padding: theme.spacing(2),
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    '& .MuiTableCell-root': {
        padding: theme.spacing(1),
    },
}))

export const Usuarios: React.FC = () => {
    const {
        usuarios,
        editarUsuario,
        deletarUsuario,
        toggleModalUsuario,
        setUsuarioSelecionado,
        loadUsuarios,
        toggleModalFilaUsuario,
    } = useUsuarioStore();
    const [filter, setFilter] = useState("");
    const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 10 });
    const [loading, setLoading] = useState(false);
    const [filas, setFilas] = useState([]);
    const [params, setParams] = useState({
        pageNumber: 1,
        searchParam: null,
        hasMore: true,
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
    };

    const handlePageChange = (event: unknown, newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleRowsPerPageChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPagination({ page: 0, rowsPerPage: Number.parseInt(event.target.value, 10) });
    };

    const filteredUsuarios = usuarios.filter((user) =>
        user.name.toLowerCase().includes(filter.toLowerCase()),
    );
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const listarUsuarios = useCallback(async () => {
        setLoading(true);
        const { data } = await ListarUsuarios(params);
        loadUsuarios(data.users);
        setParams((prev) => {
            return {
                ...prev,
                hasMore: data.hasMore,
            };
        });
        setLoading(false);
    }, []);
    const listarFilas = useCallback(async () => {
        const { data } = await ListarFilas();
        setFilas(data);
    }, []);
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        listarFilas();
        listarUsuarios();
    }, []);

    const gerirFilasUsuario = (usuario: Usuario) => {
        setUsuarioSelecionado(usuario);
        toggleModalFilaUsuario();
    };
    const handlEditarUsuario = (usuario: Usuario) => {
        setUsuarioSelecionado(usuario);
        toggleModalUsuario();
    };
    const handleDeleteUsuario = (usuario: Usuario) => {
        toast.info(
            `Atenção!! Deseja realmente deletar o usuario "${usuario.name}"?`,
            {
                position: "top-right",
                cancel: {
                    label: "Cancel",
                    onClick: () => console.log("Cancel!"),
                },
                action: {
                    label: "Confirma",
                    onClick: () => {
                        DeleteUsuario(usuario.id).then(() => {
                            toast.success("Usuario apagado", {
                                position: "top-right",
                            });
                            listarUsuarios();
                        });
                    },
                },
            },
        );
    };

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Contatos</Typography>
                <TextField
                    label="Localize"
                    variant="standard"
                    size="small"
                    sx={{ width: '320px' }}
                    value={filter}
                    onChange={handleFilterChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setUsuarioSelecionado(null);
                        toggleModalUsuario();
                    }}
                >
                    Adicionar
                </Button>
            </Box>
            <CustomTableContainer sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsuarios
                            .slice(
                                pagination.page * pagination.rowsPerPage,
                                pagination.page * pagination.rowsPerPage +
                                pagination.rowsPerPage,
                            )
                            .map((usuario) => (
                                <TableRow key={usuario.id}>
                                    <TableCell>{usuario.id}</TableCell>
                                    <TableCell>{usuario.name}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2 justify-center">
                                            <Tooltip title="Gestão de Filas do usuário">
                                                <IconButton
                                                    onClick={() => gerirFilasUsuario(usuario)}
                                                >
                                                    {/* <Rows4Icon /> */}
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Editar usuário">
                                                <IconButton
                                                    onClick={() => handlEditarUsuario(usuario)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Apagar usuário">
                                                <IconButton
                                                    onClick={() => handleDeleteUsuario(usuario)}
                                                >
                                                    {/* <CircleX color="red" /> */}
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </CustomTableContainer>
            <TablePagination
                component="div"
                count={filteredUsuarios.length}
                page={pagination.page}
                onPageChange={handlePageChange}
                rowsPerPage={pagination.rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
            />

        </Box >
    )
}
