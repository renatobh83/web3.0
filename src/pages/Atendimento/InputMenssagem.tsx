import { Cancel, Mic, Send } from '@mui/icons-material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';
import { alpha, Avatar, Box, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, MenuProps, Skeleton, styled, TextField, Tooltip } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { RecordingTimer } from './RecordingTimer';
import { toast } from 'sonner';
import { EnviarMensagemTexto } from '../../services/tickets';

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        {...props}
    />
))(({ theme }) => ({
    "& .MuiPaper-root": {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: "40vw",
        color: "rgb(55, 65, 81)",
        boxShadow:
            "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        "& .MuiMenu-list": {
            padding: "4px 0",
        },
        "& .MuiMenuItem-root": {
            "& .MuiSvgIcon-root": {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            "&:active": {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                ),
            },
        },
        ...theme.applyStyles("dark", {
            color: theme.palette.grey[300],
        }),
    },
}));
import { useAudioRecorder } from "react-audio-voice-recorder";

export const InputMenssagem = () => {
    const [isRecordingAudio, setIsRecordingAudio] = useState(false)
    const [loading, setIsloading] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const recorderControlsRef = useRef<ReturnType<typeof useAudioRecorder> | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const inputEnvioMensagem = useRef<HTMLInputElement | null>(null);

    //  Enviar Arquivos Inicio
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Função chamada ao clicar no botão
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Dispara o clique no input de tipo file
        }
    };

    // Função chamada quando o arquivo é selecionado
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            console.log('Arquivo selecionado:', file);
        }
    };

    //  Enviar Arquivos Fim

    const [textChat, setTextChat] = useState('');

    // Função que será chamada para enviar a mensagem
    const enviarMensagem = () => {
        console.log('Mensagem enviada:', textChat);
        setTextChat(''); // Limpa o campo após enviar a mensagem
    };

    // Função para capturar o evento de tecla
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            // Verifica se o campo não está vazio ou apenas com espaços
            if (textChat.trim().length) {
                enviarMensagem();
            }
            event.preventDefault(); // Impede o comportamento padrão do Enter
        }
    };
    async function handleCancelRecordingAudio() {
        try {
            // await Mp3Recorder.stop().getMp3()
            setIsRecordingAudio(false)
            setIsloading(false)
        } catch (error) {
            toast.error(`Ocorreu um erro!, ${error}`)
        }
    }

    const handleRecorderControls = (controls: ReturnType<typeof useAudioRecorder>) => {
        recorderControlsRef.current = controls;
        console.log('Controles do gravador expostos para o pai:', controls);

        if (!controls.isRecording && controls.recordingBlob) {
            handleStopRecordingAudio(controls.recordingBlob)
        }
    };
    async function handleSartRecordingAudio() {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true })
            // await Mp3Recorder.start()
            setIsRecordingAudio(true)
        } catch (error) {
            setIsRecordingAudio(false)
        }
    }
    async function handleStopRecordingAudio(blob: Blob) {
        setIsloading(true)
        try {
            // const [, blob] = await Mp3Recorder.stop().getMp3()
            if (blob.size < 10000) {

                setIsloading(false)
                setIsRecordingAudio(false)
                return
            }

            setIsRecordingAudio(false)
            let formData = new FormData()
            const filename = `${new Date().getTime()}.mp3`
            formData.append('medias', blob, filename)
            formData.append('body', filename)
            formData.append('fromMe', true)
            // formData.append('id', uid())
            // if (isScheduleDate) {
            //     formData.append('scheduleDate', this.scheduleDate)
            // }
            console.log(formData)
            const ticketId = ticketFocado.id

            // await EnviarMensagemTexto(ticketId, formData)
            // this.arquivos = []
            setTextChat('')
            // this.$emit('update:replyingMessage', null)
            // this.abrirFilePicker = false
            // this.abrirModalPreviewImagem = false
            setIsloading(false)
            setIsRecordingAudio(false)
            // setTimeout(() => {
            //     this.scrollToBottom()
            // }, 300)
        } catch (error) {
            setIsloading(false)
            setIsRecordingAudio(false)
            toast.error(`Ocorreu um erro!, ${JSON.stringify(error)}`)
        }
    }
    function cDisableActions() {
        return (isRecordingAudio || ticketFocado.status !== 'open')
    }

    const ticketFocado = {
        status: 'open',
        id: 3
    }

    return (
        <Box>
            {ticketFocado.status !== 'pending' && (
                <Box sx={{
                    minHeight: '70px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    pb: 2,
                    px: 1,
                    pt: 2
                }}>
                    {!isRecordingAudio ? (
                        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, }}>
                            <Tooltip title='Enviar arquivo'>
                                <>
                                    <IconButton
                                        // disabled={cDisableActions()}
                                        sx={{ borderRadius: '50%' }}
                                        size='small'
                                        onClick={handleButtonClick}
                                        disableRipple
                                    ><AttachFileIcon />
                                    </IconButton>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }} // Esconde o input
                                        onChange={handleFileChange} // Função que lida com a seleção do arquivo
                                    />
                                </>
                            </Tooltip>
                            <Tooltip title='Emoji'>
                                <>
                                    <IconButton
                                        // disabled={cDisableActions()}
                                        sx={{ borderRadius: '50%' }}
                                        size='small'
                                        onClick={handleClick}
                                        disableRipple
                                    ><EmojiEmotionsIcon />
                                    </IconButton>
                                    <StyledMenu

                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        Criar compoente para EMOJi
                                    </StyledMenu>
                                </>
                            </Tooltip>
                            <TextField
                                label="Digite sua mensagem"
                                variant="standard"
                                fullWidth
                                value={textChat}
                                onChange={(e) => setTextChat(e.target.value)}
                                onKeyDown={handleKeyDown} // Captura a tecla pressionada
                                ref={inputEnvioMensagem}
                                sx={{ maxHeight: '30vh' }}
                            >

                            </TextField>
                            {textChat && (
                                <Tooltip title='Enviar Mensagem'>
                                    <IconButton
                                        disabled={ticketFocado.status !== 'open'}
                                        onClick={enviarMensagem}
                                    >

                                        <Send />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {!textChat && !isRecordingAudio && (

                                <Tooltip title=' Enviar Áudio'>

                                    <IconButton
                                        onClick={handleSartRecordingAudio}>
                                        <Mic />
                                    </IconButton>
                                </Tooltip>
                            )}

                        </Box>
                    ) : (
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center' }} id='audio '>
                            <Box sx={{ maxWidth: '200px', display: 'flex', gap: 2, alignItems: 'center' }}>
                                {/* <IconButton aria-label="delete" size="small"
                                    onClick={handleCancelRecordingAudio}
                                >
                                    <Cancel fontSize="inherit" sx={{ bgcolor: 'success' }} />
                                </IconButton> */}
                                <Box sx={{ display: 'flex', gap: 1, }}  >
                                    <RecordingTimer exposeRecorderControls={handleRecorderControls} />
                                </Box>
                                {/* <IconButton aria-label="delete" size="small"
                                    onClick={handleStopRecordingAudio}>
                                    <Send fontSize="inherit" />
                                </IconButton> */}

                            </Box>
                        </Box>

                    )}



                </Box>
            )}
        </Box >
    );
};


