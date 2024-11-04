
// import { Dialog, DialogContent, Typography, Box, FormControl, FormLabel, Input, DialogActions, Button, Checkbox, FormControlLabel } from "@mui/material"
// import { useEffect, useState } from "react"
// import { AlterarFila, CriarFila } from "../../services/filas";

// interface ModalFilaProps {
//     open: boolean,
//     filaSelecionada: object,
//     closeModal: () => void
//     // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//     updateFilas: (arg0: any) => void
// }




// export const ModalFila = ({ open, closeModal, filaSelecionada, updateFilas }: ModalFilaProps) => {
//     const [filaError, setFilaError] = useState(false);
//     const [isLoading, setIsLoading] = useState(false)
//     const [filaErrorMessage, setFilaErrorMessage] = useState('');
//     const [fila, setFila] = useState({
//         queue: '',
//         isActive: true
//     })

//     const validateInputs = () => {
//         let isValid = true;
//         const name = document.getElementById('fila') as HTMLInputElement;
//         if (!name.value) {
//             setFilaError(true);
//             setFilaErrorMessage('Insira um nome para a fila.');
//             isValid = false;
//         }
//         return isValid;
//     }
//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         setIsLoading(true)
//         event.preventDefault();
//         if (validateInputs()) {
//             if (filaSelecionada?.id) {
//                 const { data } = await AlterarFila(fila)
//                 updateFilas(data)
//                 closeModal()
//                 setIsLoading(false)
//             } else {
//                 const { data } = await CriarFila(fila)
//                 updateFilas(data)
//                 closeModal()
//                 setIsLoading(false)
//             }

//         }

//     };
//     // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
//     useEffect(() => {
//         if (filaSelecionada?.id) {
//             setFila(filaSelecionada)
//         }
//     }, [])
//     return (
//         <Dialog open={open} fullWidth maxWidth='sm' >
//             <DialogContent >
//                 <Typography sx={{ mb: 2 }} variant="h6">{filaSelecionada.id ? 'Editar fila' : 'Cadastrar fila'}</Typography>
//                 <Box
//                     onSubmit={handleSubmit}
//                     noValidate
//                     component="form">
//                     <FormControl fullWidth sx={{ m: 1 }} variant="standard">
//                         <FormLabel htmlFor="fila" >{filaError ? filaErrorMessage : 'Descricao fila'}</FormLabel>
//                         <Input
//                             id="fila"
//                             name="fila"
//                             value={fila.queue}
//                             error={filaError}
//                             color={filaError ? 'error' : 'primary'}
//                             autoComplete="username"
//                             onChange={(e) => setFila((prev) => ({
//                                 ...prev,
//                                 queue: (e.target.value).toLowerCase()
//                             }))}
//                         />
//                     </FormControl>
//                     <FormControl fullWidth sx={{ m: 1 }} variant="standard">
//                         <FormControlLabel control={
//                             <Checkbox
//                                 checked={fila.isActive}
//                                 onChange={(e) =>
//                                     setFila((prev) => ({
//                                         ...prev,
//                                         isActive: e.target.checked
//                                     }))
//                                 }

//                             />} label="Ativo" />
//                     </FormControl>
//                     <DialogActions>
//                         <Button sx={{
//                             fontWeight: 'bold',
//                             font: 'message-box',

//                         }}
//                             onClick={closeModal}
//                             variant="contained"
//                             color="error"
//                             disabled={isLoading}
//                         >
//                             Cancelar</Button>
//                         <Button type="submit"
//                             sx={{
//                                 fontWeight: 'bold',
//                                 font: 'message-box',

//                             }}
//                             variant="contained"
//                             color="success"
//                             disabled={isLoading}
//                             onClick={validateInputs}
//                         >
//                             Salvar</Button>
//                     </DialogActions>

//                 </Box>

//             </DialogContent>

//         </Dialog>
//     )
// }
import { Dialog, DialogContent, Typography, Box, FormControl, FormLabel, Input, DialogActions, Button, Checkbox, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { AlterarFila, CriarFila } from "../../services/filas";

interface ModalFilaProps {
    open: boolean;
    filaSelecionada: Fila;
    closeModal: () => void;
    updateFilas: (data: Fila) => void;
}

interface Fila {
    id?: string;
    queue: string;
    isActive: boolean;
}

export const ModalFila = ({ open, closeModal, filaSelecionada, updateFilas }: ModalFilaProps) => {
    const [filaError, setFilaError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filaErrorMessage, setFilaErrorMessage] = useState('');
    const [fila, setFila] = useState<Fila>({
        queue: '',
        isActive: true
    });

    const validateInputs = () => {
        if (!fila.queue) {
            setFilaError(true);
            setFilaErrorMessage('Insira um nome para a fila.');
            return false;
        }
        setFilaError(false);
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        if (validateInputs()) {
            try {
                const { data } = filaSelecionada?.id
                    ? await AlterarFila(fila)
                    : await CriarFila(fila);
                updateFilas(data);
                closeModal();
            } catch (error) {
                console.error("Erro ao salvar fila:", error);
                setFilaErrorMessage("Falha ao salvar fila. Tente novamente.");
                setFilaError(true);
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (filaSelecionada?.id) {
            setFila(filaSelecionada);
        }
    }, [filaSelecionada]);

    return (
        <Dialog open={open} fullWidth maxWidth='sm'>
            <DialogContent>
                <Typography sx={{ mb: 2 }} variant="h6">
                    {filaSelecionada.id ? 'Editar fila' : 'Cadastrar fila'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <FormLabel htmlFor="fila" aria-describedby="fila-error">
                            {filaError ? filaErrorMessage : 'Descricao fila'}
                        </FormLabel>
                        <Input
                            id="fila"
                            name="fila"
                            value={fila.queue}
                            error={filaError}
                            color={filaError ? 'error' : 'primary'}
                            onChange={(e) =>
                                setFila((prev) => ({
                                    ...prev,
                                    queue: e.target.value.toLowerCase()
                                }))
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={fila.isActive}
                                    onChange={(e) =>
                                        setFila((prev) => ({
                                            ...prev,
                                            isActive: e.target.checked
                                        }))
                                    }
                                />
                            }
                            label="Ativo"
                        />
                    </FormControl>
                    <DialogActions>
                        <Button
                            sx={{ fontWeight: 'bold' }}
                            onClick={closeModal}
                            variant="contained"
                            color="error"
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            sx={{ fontWeight: 'bold' }}
                            variant="contained"
                            color="success"
                            disabled={isLoading}
                        >
                            Salvar
                        </Button>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
