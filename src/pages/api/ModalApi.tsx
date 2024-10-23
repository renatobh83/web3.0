import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { useWhatsappStore } from "../../store/whatsapp"
import { toast } from "sonner"
import { CriarAPI, EditarAPI } from "../../services/api"
import { emiterApi } from "."

interface ModalApiProps {
    open: boolean,
    setClose: () => void
    apiEdit: object
}
export const ModalApi = ({ open, setClose, apiEdit }: ModalApiProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const { whatsApps } = useWhatsappStore()
    const [stateModalApi, setStateModalApi] = useState<{
        name: string
        sessionId: string,
        authToken: string
        isActive: boolean

    }>({
        name: '',
        sessionId: '',
        authToken: '',
        isActive: true
    })
    const onChangeState = (value: string, action: string) => {
        setStateModalApi(prev => ({
            ...prev,
            [action]: value
        }))

    }
    const validateInputs = () => {
        if (!stateModalApi.name.trim() || !stateModalApi.authToken.trim() || !stateModalApi.sessionId) {
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
                if (apiEdit.id) {
                    const apidata = {
                        ...apiEdit,
                        name: stateModalApi.name,
                        isActive: stateModalApi.isActive,
                        sessionId: stateModalApi.sessionId,
                        authToken: stateModalApi.authToken,
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
        if (apiEdit.id) {
            console.log(apiEdit)
            setStateModalApi({
                name: apiEdit.name,
                sessionId: apiEdit.sessionId,
                isActive: apiEdit.isActive,
                authToken: apiEdit.authToken
            })
        }
    }, [])
    return (
        <Dialog open={open} fullWidth maxWidth='md'>
            <Box
                onSubmit={handleSubmit}
                noValidate
                component="form">
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <TextField
                                sx={{ maxWidth: '48%', width: '48%' }}
                                label='Nome da Api' variant="filled"
                                value={stateModalApi?.name || ''}
                                onChange={(e) => onChangeState(e.target.value, 'name')} />
                            <FormControl sx={{ maxWidth: '48%', width: '48%' }} variant="filled">
                                <InputLabel>Enviar por:</InputLabel>
                                <Select labelId='Enviar por'
                                    value={stateModalApi?.sessionId || ''}
                                    onChange={(e) => onChangeState(e.target.value, 'sessionId')}
                                >
                                    {whatsApps?.map(sessao => (
                                        <MenuItem key={sessao.id} value={sessao.id}>{sessao.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <TextField sx={{ maxWidth: '100%', width: '100%' }}

                                label='Token para autenticação' variant="filled"
                                value={stateModalApi?.authToken || ''}
                                onChange={(e) => onChangeState(e.target.value, 'authToken')} />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: '24px' }}>
                    {apiEdit.id ?
                        <Box>
                            <FormControlLabel control={<Checkbox
                                checked={stateModalApi.isActive}
                                onChange={e => onChangeState(e.target.checked, 'isActive')}
                            />} label="Ativo" />


                        </Box> :
                        <Box />}
                    <Box sx={{ gap: 2, display: 'flex' }}>
                        <Button sx={{
                            fontWeight: 'bold',
                            font: 'message-box',

                        }}
                            onClick={setClose}
                            variant="contained"
                            color="error"
                            disabled={isLoading}
                        >
                            Cancelar</Button>
                        <Button type="submit"
                            sx={{
                                fontWeight: 'bold',
                                font: 'message-box',

                            }}
                            variant="contained"
                            color="success"
                            disabled={isLoading}
                        >
                            Salvar</Button>
                    </Box>
                </DialogActions>
            </Box>
        </Dialog>
    )
}