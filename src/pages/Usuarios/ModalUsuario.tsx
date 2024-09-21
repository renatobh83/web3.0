import { Close, Visibility, VisibilityOff, X } from "@mui/icons-material"
import { Box, Button, ButtonBase, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormGroup, FormLabel, IconButton, Input, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useUsuarioStore } from "../../store/usuarios"
import { CriarUsuario, UpdateUsuarios } from "../../services/user"


export const ModalUsuario: React.FC = () => {
    const { modalUsuario, toggleModalUsuario, usuarioSelecionado, setUsuarioSelecionado } = useUsuarioStore()

    const [usuario, setUsuario] = useState({
        username: '',
        name:'',
        email: ''
    })
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show: boolean) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Insira um endereço de e-mail válido.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('A senha deve ter pelo menos 6 caracteres.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    useEffect(() => {

        if (usuarioSelecionado?.id) {
            setUsuario({ ...usuarioSelecionado })
        }
        if (usuarioSelecionado?.userId) {
            setUsuario(() => ({
                ...usuarioSelecionado,
                id: usuarioSelecionado.userId,
                name: usuarioSelecionado.username,
                profile: usuarioSelecionado.profile

            }))
        }

    }, [usuarioSelecionado])
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (validateInputs()) {
            if (usuario?.id) {
                const {
                    email, id, name, tenantId, password, profile
                } = usuario
                const params = { email, id, name, tenantId, password, profile }
                // const { data } = await UpdateUsuarios(usuario.id, params)
            } else {
                // const { data } = await CriarUsuario(usuario)
            }
            setUsuarioSelecionado(null)
        }

    };
    return (
        <Dialog open={modalUsuario} fullWidth maxWidth='sm' >
            <DialogContent >
                <Typography sx={{ mb: 2 }} variant="h6">{usuarioSelecionado ? 'Editar usuario' : 'Cadasrtar usuario'}</Typography>
                <Box
                    onSubmit={handleSubmit}
                    noValidate
                    component="form">
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <FormLabel htmlFor="nome" >Nome</FormLabel>
                        <Input
                            id="nome"
                            name="nome"
                            value={usuario.name}
                            autoComplete="username"
                            onChange={(e) => setUsuario((prev) => ({
                                ...prev,
                                name: e.target.value
                            }))}
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="email">{emailError ? emailErrorMessage : 'E-mail'}</InputLabel>
                        <Input
                            error={emailError}
                            color={emailError ? 'error' : 'primary'}
                            id="email"
                            name="email"
                            autoComplete="email"
                            value={usuario.email}
                            onChange={(e) => setUsuario((prev) => ({
                                ...prev,
                                email: e.target.value
                            }))}
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                        <InputLabel htmlFor="password">{passwordError ? passwordErrorMessage : 'Senha'}</InputLabel>
                        <Input
                            error={passwordError}
                            color={passwordError ? 'error' : 'primary'}
                            id="password"
                            name="password"
                        
                            onChange={(e) => setUsuario((prev) => ({
                                ...prev,
                                password: e.target.value
                            }))}
                            autoComplete="current-password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        sx={{ width: 2, height: 2 }}
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <TextField
                            id="select-perfil"
                            select
                            label="Perfil"
                            name="Perfil"
                            slotProps={{
                                select: {
                                    native: true,
                                },
                            }}
                            helperText="Selecione o perfil"
                            variant="standard"
                        >
                                PErgi
                        </TextField>
                    </FormControl>
                    <DialogActions>
                        <Button sx={{
                            fontWeight: 'bold',
                            font: 'message-box',

                        }}
                            onClick={toggleModalUsuario}
                        >
                            Cancelar</Button>
                        <Button type="submit"
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