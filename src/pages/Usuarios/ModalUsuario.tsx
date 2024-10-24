import { Close, Visibility, VisibilityOff, X } from "@mui/icons-material"
import { Box, Button, ButtonBase, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormGroup, FormLabel, IconButton, Input, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useUsuarioStore } from "../../store/usuarios"
import { CriarUsuario, UpdateUsuarios } from "../../services/user"

export interface Usuario {
    id?: string | undefined;
    name?: string | null;
    email?: string;
    password?: string;
    profile: string | null;
    tenantId?: string | null;
    queues?: any;
    userId?: string;
}


const optionsProfile = [
    { value: "user", label: "Usuário" },
    { value: "super", label: "Supervisor" },
    { value: "admin", label: "Administrador" },
];

export const ModalUsuario: React.FC = () => {
    const { modalUsuario, toggleModalUsuario, usuarioSelecionado, setUsuarioSelecionado } = useUsuarioStore()
    const [isLoading, setIsLoading] = useState(false)
    const [usuario, setUsuario] = useState({
        username: '',
        name: '',
        email: '',
        profile: ''
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
        setIsLoading(true)
        event.preventDefault();
        if (validateInputs()) {
            if (usuario?.id) {
                const {
                    email, id, name, tenantId, password, profile
                } = usuario
                const params = { email, id, name, password, profile }
                await UpdateUsuarios(usuario.id, params)
                setIsLoading(false)
            } else {
                await CriarUsuario(usuario)
                setIsLoading(false)
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
                    {!usuarioSelecionado?.token && (
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                            <Select
                                label="Perfil"
                                value={usuario.profile}
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setUsuario((prev) => ({
                                    ...prev,
                                    profile: e.target.value
                                }))}
                            >
                                {optionsProfile.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <DialogActions>
                        <Button sx={{
                            fontWeight: 'bold',
                            font: 'message-box',

                        }}
                            variant="contained"
                            color="error"
                            onClick={toggleModalUsuario}
                            disabled={isLoading}
                        >
                            Cancelar</Button>
                        <Button type="submit"
                            sx={{
                                fontWeight: 'bold',
                                font: 'message-box',

                            }}
                            onClick={validateInputs}
                            variant="contained"
                            color="success"
                            disabled={isLoading}
                        >
                            Salvar</Button>
                    </DialogActions>

                </Box>

            </DialogContent>

        </Dialog>
    )
}