import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box, Button, Dialog, DialogActions, DialogContent, FormControl, FormLabel,
    IconButton, Input, InputAdornment, InputLabel, MenuItem, Select, Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useUsuarioStore } from "../../store/usuarios";
import { CriarUsuario, UpdateUsuarios } from "../../services/user";

export interface Usuario {
    id?: number;
    name?: string;
    email: string;
    password?: string;
    profile: string;
    tenantId?: string | null;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    queues?: any;
    userId?: string;
}

const optionsProfile = [
    { value: "user", label: "Usuário" },
    { value: "super", label: "Supervisor" },
    { value: "admin", label: "Administrador" },
];

export const ModalUsuario: React.FC = () => {
    const { modalUsuario, toggleModalUsuario, usuarioSelecionado, setUsuarioSelecionado } = useUsuarioStore();
    const [isLoading, setIsLoading] = useState(false);
    const [usuario, setUsuario] = useState<Usuario>({
        name: '',
        email: '',
        profile: ''
    });
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

    const validateInputs = () => {
        let isValid = true;

        if (!usuario.email || !/\S+@\S+\.\S+/.test(usuario.email)) {
            setEmailError(true);
            setEmailErrorMessage('Insira um endereço de e-mail válido.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (usuario.password && usuario.password.length < 6) {
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
        if (usuarioSelecionado) {
            setUsuario({
                id: usuarioSelecionado.id ?? Number(usuarioSelecionado.userId),
                name: usuarioSelecionado.name ?? usuarioSelecionado.username,
                email: usuarioSelecionado.email ?? '',
                profile: usuarioSelecionado.profile ?? '',
                password: ''
            });
        }
    }, [usuarioSelecionado]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateInputs()) {
            setIsLoading(true);
            try {
                const params = {
                    ...usuario,
                    password: usuario.password || undefined
                };

                if (usuario.id) {
                    await UpdateUsuarios(usuario.id, params);
                } else {
                    await CriarUsuario(params);
                }
                setUsuarioSelecionado(null);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Dialog open={modalUsuario} fullWidth maxWidth="sm">
            <DialogContent>
                <Typography sx={{ mb: 2 }} variant="h6">
                    {usuarioSelecionado ? 'Editar usuário' : 'Cadastrar usuário'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <FormLabel htmlFor="nome">Nome</FormLabel>
                        <Input
                            id="nome"
                            name="name"
                            value={usuario.name}
                            autoComplete="username"
                            onChange={(e) => setUsuario((prev) => ({ ...prev, name: e.target.value }))}
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="email" error={emailError}>
                            {emailError ? emailErrorMessage : 'E-mail'}
                        </InputLabel>
                        <Input
                            id="email"
                            name="email"
                            error={emailError}
                            value={usuario.email}
                            onChange={(e) => setUsuario((prev) => ({ ...prev, email: e.target.value }))}
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="password" error={passwordError}>
                            {passwordError ? passwordErrorMessage : 'Senha'}
                        </InputLabel>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            error={passwordError}
                            value={usuario.password || ''}
                            onChange={(e) => setUsuario((prev) => ({ ...prev, password: e.target.value }))}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="profile">Perfil</InputLabel>
                        <Select
                            id="profile"
                            value={usuario.profile}
                            onChange={(e) => setUsuario((prev) => ({ ...prev, profile: e.target.value as string }))}
                        >
                            {optionsProfile.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={toggleModalUsuario} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained" color="success" disabled={isLoading}>
                            Salvar
                        </Button>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
