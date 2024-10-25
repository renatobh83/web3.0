import { Close, Message, North, South, Webhook } from '@mui/icons-material'
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import type { Node } from '@xyflow/react'
import React, { useEffect, useState } from 'react'
import useChatFlowStore from '../../store/chatFlow'
import { previousDay } from 'date-fns'
import { unstable_DataStrategyFunction } from 'react-router-dom'

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0
}

interface InteracoesProps {
  node: Node
}
const optionsSe = [
  { label: 'Qualquer resposta', value: 'US' },
  { label: 'Respostas', value: 'R' },
]
export const Condicoes = ({ node }: InteracoesProps) => {
  const {
    filas,
    usuarios,
    getEdgesByNodeId,
    getLabelByTarget,
    updateNodeData,
    updatePositionArr,
  } = useChatFlowStore()
  const { asSource } = getEdgesByNodeId(node.id)
  const theme = useTheme(); // Obtém o tema atual

  // Verifica se o modo é escuro
  const isDarkMode = theme.palette.mode === 'dark';
  const [optionsEtapas, setOptionsEtapas] = useState([])
  const [optionsFilas, setOptionsFilas] = useState([])
  const [optionsUsuarios, setOptionsUsuarios] = useState([])

  const [tempValue, setTempValue] = useState({})

  const [conditions, setConditions] = useState<
    { type: string; id: string; shouldRemove: boolean }[]
  >([])
  const [conditionState, setConditionState] = useState<{
    [key: string]: {
      id: string
      type: string
      action: number
      condition?: string[]
      inputValue?: string
      queueId?: string | null | number
      nextStepId?: string | null
      closeTicket?: string | null
      userIdDestination?: string | number | null
    }
  }>({})

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (node.data.conditions.length) {
      setConditions(node.data.conditions)
      node.data.conditions.map(c => {
        setConditionState(prevState => ({
          ...prevState,
          [c.id]: {
            ...prevState[c.id],
            action: c.action,
            id: c.id,
            type: c.type,
            nextStepId: c.nextStepId,
            userIdDestination: c.userIdDestination,
            queueId: c.queueId,
            condition: c.condition
          },
        }))
      })
    } else {
      setConditions([])
    }
  }, [node.id])

  function addCondiction() {
    setConditions(prev => [
      ...prev,
      {
        type: '',
        condition: [],
        id: crypto.randomUUID(),
      },
    ])
  }
  function removeCondition(conditionId: string) {
    const updatedConditions = conditions.map(
      cond =>
        cond.id === conditionId
          ? { ...cond, shouldRemove: true } // Marca o item com a flag shouldRemove
          : cond // Mantém os outros itens inalterados
    )
    setConditions(updatedConditions)
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (node?.id) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      conditions.forEach(cond => updateNodeData(node.id, cond, 'conditions'))
    }
  }, [conditions])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setOptionsFilas(filas)
    setOptionsUsuarios(usuarios)
    setOptionsEtapas(asSource)
  }, [filas, usuarios])

  // Função para lidar com a inserção de condition
  const handleKeyDown = (id, event) => {
    if (event.key === 'Enter' && tempValue[id]?.trim() !== '') {
      setConditionState(prevState => ({
        ...prevState,
        [id]: {
          ...(prevState[id] || { condition: [], inputValue: '' }),
          condition: [
            ...(prevState[id]?.condition || []),
            tempValue[id].trim(), // Usa o valor temporário ao pressionar "Enter"
          ],
          inputValue: '', // Limpa o campo após adicionar o chip
        },
      }))

      setTempValue(prevState => ({
        ...prevState,
        [id]: '', // Limpa o valor temporário
      }))
    }
  }
  // Função que controla o input temporário
  const handleChangeInputChips = (id, e) => {
    const value = e.target.value
    setTempValue(prevState => ({
      ...prevState,
      [id]: value,
    }))
  }
  const handleDeleteInputChips = (id: string, chipToDelete: string) => {
    setConditionState(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        condition: prevState[id].condition.filter(
          chip => chip !== chipToDelete
        ),
      },
    }))
  }

  // Função para capturar mudanças no Select e enviar o id
  const handleSelectSeChange = (
    id: string,
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const selectedValue = event.target.value as string
    setConditionState(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        type: selectedValue,
      },
    }))
  }
  const handleRadioChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRadioValue = Number(event.target.value)

    setConditionState(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        action: newRadioValue,
        nextStepId: '',
        userIdDestination: '',
        queueId: '',
      },
    }))

    if (newRadioValue === 3) {
      setConditionState(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          action: 3,
        },
      }))
    }
  }
  const handleChangeSelectOptions = (id: string, e: any) => {
    const selectedValue = e.target.value as string

    // setSelectOption(prevState => ({
    //   ...prevState,
    //   [id]: { value: selectedValue }, // Garantir que só o select do ID correto é atualizado
    // }))

    if (conditionState[id].action === 0) {
      setConditionState(prevState => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          action: 0,
          nextStepId: selectedValue,
          userIdDestination: null,
          queueId: null,
        },
      }))
    } else if (conditionState[id].action === 1) {
      setConditionState(prevState => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          action: 1,
          queueId: selectedValue,
          userIdDestination: null,
          nextStepId: null,
        },
      }))
    } else if (conditionState[id]?.action === 2) {
      setConditionState(prevState => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          action: 2,
          userIdDestination: selectedValue,
          queueId: null,
          nextStepId: null,
        },
      }))
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isEmptyObject(conditionState)) {
      const condicoes = conditions.map(condition => {
        // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
        if (conditionState.hasOwnProperty(condition.id)) {
          return {
            ...condition,
            ...conditionState[condition.id],
          }
        }
        return condition
      })
      setConditions(condicoes)
    }
  }, [conditionState])

  function changePosition(from: number, to: number) {
    if (to >= 0 && to < conditions.length) {
      const newArr = [...conditions]
      newArr.splice(to, 0, newArr.splice(from, 1)[0]) // Move o item
      setConditions(newArr) // Atualiza o estado com a nova orde
      updatePositionArr(node.id, newArr, 'conditions')
    }
  }

  return (
    <>
      <Box sx={{ mt: 1, }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: '4px' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => addCondiction()}
          >
            Add
          </Button>
        </Box>
      </Box>

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
          {conditions
            .filter(condition => !condition.shouldRemove) // Filtra os que devem ser renderizados
            .map((condition, idx) => (
              // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
              <React.Fragment key={condition.id}>
                <Box
                  id={condition.id}
                  key={idx}
                  sx={{
                    background: isDarkMode ? theme.palette.background.default : theme.palette.grey[200],
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
                      onClick={() => removeCondition(condition.id)}
                    >
                      <Close
                        sx={{ fontWeight: '500', width: 20, color: 'red' }}
                      />
                    </Button>
                  </Box>
                  <FormControl fullWidth sx={{ padding: 1, mt: 1 / 2 }}>
                    <InputLabel id={`condicaoSe-${condition.id}`}>
                      Se
                    </InputLabel>
                    <Select
                      id={`select_se-${condition.id}`}
                      value={conditionState[condition.id]?.type || ''}
                      onChange={e => handleSelectSeChange(condition.id, e)}
                      input={<OutlinedInput label="se" />}
                    >
                      {optionsSe.map(opt => (
                        <MenuItem key={opt.label} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {conditionState[condition.id]?.type === 'R' && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        {conditionState[condition.id].condition?.map(
                          (chip, index) => (

                            <Chip
                              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                              key={index}
                              label={chip}
                              onDelete={() =>
                                handleDeleteInputChips(condition.id, chip)
                              }
                              sx={{ margin: '4px' }}
                            />
                          )
                        )}
                        <TextField
                          variant="outlined"
                          value={tempValue[condition.id] || ''} // Usa o valor temporário durante a digitação
                          onChange={e =>
                            handleChangeInputChips(condition.id, e)
                          } // Atualiza o valor temporário ao digitar
                          onKeyDown={e => handleKeyDown(condition.id, e)} // Lida com a tecla Enter
                          placeholder="Digite e pressione Enter"
                          sx={{ width: '100%', margin: '4px' }}
                        />
                      </Box>
                    )}
                  </FormControl>
                  <Divider />
                  <Box sx={{ padding: 1 }}>
                    <Typography variant="subtitle1" sx={{ px: 1 }}>
                      Rotear para:
                    </Typography>

                    <FormControl>
                      <RadioGroup
                        row
                        name={condition.id}
                        // value={radioChoice[condition.id]?.value || ''}

                        value={
                          conditionState[condition.id]?.action !== undefined
                            ? conditionState[condition.id].action
                            : ''
                        }
                        id={`radio-${condition.id}`}
                        onChange={e => handleRadioChange(condition.id, e)}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <FormControlLabel
                          value="0"
                          disabled={!asSource.length}
                          control={<Radio size="small" />}
                          label="Etapa"
                        />
                        <FormControlLabel
                          value="1"
                          disabled={!optionsFilas.length}
                          control={<Radio size="small" />}
                          label="Fila"
                        />
                        <FormControlLabel
                          value="2"
                          disabled={!optionsUsuarios.length}
                          control={<Radio size="small" />}
                          label="Usúario"
                        />
                        <FormControlLabel
                          value="3"
                          control={<Radio size="small" />}
                          label="Encerar"
                        />
                      </RadioGroup>
                    </FormControl>
                    <FormControl fullWidth sx={{ padding: 1, mt: 1 / 2 }}>
                      {conditionState[condition.id]?.action !== 3 && (
                        <Select
                          id={`select_route-${condition.id}`}
                          // value={selectOption[condition.id]?.value || ''} // Valor carregado do estado
                          value={
                            conditionState[condition.id]?.userIdDestination ||
                            conditionState[condition.id]?.queueId ||
                            conditionState[condition.id]?.nextStepId ||
                            ''
                          } // Valor carregado do estado
                          onChange={e =>
                            handleChangeSelectOptions(condition.id, e)
                          }
                        >
                          {/* Exibir as opções com base na escolha do radio */}

                          {conditionState[condition.id]?.action === 0 &&
                            optionsEtapas.map(source => (
                              <MenuItem key={source.id} value={source.target}>
                                {getLabelByTarget(source.target)}
                              </MenuItem>
                            ))}
                          {conditionState[condition.id]?.action === 1 &&
                            optionsFilas.map(source => (
                              <MenuItem key={source.id} value={source.id}>
                                {source.queue}
                              </MenuItem>
                            ))}
                          {conditionState[condition.id]?.action === 2 &&
                            optionsUsuarios.map(source => (
                              <MenuItem key={source.id} value={source.id}>
                                {source.name}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    </FormControl>
                  </Box>
                </Box>
              </React.Fragment>
            ))}
        </Box>
      </Box>
    </>
  )
}
