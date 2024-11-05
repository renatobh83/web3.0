import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import type { Node } from '@xyflow/react'
import useChatFlowStore from '../../store/chatFlow'
import { useEffect, useState } from 'react'
import { RadioComponentCard } from './RadioComponentCard'

interface NodeData {
  welcomeMessage: { message: string }
  maxRetryBotMessage: {
    destiny: string
    number: number
    type: number
  }
  notOptionsSelectMessage: {
    message: string
    stepReturn: string
  }
  notResponseMessage: {
    type: number | null
    destiny: number | null
    message: string
    time: number
  }
  outOpenHours: {
    destiny: string
    type: number
  }
  firstInteraction: { type: number; destiny: string }
  keyword: { message: string }
}

interface NodeProps {
  data?: NodeData
}
interface TabConfiguracaoProps {
  node: NodeProps
}

export const TabConfiguracao = ({ node }: TabConfiguracaoProps) => {
  const {
    welcomeMessage,
    maxRetryBotMessage,
    notOptionsSelectMessage,
    notResponseMessage,
    outOpenHours,
    firstInteraction,
    keyword,
  } = node?.data ?? {}

  // const { filas, usuarios } = useChatFlowStore()
  // const [optionsFilas, setOptionsFilas] = useState([])
  // const [selectOption, setSelectOption] = useState({})
  // const [optionsUsuarios, setOptionsUsuarios] = useState([])

  // const [radioChoiceAusencia, setRadioChoiceAusencia] = useState({})
  // const [radioChoicebot, setRadioChoicebot] = useState({})

  const [messageWelcomeMessage, setMessagewelcomeMessage] = useState('')
  const [feedback, setFeeedback] = useState('')
  const [messageKeyword, setMessageKeyword] = useState('')
  const [semResposta, setSemResposta] = useState<{
    time: number
    type: number | null
    destiny: number | null
    message: string
  }>({
    time: 10,
    type: null,
    destiny: null,
    message: '',
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setMessagewelcomeMessage(welcomeMessage.message)
    setFeeedback(notOptionsSelectMessage.message || '')
    setMessageKeyword(keyword.message || '')
    setSemResposta(notResponseMessage)
  }, [])
  console.log(node)
  const handleSemResposta = (item: string, value: string) => {
    setSemResposta(prev => ({
      ...prev,
      [item]: item === 'time' || item === 'type' ? Number(value) : value,
    }))
    notResponseMessage[item] =
      item === 'time' || item === 'type' ? Number(value) : value
  }
  const handlewelcomeMessage = value => {
    setMessagewelcomeMessage(value)
    welcomeMessage.message = value
  }
  const handleFeedbackMessage = value => {
    setFeeedback(value)
    notOptionsSelectMessage.message = value
  }

  const handleKeyword = value => {
    setMessageKeyword(value)

    keyword.message = value
  }

  return (
    <Box
      sx={{
        height: 'calc(100vh - 300px)',
        mx: 1,
        transition: 'background-color 0.3s ease-in-out',
        overflow: 'auto',
        display: 'flex',
        flexWrap: 'wrap',

        justifyContent: 'center',
      }}
    >
      <Box
        id="content"
        sx={{
          display: 'flex',
          gap: 1,
          flexDirection: 'column',
          height: 'auto',
          width: '100%',
        }}
      >
        <Card sx={{ width: '100%', height: '280px' }} id="welcomeMessage">
          <CardContent>
            <Typography gutterBottom variant="h6" component="span">
              Mensagem de saudação (Fila/Usuário)
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Quando o bot direcionar o atendimento para uma fila ou usuário,
              essa mensagem será enviada.
            </Typography>
          </CardContent>
          <CardContent sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>
            <FormControl>
              <TextField
                onChange={e => {
                  handlewelcomeMessage(e.target.value)
                }}
                value={messageWelcomeMessage}
                id="welcome-message"
                label={<Typography variant="subtitle1">Mensagem</Typography>}
                multiline
                maxRows={4}
                variant="standard"
              />
            </FormControl>
          </CardContent>
        </Card>
        <Card
          sx={{ width: '100%', height: '280px' }}
          id="notOptionsSelectMessage"
        >
          <CardContent>
            <Typography gutterBottom variant="h6" component="span">
              Se nenhuma resposta esperada for enviada
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Essa exceção será aplicada caso a resposta enviada pelo cliente
              não corresponda aos valores esperados conforme condições da etapa.
            </Typography>
          </CardContent>
          <CardContent sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>
            <FormControl>
              <TextField
                value={feedback}
                onChange={e => handleFeedbackMessage(e.target.value)}
                label={
                  <Typography variant="subtitle1">
                    Mensagem de feedback:
                  </Typography>
                }
                multiline
                maxRows={4}
                variant="standard"
              />
            </FormControl>
          </CardContent>
        </Card>
        <Card sx={{ width: '100%', height: '280px' }} id="keyword">
          <CardContent>
            <Typography gutterBottom variant="h6" component="span">
              Palavra chave para iniciar o fluxo
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Essa interação será acionada quando o cliente enviar a palavra
              chave definida, e o cliente será encaminhado para a Fila/Usuário
              configurados.
            </Typography>
          </CardContent>
          <CardContent sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>
            <FormControl>
              <TextField
                value={messageKeyword}
                onChange={e => handleKeyword(e.target.value)}
                id="keyword"
                label={
                  <Typography variant="subtitle1">Palavra Gatilho:</Typography>
                }
                multiline
                maxRows={4}
                variant="standard"
              />
            </FormControl>
          </CardContent>
        </Card>
        <Card sx={{ width: '100%', height: '280px' }} id="notResponseMessage">
          <CardContent>
            <Typography gutterBottom variant="h6" component="span">
              Ausência de resposta
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Após o tempo determinado, se o cliente não responder, o bot
              realizará o encaminhamento para a Fila/Usuário informados.
            </Typography>
          </CardContent>
          <CardContent sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>
            <TextField
              value={semResposta.time}
              onChange={e => handleSemResposta('time', e.target.value)}
            />
            <RadioComponentCard arg0={notResponseMessage} />
          </CardContent>
        </Card>
        <Card sx={{ width: '100%', height: '270px' }} id="notResponseMessage">
          <CardContent>
            <Typography gutterBottom variant="h6" component="span">
              Mensagem de Ausência
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Após o tempo determinado, se o cliente não responder, o bot
              enviará essa mensagem.
            </Typography>
          </CardContent>
          <CardContent sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>
            <FormControl>
              <TextField
                id="keyword"
                label={<Typography variant="subtitle1">Mensagem:</Typography>}
                multiline
                onChange={e => handleSemResposta('message', e.target.value)}
                value={semResposta.message}
                maxRows={4}
                variant="standard"
              />
            </FormControl>
          </CardContent>
        </Card>
        <Card sx={{ width: '100%', height: '280px' }} id="maxRetryBotMessage">
          <CardContent>
            <Typography gutterBottom variant="h6" component="span">
              Máximo de Tentativas do Bot
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Uma vez excedido o número máximo de retentativas de
              pergunta/resposta, caso o cliente não envie uma respota válida, o
              bot irá realizar o encaminhamento para a Fila/Usuário
              configurados.
            </Typography>
          </CardContent>
          <CardContent sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>
            <TextField
              value={maxRetryBotMessage.number}
              onChange={e => handleSemResposta('time', e.target.value)}
            />
            <RadioComponentCard arg0={maxRetryBotMessage} />
          </CardContent>
        </Card>
        <Card sx={{ width: '100%', height: '280px' }} id="firstInteraction">
          <CardContent>
            <Typography gutterBottom variant="h6" component="span">
              Direcionamento na primeira interação
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Essa interação será acionada na primeira interação com o cliente,
              e o cliente será encaminhado para a Fila/Usuário configurados.
            </Typography>
          </CardContent>
          <CardContent sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>
            <RadioComponentCard arg0={firstInteraction} />
          </CardContent>
        </Card>
        <Card sx={{ width: '100%', height: '280px' }} id="outOpenHours">
          <CardContent>
            <Typography gutterBottom variant="h6" component="span">
              Se estiver fora do horário de atendimento
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Essa interação será acionada caso o cliente envie uma mensagem
              fora do horário de atendimento, e o cliente será encaminhado para
              a Fila/Usuário configurados.
            </Typography>
          </CardContent>
          <CardContent
            sx={{
              mt: 3,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <RadioComponentCard arg0={outOpenHours} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
