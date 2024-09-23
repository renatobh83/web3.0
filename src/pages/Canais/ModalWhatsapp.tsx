import { VapingRooms } from "@mui/icons-material";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	TextField,
} from "@mui/material";
import { useWhatsappStore } from "../../store/whatsapp";
import { useEffect, useState } from "react";




interface ModalWhatsappProps {
	isOpen: boolean
	handleClose: () => void
	item?: any
}

const optionsWhatsappsTypes = [
	{ label: 'WhatsApp Oficial (WABA)', value: 'waba' },
	{ label: 'WhatsApp Baileys (QRCode)', value: 'baileys' },
	{ label: 'WhatsApp WebJs (QRCode)', value: 'whatsapp' },
	{ label: 'Telegram', value: 'telegram' },
	{ label: 'Instagram', value: 'instagram' },
	// { label: 'Instagram (Beta Version)', value: 'instagram' },
	// { label: 'Messenger (em breve)', value: 'messenger' }
]
const variaveis = [
	{ label: 'Nome', value: '{{name}}' },
	{ label: 'Saudação', value: '{{greeting}}' },
	{ label: 'Protocolo', value: '{{protocol}}' },
	{ label: 'E-mail (se existir)', value: '{{email}}' },
	{ label: 'Telefone', value: '{{phoneNumber}}' },
	{ label: 'Kanban', value: '{{kanban}}' },
	{ label: 'Atendente', value: '{{user}}' },
	{ label: 'E-mail Atendente', value: '{{userEmail}}' },
]
const variaveisAniversario = [
	{ label: 'Nome', value: '{{name}}' },
	{ label: 'Saudação', value: '{{greeting}}' },
	{ label: 'E-mail (se existir)', value: '{{email}}' },
	{ label: 'Telefone', value: '{{phoneNumber}}' },
]
export const ModalWhatsapp = ({ isOpen, handleClose, item }: ModalWhatsappProps) => {

	const [selectedType, setSelectedType] = useState({})
	const whatsApps = useWhatsappStore(s => s.whatsApps)

	const [whatsapp, setWhatsapp] = useState({
		name: '',
		wppUser: '',
		wppPass: '',
		proxyUrl: null,
		proxyUser: null,
		proxyPass: null,
		webversion: null,
		remotePath: null,
		isDefault: false,
		tokenTelegram: '',
		instagramUser: '',
		instagramKey: '',
		tokenAPI: '',
		wabaId: '',
		bmToken: '',
		wabaVersion: '20.0',
		type: '',
		farewellMessage: '',
		wabaBSP: '360',
		chatgptPrompt: '',
		chatgptApiKey: '',
		chatgptOrganizationId: '',
		chatgptOff: '',
		assistantId: '',
		typebotRestart: '',
		importMessages: false,
		importOldMessagesGroups: false,
		importGroupMessages: false,
		closedTicketsPostImported: false,
		importOldMessages: '15/07/2024 20:36',
		importRecentMessages: '15/07/2024 20:37',
		queueIdImportMessages: null,
		importStartDate: '2024-07-11',
		importStartTime: '16:24',
		importEndDate: '2024-07-11',
		importEndTime: '16:24',
		importStartDateTime: '2024-07-11 16:24',
		importEndDateTime: '2024-07-11 16:25',
		messageQueue: '',
		isButton: true,
		selfDistribute: 'disabled',
		destroyMessage: 'disabled',
		n8nUrl: '',
		typebotOff: '',
		typebotName: '',
		typebotUrl: '',
		difyKey: '',
		difyUrl: '',
		difyType: '',
		difyOff: '',
		difyRestart: '',
		dialogflowJsonFilename: '',
		dialogflowProjectId: '',
		dialogflowLanguage: '',
		dialogflowOff: '',
		dialogflowJson: '',
		wordlist: 'disabled',
		sendEvaluation: 'disabled',
		transcribeAudio: 'disabled',
		birthdayDate: 'disabled',
		birthdayDateMessage: '',
		transcribeAudioJson: {}
	})

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
	function channelOptions() {
		return whatsApps.map(whatsapp => ({
			label: whatsapp.name,
			id: whatsapp.id,
			type: whatsapp.type
		}));
	}
	function cBaseUrlIntegração() {
		return whatsApps.UrlMessengerWebHook
	}

	const handleChange = (event) => {
		setWhatsapp((prev) => ({
			...prev,
			type: event.target.value
		}))
	}
	useEffect(() => {
		if (item?.id) {
			setWhatsapp({ ...item })
		}
	}, [item, optionsWhatsappsTypes]);
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
			<DialogTitle>{item?.id ? 'Editar canal' : 'Adicionar novo canal'}</DialogTitle>
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
					value={whatsapp.type}
					onChange={e => handleChange(e)}
				>
					{optionsWhatsappsTypes.map(type => (
						<MenuItem key={type.label} value={type.value}>{type.label}</MenuItem>
					))}
				</TextField>
				<TextField
					autoFocus
					required
					margin="dense"
					id="nome"
					name="nome"
					label="Nome"
					value={whatsapp.name}
					fullWidth
					variant="standard"
				/>
				<Box sx={{ position: 'relative' }}>
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
					<Box id='btn' sx={{ position: 'absolute', top: '0', right: '0' }}>
						<Button>
							<VapingRooms />
						</Button>
					</Box>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleClose()}>Cancelar</Button>
				<Button type="submit">Gravar</Button>
			</DialogActions>
		</Dialog>
	);
};
