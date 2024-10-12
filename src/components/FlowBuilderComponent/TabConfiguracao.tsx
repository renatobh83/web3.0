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
interface TabConfiguracaoProps {
  node: Node | undefined
}

export const TabConfiguracao = ({ node }: TabConfiguracaoProps) => {
  const {
    welcomeMessage,
    farewellMessage,
    maxRetryBotMessage,
    notOptionsSelectMessage,
    notResponseMessage,
    outOpenHours,
    firstInteraction,
    keyword,
  } = node?.data

  const { filas, usuarios } = useChatFlowStore()
  const [optionsFilas, setOptionsFilas] = useState([])
  const [selectOption, setSelectOption] = useState({})
  const [optionsUsuarios, setOptionsUsuarios] = useState([])
  const [radioChoiceAusencia, setRadioChoiceAusencia] = useState({})
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

  useEffect(() => {
    setMessagewelcomeMessage(welcomeMessage.message || '')
    setFeeedback(notOptionsSelectMessage.message || '')
    setMessageKeyword(keyword.message || '')
    setSemResposta(notResponseMessage)
    if (notResponseMessage.type === 1) {
      // setOptionsFilas(filas)
      handleRadioChange(node.id, '1')
      console.log(semResposta)
      setSelectOption(prevState => ({
        ...prevState,
        [node.id]: notResponseMessage.destiny, // Garantir que só o select do ID correto é atualizado
      }))
    } else if (notResponseMessage.type === 2) {
      // setOptionsUsuarios(usuarios)
      handleRadioChange(node.id, '2')
      setSelectOption(prevState => ({
        ...prevState,
        [node.id]: notResponseMessage.destiny, // Garantir que só o select do ID correto é atualizado
      }))
    } else if (notResponseMessage.type === 3) {
      handleRadioChange(node.id, '3')
    }
  }, [])

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

  const handleRadioChange = (id: string, event: string) => {
    const newRadioValue = event
    setRadioChoiceAusencia(prevState => ({
      ...prevState,
      [id]: newRadioValue, // Atualizar apenas o radioChoiceAusencia do ID correto
    }))

    // Limpar o select quando o radio é alterado
    setSelectOption(prevState => ({
      ...prevState,
      [id]: '', // Resetar o valor do select para o ID correspondente
    }))

    if (newRadioValue === '1') {
      setOptionsFilas(filas) // Aqui você carrega as filas
    } else if (newRadioValue === '2') {
      setOptionsUsuarios(usuarios) // Aqui você carrega os usuários
    } else if (newRadioValue === '3') {
      setSemResposta(prev => ({
        ...prev,
        type: 3,
        destiny: null,
      }))
      notResponseMessage.type = 3
    }
  }
  const handleChangeSelectOptions = (id, e) => {
    const selectedValue = e.target.value

    setSelectOption(prevState => ({
      ...prevState,
      [id]: selectedValue, // Garantir que só o select do ID correto é atualizado
    }))
    if (radioChoiceAusencia[id] === '1') {
      setSemResposta(prev => ({
        ...prev,
        type: 1,
        destiny: selectedValue,
      }))
      notResponseMessage.type = 1
      notResponseMessage.destiny = selectedValue
    } else if (radioChoiceAusencia[id] === '2') {
      setSemResposta(prev => ({
        ...prev,
        type: 2,
        destiny: selectedValue,
      }))
      notResponseMessage.type = 2
      notResponseMessage.destiny = selectedValue
    }
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
        <Card sx={{ width: '100%', height: '280px' }}>
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
                id="notOptionsSelectMessage"
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
        <Card sx={{ width: '100%', height: '280px' }}>
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
            <FormControl>
              <RadioGroup
                row
                value={radioChoiceAusencia[node.id] || ''}
                onChange={e => handleRadioChange(node.id, e.target.value)}
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio size="small" />}
                  label="Fila"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio size="small" />}
                  label="Usúario"
                />
                <FormControlLabel
                  value="3"
                  control={<Radio size="small" />}
                  label="Encerar"
                />
              </RadioGroup>
              {radioChoiceAusencia[node.id] !== '3' && (
                <Select
                  id={`select_route-${node.id}`}
                  value={selectOption[node.id] || ''} // Valor carregado do estado
                  onChange={e => handleChangeSelectOptions(node.id, e)}
                >
                  {/* Exibir as opções com base na escolha do radio */}

                  {radioChoiceAusencia[node.id] === '1' &&
                    optionsFilas.map(source => (
                      <MenuItem
                        key={source.id}
                        value={source.target || source.id}
                      >
                        {source.queue}
                      </MenuItem>
                    ))}
                  {radioChoiceAusencia[node.id] === '2' &&
                    optionsUsuarios.map(source => (
                      <MenuItem
                        key={source.id}
                        value={source.target || source.id}
                      >
                        {source.name}
                      </MenuItem>
                    ))}
                </Select>
              )}
            </FormControl>
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
      </Box>
    </Box>
  )
}
