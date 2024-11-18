import { Box, Typography, Button, Card, CardContent, IconButton, Tooltip } from "@mui/material"
import { ModalApi } from "./ModalApi"
import { useCallback, useEffect, useState } from "react"
import { Edit, Delete, Refresh } from "@mui/icons-material"
import { red } from "@mui/material/colors"
import { ApagarAPI, ListarAPIs, NovoTokenAPI } from "../../services/api"
import { EventEmitter } from "events"
import { toast } from "sonner"
import { Errors } from "../../utils/error"



export const emiterApi = new EventEmitter()
export const ApiExternal = () => {
    const [open, setOpen] = useState(false)
    const [apiEdit, setApiEdit] = useState({})
    const [apis, setApis] = useState([])
    const cBaseUrlIntegração = () => {
        return `${import.meta.env.VITE_APP_BASE_URL}/v1/api/external`
    }
    const listarApis = useCallback(async () => {
        try {
            const { data } = await ListarAPIs()
            setApis(data.apis)
        } catch (error) {
            Errors(error)
        }

    }, [])

    const handleEditarApi = (api) => {
        setApiEdit(api)
        setOpen(true)
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        listarApis()
    }, [])

    const handleCloseModal = () => {
        setOpen(false)
        setApiEdit({})
    }
    const apiEditada = (api) => {
        const idx = apis.findIndex(f => f.id === api.id)
        if (idx > -1) {
            const updatedApis = [...apis]; // Cria uma cópia do array
            updatedApis[idx] = api; // Substitui o item na posição 'idx'
            setApis(updatedApis); // Atualiza o estado com o novo array
        }
    }
    const apiCriada = (api) => setApis(prevApi => [...prevApi, api])

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        emiterApi.on('ApiEditada', apiEditada)
        emiterApi.on('ApiCriada', apiCriada)
        return () => {
            emiterApi.off('ApiEditada', apiEditada)
            emiterApi.off('ApiCriada', apiCriada)
        }
    }, [])
    const montarUrlIntegraçãoUrl = (id) => {
        return `${cBaseUrlIntegração()}/${id}`
    }
    const handleDeleteApi = (api) => {
        toast.info(`Atenção!! Deseja realmente deletar "${api.name}"?`, {
            cancel: {
                label: 'Cancel',
                onClick: () => console.log('Cancel!'),
            },
            action: {
                label: 'Confirma',
                onClick: () => {
                    try {
                        ApagarAPI(api).then(() => {
                            let NewApis = [...apis]
                            NewApis = NewApis.filter(f => f.id !== api.id)
                            setApis(NewApis)
                            toast.success(`${api.name} deletada!`)
                        })

                    } catch (error) {
                        Errors(error)
                    }

                },
            },
        })
    }
    const handleGerarNovoToken = (api) => {
        toast.info(`Atenção!! Deseja realmente gerar novo token para "${api.name}"?
        Lembre que as integrações que utilizam atual irão parar de funcionar
        até que atualize o token onde for necessário.`, {
            cancel: {
                label: 'Cancel',
                onClick: () => console.log('Cancel!'),
            },
            action: {
                label: 'Confirma',
                onClick: async () => {
                    try {
                        const { data } = await NovoTokenAPI(api)
                        apiEditada(data)
                        toast.success('Token atualizado!')
                    } catch (error) {
                        Errors(error)
                    }

                },
            },
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
                <Typography variant="h6">Configurações API</Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpen(true)}
                >
                    Adicionar
                </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                {apis.map(api => (
                    <Card key={api.id}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h5">Nome: {api.name}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                    <Tooltip title="Editar api">
                                        <IconButton
                                            onClick={() => handleEditarApi(api)}
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Gerar um novo token">
                                        <IconButton
                                            onClick={() => handleGerarNovoToken(api)}
                                        >
                                            <Refresh />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Apagar Api">
                                        <IconButton
                                            onClick={() => handleDeleteApi(api)}
                                        >
                                            <Delete sx={{ color: red[400] }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Url: {montarUrlIntegraçãoUrl(api.id)}
                            </Typography>
                            <Typography variant="subtitle2" gutterBottom sx={{ wordBreak: 'break-word' }}>
                                Token: {api.token}
                            </Typography>
                            <Typography variant="subtitle2" gutterBottom>
                                Token Autenticação: {api.authToken}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}

            </Box>
            {open && <ModalApi open={open} setClose={handleCloseModal} apiEdit={apiEdit} />}
        </Box>
    )
}