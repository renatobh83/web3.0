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
} from '@mui/material'
import type { Node } from '@xyflow/react'
import React, { useEffect, useState } from 'react'
import useChatFlowStore from '../../store/chatFlow'
import { previousDay } from 'date-fns'
import { unstable_DataStrategyFunction } from 'react-router-dom'

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

interface InteracoesProps {
  node: Node
}
const optionsSe = [
  { label: 'Qualquer resposta', value: 'US' },
  { label: 'Respostas', value: 'R' },
]
export const Condicoes = ({ node }: InteracoesProps) => {
  const { filas, usuarios, getEdgesByNodeId, getLabelByTarget } = useChatFlowStore()
  const { asSource, asTarget } = getEdgesByNodeId(node.id)

  const [optionsEtapas, setOptionsEtapas] = useState([])
  const [optionsFilas, setOptionsFilas] = useState([])
  const [optionsUsuarios, setOptionsUsuarios] = useState([])

  const [tempValue, setTempValue] = useState({});
  const [selectOption, setSelectOption] = useState<{
    id?: { selectValue: string }
  } | {}>({})
  const [radioChoice, setRadioChoice] = useState<{ id?: { value: string } } | {}>({})
  const [conditions, setConditions] = useState<{ type: string; id: string }[]>(
    []
  )
  const [conditionState, setConditionState] = useState<{
    [key: string]: {
      type: string
      condition?: string[]
      inputValue?: string
      queueId?: number
      nextStepId?: string
      closeTicket?: string
      userIdDestination?: number
    }
  }>({})

  useEffect(() => {
    setConditions([])
    console.log('change node')
  }, [node.id])

  function addCondiction() {
    setConditions(prev => [
      ...prev,
      {
        type: '',
        condition: [],
        id: crypto.randomUUID()
      },
    ])
  }
  function removeCondition(conditionId: string) {
    const remove = conditions.filter(cond => cond.id !== conditionId)
    setConditions(remove)
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    console.log('update', conditions)

    // useChatFlowStore.getState().updateNodeData(node?.id, conditions, 'conditions')
  }, [conditions])

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
      }));

      setTempValue(prevState => ({
        ...prevState,
        [id]: '', // Limpa o valor temporário
      }));
    }
  };
  // Função que controla o input temporário
  const handleChangeInputChips = (id, e) => {
    const value = e.target.value;
    setTempValue(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };
  const handleDeleteInputChips = (id: string, chipToDelete: string) => {
    setConditionState(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        condition: prevState[id].condition.filter(chip => chip !== chipToDelete),
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
    const newRadioValue = event.target.value

    setRadioChoice(prevState => ({
      ...prevState,
      [id]: newRadioValue, // Atualizar apenas o radioChoice do ID correto
    }))

    // Limpar o select quando o radio é alterado
    setSelectOption(prevState => ({
      ...prevState,
      [id]: '', // Resetar o valor do select para o ID correspondente
    }))

    if (newRadioValue === '3') {
      setConditionState((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          action: 3
        }
      }))
    }
  }
  const handleChangeSelectOptions = (id: string, e: any) => {
    const selectedValue = e.target.value as string

    setSelectOption(prevState => ({
      ...prevState,
      [id]: selectedValue, // Garantir que só o select do ID correto é atualizado
    }))

    if (radioChoice[id] === '0') {
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
    } else if (radioChoice[id] === '1') {
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
    } else if (radioChoice[id] === '2') {
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
            ...conditionState[condition.id]
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
      setConditions(newArr) // Atualiza o estado com a nova ordem

    }
  }

  return (
    <>
      <Box sx={{ mt: 1 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', pr: '4px' }}
        >
          <Button size="small" variant="outlined" onClick={() => addCondiction()}
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
          {conditions.map((condition, idx) => (
            <Box
              id={condition.id}
              key={condition.id}
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
                  onClick={() =>
                    removeCondition(condition.id)
                  }
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
                  value={
                    conditionState[condition.id]?.type || ''
                  }
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
                      onChange={e => handleChangeInputChips(condition.id, e)} // Atualiza o valor temporário ao digitar
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
                    value={radioChoice[condition.id] || ''}
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
                  {radioChoice[condition.id] !== "3" && (
                    <Select
                      id={`select_route-${condition.id}`}
                      value={selectOption[condition.id] || ''} // Valor carregado do estado
                      onChange={e =>
                        handleChangeSelectOptions(condition.id, e)
                      }
                    >
                      {/* Exibir as opções com base na escolha do radio */}
                      {radioChoice[condition.id] === '0' &&
                        optionsEtapas.map(source => (
                          <MenuItem
                            key={source.id}
                            value={source.target}
                          >
                            {getLabelByTarget(source.target)}
                          </MenuItem>
                        ))}
                      {radioChoice[condition.id] === '1' &&
                        optionsFilas.map(source => (
                          <MenuItem
                            key={source.id}
                            value={source.id}
                          >
                            {
                              source.queue
                            }
                          </MenuItem>
                        ))}
                      {radioChoice[condition.id] === '2' &&
                        optionsUsuarios.map(source => (
                          <MenuItem
                            key={source.id}
                            value={source.id}
                          >
                            {source.name}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                </FormControl>
              </Box>
            </Box>
          ))}
        </Box >
      </Box >
    </>
  )
}
