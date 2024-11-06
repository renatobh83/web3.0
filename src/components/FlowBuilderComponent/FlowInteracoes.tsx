import { Close, Message, North, South, Webhook } from '@mui/icons-material'
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import type { Node } from '@xyflow/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import useChatFlowStore from '../../store/chatFlow'
import React from 'react'
import { ListarWebhook } from '../../services/webhooks'

interface InteracoesProps {
  node: Node
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0
}

type DataType = {
  message?: string
  webhook?: {
    apiId: string,
    acao: string
  }
}
export const Interacoes = ({ node }: InteracoesProps) => {
  const [webhooks, setWebhooks] = useState([])

  const [selectApi, setSelectApi] = useState('')
  const { updateNodeData, updatePositionArr } = useChatFlowStore()
  const [hasChanges, setHasChanges] = useState(false)

  const [interacoes, setInteracoes] = useState<
    { type: string; id: string; shouldRemove?: boolean }[]
  >([])

  const theme = useTheme() // Obtém o tema atual

  // Verifica se o modo é escuro
  const isDarkMode = theme.palette.mode === 'dark'
  const [interacoesState, setInteracoesState] = useState<{
    [key: string]: {
      id: string
      type: string
      data: DataType
    }
  }>({})
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (
      Array.isArray(node.data.interactions) &&
      node.data?.interactions?.length
    ) {
      setInteracoes(node.data.interactions)
      node.data.interactions.map(interacao => {
        setInteracoesState(prev => ({
          ...prev,
          [interacao.id]: {
            ...prev[interacao.id],
            id: interacao.id,
            type: interacao.type,
            data: interacao.data,
          },
        }))
      })
    } else {
      setInteracoes([])
    }
  }, [node.id])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isEmptyObject(interacoesState)) {
      const iter = interacoes.map(iteracao => {
        // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
        if (interacoesState.hasOwnProperty(iteracao.id)) {
          return {
            ...iteracao,
            ...interacoesState[iteracao.id],
          }
        }
        return iteracao
      })
      setInteracoes(iter)
      setHasChanges(true) // Marca que houve alteração
    }
  }, [interacoesState])

  const addInteracao = (type: string) => {
    const newInteracao = {
      type: type,
      id: crypto.randomUUID(),
    }
    setInteracoes(prev => [...prev, newInteracao])
    setHasChanges(true) // Marca que houve alteração
  }
    ;[]
  const debounceRef = useRef<null | number>(null)
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      if (hasChanges) {
        if (node?.id) {
          // biome-ignore lint/complexity/noForEach: <explanation>
          interacoes.forEach(interacao =>
            updateNodeData(node.id, interacao, 'interactions')
          )
        }
        setHasChanges(false) // Resetar flag de alterações após salvar
      }
    }, 700) // Tempo de debounce em milissegundos (300ms neste exemplo)
    // Cleanup function para cancelar o timeout se `interacoes` mudar antes de concluir o debounce
    return () => {
      clearTimeout
    }
  }, [interacoes, hasChanges])

  const handlRemoveInteracao = (id: string) => {
    const newInteracoes = interacoes.map(
      iter =>
        iter.id === id
          ? { ...iter, shouldRemove: true } // Marca o item com a flag shouldRemove
          : iter // Mantém os outros itens inalterados
    )

    setHasChanges(true)
    setInteracoes(newInteracoes)
    // setInteracoesState({})
  }

  const handleChange = e => {
    const { id, name, value } = e.target
    setInteracoesState(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        id: id,
        type: name,
        data:
          name === 'MessageField'
            ? { message: value }
            : { webhook: { apiId: selectApi, acao: value } },
      },
    }))
  }
  function changePosition(from: number, to: number) {
    if (to >= 0 && to < interacoes.length) {
      // const newArr = [...interacoes]
      const newArr = interacoes.filter(
        item => item.shouldRemove === false || item.shouldRemove === undefined
      )
      newArr.splice(to, 0, newArr.splice(from, 1)[0]) // Move o item
      console.log(newArr)
      setInteracoes(newArr) // Atualiza o estado com a nova ordem
      updatePositionArr(node.id, newArr, 'interactions')
    }
  }
  const handleSelectRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log((event.target as HTMLInputElement).value)
    setSelectApi((event.target as HTMLInputElement).value)
  }
  const listarWebhook = useCallback(async () => {
    const { data } = await ListarWebhook()
    setWebhooks(data)
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    listarWebhook()
  }, [])
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
          {interacoes
            .filter(interacao => !interacao.shouldRemove) // Filtra os que devem ser renderizados
            .map((interacao, idx) => (
              <React.Fragment key={interacao.id}>
                <Box
                  sx={{
                    background: isDarkMode
                      ? theme.palette.background.default
                      : theme.palette.grey[200],
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
                      onClick={() => changePosition(idx, idx - 1)}
                    >
                      <North
                        sx={{ fontWeight: '500', width: 20, color: 'green' }}
                      />
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ minWidth: 10, mr: 1 }}
                      onClick={() => changePosition(idx, idx + 1)}
                    >
                      <South sx={{ fontWeight: '500', width: 20 }} />
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ minWidth: 10, mr: 1 }}
                      onClick={() => handlRemoveInteracao(interacao.id)}
                    >
                      <Close
                        sx={{ fontWeight: '500', width: 20, color: 'red' }}
                      />
                    </Button>

                    <Box sx={{ width: '100%', mt: 2, px: 3 }}>
                      {interacao.type === 'WebhookField' && (
                        <>
                          <RadioGroup
                            value={
                              interacoesState[interacao.id]?.data?.webhook
                                ?.apiId || selectApi
                            }
                            onChange={handleSelectRadio}
                            row
                            name="row-radio-buttons-group"
                          >
                            {webhooks
                              ?.filter(i => i.status === 'CONECTADA')
                              .map(w => (
                                <FormControlLabel
                                  key={w.id}
                                  value={w.id}
                                  control={<Radio size="small" />}
                                  label={w.nomeApi}
                                />
                              ))}
                          </RadioGroup>
                          <TextField
                            name={interacao.type}
                            id={interacao.id}
                            sx={{ mt: 3 }}
                            focused
                            value={
                              interacoesState[interacao.id]?.data?.webhook
                                ?.acao || ''
                            }
                            onChange={e => handleChange(e)}
                            label={
                              <Typography variant="subtitle1">
                                Digite a ação{' '}
                              </Typography>
                            }
                            multiline
                            maxRows={7}
                            fullWidth
                            variant="standard"
                          />
                        </>
                      )}

                      {interacao.type === 'MessageField' && (
                        <TextField
                          value={
                            interacoesState[interacao.id]?.data?.message ||
                            interacoesState[interacao.id]?.data?.webhook ||
                            ''
                          }
                          name={interacao.type}
                          id={interacao.id}
                          focused
                          onChange={e => handleChange(e)}
                          label={
                            <Typography variant="subtitle1">
                              Digite a mensagem{' '}
                            </Typography>
                          }
                          multiline
                          maxRows={7}
                          fullWidth
                          variant="standard"
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </React.Fragment>
            ))}
        </Box>
      </Box>
    </Box>
  )
}
