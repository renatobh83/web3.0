import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";




interface ModalWhatsappProps {
    isOpen: boolean
    handleClose: () => void
    handleOpen: () => void
}



export const ModalWhatsapp = ({isOpen, handleClose, handleOpen}: ModalWhatsappProps) => {
   
   
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const tipo = formJson.tipo;
        const nome = formJson.nome;
        const mensagem = formJson.mensagem;
        console.log(tipo, nome, mensagem);
        handleClose();
    }

	return (
		<Dialog
			open={isOpen}
            fullWidth
            maxWidth="sm"
			PaperProps={{
				component: "form",
				onSubmit
			}}
		>
			<DialogTitle>Adicionar canal</DialogTitle>
			<DialogContent>
			
                <TextField
              
                select
               
                margin="dense"
                id="tipo"
                name="tipo"
                label="Tipo"
                type="select"
                fullWidth
                required
                variant="standard"
            />
				<TextField
					autoFocus
					required
					margin="dense"
					id="nome"
					name="nome"
					label="Nome"
				
					fullWidth
					variant="standard"
				/>
                	<TextField
			
					margin="dense"
					id="mensagem"
					name="mensagem"
					label="Mensagem Despedida:"
                    rows={5}
                    multiline
					fullWidth
					variant="standard"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={()=> handleClose()}>Cancelar</Button>
				<Button type="submit">Gravar</Button>
			</DialogActions>
		</Dialog>
	);
};
