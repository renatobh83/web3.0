import { Box, Button, Chip, Dialog, DialogActions, DialogContent, FormControl, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Edit, Delete } from "@mui/icons-material";
import { CriarWebhook, UpdateApi, ListarWebhook, DeletarApi } from "../../services/webhooks";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Errors } from "../../utils/error";
import { format, parseISO } from "date-fns";

const TIPO_ACAO = ["consulta", "sendpreparo", "agendamento", "confirmacao", "laudo", "preparo", "pdf", "consultacpf", "validacpf", "planos"];

export const WebhookConfiguracao = () => {
    const { decryptData } = useAuth();
    const [isLoading, setIsloading] = useState(false);
    const profile = decryptData('profile');

    if (profile !== "admin") {
        return <Navigate to="/configuracoes" />;
    }

    const [tempValue, setTempValue] = useState('');
    const [open, setOpen] = useState(false);
    const [webhooks, setWebhooks] = useState([]);
    const [webhookEdit, setWebhookEdit] = useState<any>(null); // Alterado para `null` inicialmente
    const [stateWebhook, setStateWebhook] = useState({
        expDate: '',
        action: [],
        nomeApi: '',
        usuario: '',
        senha: '',
        baseURl: ''
    });

    const columns = [
        { field: 'id', headerName: 'ID', name: 'id' },
        { field: 'Descricao', headerName: 'desc', name: 'nomeApi' },
        { field: 'Usuario', headerName: 'usuario', name: "usuario" },
        { field: 'Senha', headerName: 'senha', name: "senha" },
        { field: 'Status', headerName: 'status', name: "status" },
        { field: 'Link', headerName: 'baseURl', name: "baseURl" },
        {
            field: 'Data Expira', headerName: 'expData', name: "expDate",
            renderCell: ({ value }) => value ? format(parseISO(value), 'dd/MM/yyyy HH:mm') : '',
        },
        {
            field: 'Operações', headerName: 'oper', name: "action",
            renderCell: ({ value }) => value?.join(", ") || '',
        },
        {
            headerName: 'acoes', field: 'Ações',
            renderCell: (params: { row: { id: any } }) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title="Edit">
                        <IconButton
                            onClick={() => handleOpenEditModal(params.row)}
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            onClick={() => handleDeleteApi(params.row)}
                        >
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        }
    ];

    const handleOnChange = (value: string, field: string) => {
        setStateWebhook(prev => ({ ...prev, [field]: value }));
    };

    const handleChangeInputChips = (value: string) => setTempValue(value);

    const handleDeleteInputChips = (chipToDelete: string) => {
        setStateWebhook(prev => ({
            ...prev,
            action: prev.action.filter(chip => chip !== chipToDelete)
        }));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && tempValue.trim()) {
            if (TIPO_ACAO.includes(tempValue.toLowerCase().trim())) {
                setStateWebhook(prev => ({
                    ...prev,
                    action: [...prev.action, tempValue.trim()]
                }));
                setTempValue('');
            } else {
                toast.error('Favor inserir apenas as opções aceitas para esse webhook');
            }
        }
    };

    const handleSalvar = async () => {
        if (!stateWebhook.usuario.trim() || !stateWebhook.senha.trim()) {
            toast.info('Preencher todas as informações');
            return;
        }
        try {
            setIsloading(true);
            const data = { ...stateWebhook, status: 'DESCONECTADA' };
            if (webhookEdit?.id) {
                const { data: updatedWebhook } = await UpdateApi(webhookEdit.id, stateWebhook);
                setWebhooks(prevApis => prevApis.map(item => item.id === webhookEdit.id ? updatedWebhook : item));
                setOpen(false);
            } else {
                await CriarWebhook(data);
                listaWebhook();
                setStateWebhook({ expDate: '', action: [], nomeApi: '', usuario: '', senha: '', baseURl: '' });
                setOpen(false);
            }
            setIsloading(false);
        } catch (error) {
            Errors(error);
        }
    };

    const listaWebhook = useCallback(async () => {
        const { data } = await ListarWebhook();
        setWebhooks(data);
    }, []);

    useEffect(() => {
        listaWebhook();
    }, [listaWebhook]);

    const handleDeleteApi = (api: any) => {
        toast.info(`Atenção!! Deseja realmente deletar a api "${api.nomeApi}"?`, {
            position: 'top-center',
            cancel: { label: 'Cancel', onClick: () => console.log('Cancel!') },
            action: {
                label: 'Confirma',
                onClick: async () => {
                    try {
                        await DeletarApi(api.id);
                        toast.info('API deletada');
                        listaWebhook();
                    } catch (error) {
                        Errors(error);
                    }
                },
            },
        });
    };

    const handleCloseModalApi = () => {
        setWebhookEdit(null); // Limpa o webhook editado
        setStateWebhook({ expDate: '', action: [], nomeApi: '', usuario: '', senha: '', baseURl: '' });
        setOpen(false);
    };

    const handleOpenEditModal = (webhook: any) => {
        setWebhookEdit(webhook);
        setOpen(true);
    };

    useEffect(() => {
        if (webhookEdit) {
            setStateWebhook({
                expDate: webhookEdit.expDate || '',
                action: webhookEdit.action || [],
                nomeApi: webhookEdit.nomeApi || '',
                usuario: webhookEdit.usuario || '',
                senha: webhookEdit.senha || '',
                baseURl: webhookEdit.baseURl || ''
            });
        }
    }, [webhookEdit]);

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Webhooks</Typography>
                <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>Adicionar</Button>
            </Box>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map(col => (
                                <TableCell key={col.headerName} sx={{ textAlign: 'center' }}>
                                    {col.field}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {webhooks.map(webhook => (
                            <TableRow key={webhook.id}>
                                {columns.map(col => (
                                    <TableCell key={col.field} sx={{ textAlign: 'center' }}>
                                        {col.renderCell ? col.renderCell({ value: webhook[col.name] }) : webhook[col.name]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {open && (
                <Dialog open={open} fullWidth maxWidth="md">
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h4">{webhookEdit ? 'Editar webhook' : 'Cadastrar webhook'}</Typography>
                        <TextField variant="filled" label="Descrição API" value={stateWebhook.nomeApi} onChange={e => handleOnChange(e.target.value, 'nomeApi')} />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField variant="filled" label="Usuário" value={stateWebhook.usuario} onChange={e => handleOnChange(e.target.value, 'usuario')} />
                            <TextField variant="filled" label="Senha" value={stateWebhook.senha} onChange={e => handleOnChange(e.target.value, 'senha')} />
                        </Box>
                        <Box>
                            <TextField variant="filled" label="URL" value={stateWebhook.baseURl} onChange={e => handleOnChange(e.target.value, 'baseURl')} />
                        </Box>
                        <FormControl>
                            <TextField variant="filled" label="Data Expira" type="date" value={stateWebhook.expDate} onChange={e => handleOnChange(e.target.value, 'expDate')} />
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField variant="filled" label="Tipo da ação" value={tempValue} onChange={e => handleChangeInputChips(e.target.value)} onKeyDown={handleKeyDown} />
                        </FormControl>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {stateWebhook.action.map((chip, index) => (
                                <Chip key={index} label={chip} onDelete={() => handleDeleteInputChips(chip)} />
                            ))}
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={handleCloseModalApi}>Fechar</Button>
                        <Button onClick={handleSalvar} variant="contained" disabled={isLoading}>Salvar</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};
