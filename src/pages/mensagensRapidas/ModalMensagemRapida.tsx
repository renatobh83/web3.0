import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, FormLabel, Input, Slide, Stack, TextField, Typography } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useState } from "react";
import { AlterarMensagemRapida, CriarMensagemRapida } from "../../services/mensagensRapidas";
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="left" ref={ref} {...props} />;
});


interface ModalMensagemRapidaProps {
    mensagensRapidasSelecionada: object,
    open: boolean,
    closeModal: () => void
    updateMensagem: (arg0: any) => void
}

export const ModalMensagemRapida = ({ open, closeModal, mensagensRapidasSelecionada, updateMensagem }: ModalMensagemRapidaProps) => {
    const [chaveError, setChaveError] = useState(false);
    const [chaveErrorMessage, setChaveErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [mensagemError, setMensagemError] = useState(false);
    const [mensagemErrorMessage, setMensagemErrorMessage] = useState('');
    const [mensagemRapida, setMensagemRapida] = useState({
        key: '',
        message: ''
    })

    const validateInputs = () => {
        let isValid = true;
        const key = document.getElementById('key') as HTMLInputElement;
        const message = document.getElementById('message') as HTMLInputElement;

        if (!key.value) {
            setChaveError(true);
            setChaveErrorMessage('Insira uma chave.');
            isValid = false;
        }
        if (!message.value) {
            setMensagemError(true);
            setMensagemErrorMessage('Insira uma mensagem.');
            isValid = false;
        }
        return isValid;
    }
    useEffect(() => {
        if (mensagensRapidasSelecionada?.id) {
            setMensagemRapida(mensagensRapidasSelecionada)
        }
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true)
        if (validateInputs()) {
            if (mensagensRapidasSelecionada?.id) {
                const { data } = await AlterarMensagemRapida(mensagemRapida)
                updateMensagem(data)
                closeModal()
                setIsLoading(false)
            } else {
                const { data } = await CriarMensagemRapida(mensagemRapida)
                updateMensagem(data)
                closeModal()
                setIsLoading(false)
            }

        }

    };
    return (
        <Dialog open={open} fullWidth maxWidth='sm'
            TransitionComponent={Transition}
            keepMounted >
            <DialogContent >
                <Typography sx={{ mb: 2 }} variant="h6">{mensagensRapidasSelecionada?.id ? 'Editar Mensagem Rápida' : 'Criar Mensagem Rápida'}</Typography>
                <Box
                    onSubmit={handleSubmit}
                    noValidate
                    component="form">
                    <Stack>
                        <TextField
                            variant="standard"
                            label={chaveError ? chaveErrorMessage : 'Chave'}
                            id="key"
                            value={mensagemRapida.key}
                            color={chaveError ? 'error' : 'primary'}
                            onChange={(e) => setMensagemRapida((prev) => ({
                                ...prev,
                                key: e.target.value
                            }))}
                        />
                        <Typography variant="caption">A chave é o atalho para pesquisa da mensagem pelos usuários.</Typography>
                    </Stack>
                    <Stack>
                        <TextField
                            id="message"
                            label={mensagemError ? mensagemErrorMessage : 'Mensagem'}
                            multiline
                            maxRows={20}
                            variant="standard"
                            value={mensagemRapida.message}
                            color={mensagemError ? 'error' : 'primary'}
                            onChange={(e) => setMensagemRapida((prev) => ({
                                ...prev,
                                message: e.target.value
                            }))}
                        />
                    </Stack>
                    <DialogActions>
                        <Button
                            disabled={isLoading}
                            sx={{
                                fontWeight: 'bold',
                                font: 'message-box',

                            }}
                            variant="contained"
                            color="error"
                            onClick={closeModal}
                        >
                            Cancelar</Button>
                        <Button type="submit"
                            disabled={isLoading}
                            variant="contained"
                            color="success"
                            sx={{
                                fontWeight: 'bold',
                                font: 'message-box',

                            }}
                            onClick={validateInputs}
                        >
                            Salvar</Button>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
    )
}