import { Close, Message, North, South, Webhook } from '@mui/icons-material'
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  TextField,
  Typography,
} from '@mui/material'
import type { Node } from '@xyflow/react'
import { useEffect, useState } from 'react'
import useChatFlowStore from '../../store/chatFlow'
interface InteracoesProps {
  node: Node
}

export const Interacoes = ({ node }: InteracoesProps) => {
  const [interacoes, setInteracoes] = useState<{ type: string; id: string }[]>(
    []
  )

  const addInteracao = (type: string) => {
    const newInteracao = {
      type: type,
      id: crypto.randomUUID(),
    }
    setInteracoes(prev => [...prev, newInteracao])
  }
  // useEffect(() => {
  //   setInteracoes(node?.data.interactions)
  // }, [node?.data.interactions])

  const handlRemoveInteracao = (id: string) => {
    const newInteracoes = interacoes.filter(i => i.id !== id)
    setInteracoes(newInteracoes)
  }

  function changePosition(arr: Node[], from: number, to: number) {
    if (to >= 0 && to < arr.length) {
      const newArr = [...arr]
      newArr.splice(to, 0, newArr.splice(from, 1)[0]) // Move o item
      setInteracoes(newArr) // Atualiza o estado com a nova ordem
      // handleNodeAtualizacaoCondicao(newArr)
      // if (node) {
      //   // Atualiza os dados no node (se necessário)
      //   node.data = {
      //     ...node.data,
      //     interactions: newArr,
      //   }
      // }
    }
  }

  return (
    <Box sx={{ mt: 1 }}>
      <ButtonGroup
        size="small"
        variant="outlined"
        aria-label="Basic button group"
        sx={{
          flexWrap: 'wrap',
          display: 'flex',
          justifyContent: 'center',
          px: '1px',
        }}
      >
        <Button
          endIcon={<Message />}
          onClick={() => addInteracao('MessageField')}
        >
          Enviar mensagem
        </Button>
        <Button
          endIcon={<Webhook />}
          onClick={() => addInteracao('WebhookField')}
        >
          Webhook
        </Button>
      </ButtonGroup>
      <Box
        sx={{
          height: 'calc(100vh - 435px)',
          my: 2,
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
            height: 'auto',
            width: '100%',
          }}
        >
          {interacoes.map((interacao, idx) => (
            <Box
              id={interacao.id}
              key={interacao.id}
              sx={{
                backgroundColor: '#f1f3f4',
                minHeight: '250px',
                transition: 'box-shadow 0.3s ease-in-out',
                my: 1,
                borderRadius: '0.4rem',
                width: '100%',
                border: '1px solid rgba(0, 0, 0, 0.12)',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  padding: 1 / 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  textAlign: 'left',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background-color 0.3s ease-in-out',
                }}
              >
                <Chip label={idx + 1} />
                <Box component={'span'} sx={{ flexGrow: '1' }} />
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 10, mr: 1 }}
                  onClick={() => changePosition(interacoes, idx, idx - 1)}
                >
                  <North
                    sx={{ fontWeight: '500', width: 20, color: 'green' }}
                  />
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 10, mr: 1 }}
                  onClick={() => changePosition(interacoes, idx, idx + 1)}
                >
                  <South sx={{ fontWeight: '500', width: 20 }} />
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 10, mr: 1 }}
                  onClick={() => handlRemoveInteracao(interacao.id)}
                >
                  <Close sx={{ fontWeight: '500', width: 20, color: 'red' }} />
                </Button>
                <TextField
                  // value={feedback}
                  // onChange={e => handleFeedbackMessage(e.target.value)}
                  label={
                    <Typography variant="subtitle1">
                      {interacao.type === 'WebhookField'
                        ? 'Adicone o webhook'
                        : 'Digite a mensagem'}
                    </Typography>
                  }
                  multiline
                  maxRows={7}
                  fullWidth
                  variant="standard"
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
