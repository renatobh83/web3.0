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
  SelectChangeEvent,
  Tab,
  Tabs,
  TextField,
  Typography,
  debounce,
  useStepContext,
} from '@mui/material'
import { useReactFlow, type Node } from '@xyflow/react'
import { a11yProps, TabPanel } from '../MaterialUi/TablePanel'
import { useCallback, useEffect, useState } from 'react'
import {
  ArrowDropDown,
  Close,
  North,
  PreviewRounded,
  South,
} from '@mui/icons-material'
import useChatFlowStore from '../../store/chatFlow'
import { toast } from 'sonner'

const optionsSe = [
  { label: 'Qualquer resposta', value: 'US' },
  { label: 'Respostas', value: 'R' },
]

export const TabsDetails = ({
  node,
  atualizarNode,
}: { node: Node | undefined; atualizarNode: (arg0: Node) => void }) => {
  const { filas, usuarios, getEdgesByNodeId, getLabelByTarget, nodes } =
    useChatFlowStore()
  const nodeType = node?.type
  const [tabSelected, setTabSelected] = useState(0)
  const [actions, setActions] = useState<{
    [key: string]: {
      action: number
    }
  }>({})
  const [optionsEtapas, setOptionsEtapas] = useState([])
  const [optionsFilas, setOptionsFilas] = useState([])
  const [optionsUsuarios, setOptionsUsuarios] = useState([])

  const [selectOption, setSelectOption] = useState({})
  const [radioChoice, setRadioChoice] = useState({})
  const [conditionState, setConditionState] = useState<{
    [key: string]: {
      selectedOption: string
      chips: string[]
      inputValue: string
      queueId: number
      nextStepId: string
      closeTicket: string
      userIdDestination: number
    }
  }>({})

  const [conditions, setConditions] = useState([])

  const { asSource, asTarget } = getEdgesByNodeId(node.id)
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (node) {
      const initialRadioChoice = {}
      const initialSelectOption = {}
      const initialState = {} as {
        [key: string]: {
          selectedOption: string
          chips: string[]
          inputValue: string
          userIdDestination: string
          queueId: number
          nextStepId: string
        }
      }
      if (node.data.conditions) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        node.data.conditions.forEach(condition => {
          // Verifica se condition.condition é um array e inicializa chips corretamente
          if (!initialState[condition.id]) {
            if (condition.type === 'R') {
              initialState[condition.id] = {
                selectedOption: condition.type,
                chips: Array.isArray(condition.condition)
                  ? condition.condition
                  : [condition.condition], // Certifica que chips seja um array
                inputValue: '',
                queueId: condition.queueId,
                userIdDestination: condition.userIdDestination,
                nextStepId: condition.nextStepId,
              }
            } else {
              initialState[condition.id] = {
                selectedOption: condition.type,
                chips: [],
                inputValue: '',
                queueId: condition.queueId,
                userIdDestination: condition.userIdDestination,
                nextStepId: condition.nextStepId,
              }
            }
          }
          // Definir o valor do radioChoice com base nos dados salvos
          if (condition.queueId) {
            initialRadioChoice[condition.id] = 'fila'
            initialSelectOption[condition.id] = condition.queueId
            setOptionsFilas(filas)
          } else if (condition.userIdDestination) {
            initialRadioChoice[condition.id] = 'usuario'
            initialSelectOption[condition.id] = condition.userIdDestination
            setOptionsUsuarios(usuarios)
          } else if (condition.nextStepId) {
            initialRadioChoice[condition.id] = 'etapa'
            initialSelectOption[condition.id] = condition.nextStepId
            setOptionsEtapas(asSource)
          } else {
            initialRadioChoice[condition.id] = '' // Se nenhum estiver selecionado
            initialSelectOption[condition.id] = '' // Valor padrão
          }
        })

        setConditions(node.data.conditions)
        setConditionState(initialState)
        setRadioChoice(initialRadioChoice) // Carregar o estado do Radio
        setSelectOption(initialSelectOption) // Carregar o estado do Select
      } else {
        setConditions([])
      }
    }
  }, [node?.id])

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleChangeTabs = (newValue: any) => {
    setTabSelected(newValue)
  }

  const handleNodeAtualizacaoCondicao = novasCondicoes => {
    if (node) {
      const dataNew = {
        ...node.data,
        conditions: novasCondicoes,
      }
      const nodeAtt = {
        ...node,
        data: dataNew,
      }

      atualizarNode(nodeAtt)
    }
  }
  //   const salvarPainelDebounced = useCallback(debounce(onSavePanel, 1000), [])
  function addCondiction() {
    const newIndex = conditions.length
    console.log(newIndex)
    const id = crypto.randomUUID()
    setConditions(prev => [
      ...prev,
      {
        type: '',
        condition: [],
        id,
      },
    ])
    setActions(prev => ({
      ...prev,
      [id]: { action: newIndex }, // Adiciona a ação com o índice correspondente
    }))
  }
  function removeCondition(arr, id) {
    // Filtra as condições para remover a que possui o id correspondente
    const newConditions = arr.filter(condition => condition.id !== id)

    // Atualiza as condições
    handleNodeAtualizacaoCondicao(newConditions)
    setConditions(newConditions)

    // // Reindexa as ações
    // setActions(prev => {
    //   // Cria um novo objeto de ações reindexado
    //   const newActions = {}

    //   // Reindexa as ações de acordo com as novas condições
    //   newConditions.forEach((condition, index) => {
    //     newActions[index] = { action: index } // Define a ação como o novo índice
    //   })

    //   return newActions
    // })
    // setActions(prev => {
    //   const newActions = { ...prev }
    //   delete newActions[id] // Remove a ação correspondente ao id da condição removida

    //   // Reindexa as ações para as condições restantes, se necessário
    //   newConditions.forEach(condition => {
    //     if (!newActions[condition.id]) {
    //       newActions[condition.id] = { action: Object.keys(newActions).length } // Define a ação como o novo índice
    //     }
    //   })

    //   return newActions
    // })
    // setActions(prev => {
    //   const newActions = { ...prev }
    //   delete newActions[id] // Remove a ação que corresponde ao id da condição removida

    //   // Reindexa as ações restantes
    //   let index = 0 // Para reindexar as ações de 0 até N
    //   newConditions.forEach(condition => {
    //     // Se a ação não estiver presente, a reindexação é feita aqui
    //     if (!newActions[condition.id]) {
    //       newActions[condition.id] = { action: index++ } // Define a nova ação com o índice atual
    //     }
    //   })

    //   return newActions // Retorna as ações reindexadas
    // })
    setActions(prev => {
      const newActions = { ...prev }
      delete newActions[id] // Remove a ação que corresponde ao id da condição removida

      // Reindexa as ações restantes
      let index = 0 // Para reindexar as ações de 0 até N
      newConditions.forEach(condition => {
        // Se a ação não estiver presente, a reindexação é feita aqui
        newActions[condition.id] = { action: index++ } // Define a nova ação com o índice atual
      })

      return newActions // Retorna as ações reindexadas
    })
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    handleNodeAtualizacaoCondicao(conditions)
  }, [conditions])

  // Função para capturar mudanças no Select e enviar o id
  const handleSelectChange = (
    id: string,
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const selectedValue = event.target.value as string
    setConditionState(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        selectedOption: selectedValue,
      },
    }))
  }
  // Função para lidar com a inserção de chips
  const handleKeyDown = (
    id: string,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === 'Enter' &&
      conditionState[id]?.inputValue?.trim() !== ''
    ) {
      setConditionState(prevState => ({
        ...prevState,
        [id]: {
          ...(prevState[id] || { chips: [], inputValue: '' }), // Garante que tenha uma estrutura inicial
          chips: [
            ...(prevState[id]?.chips || []),
            conditionState[id].inputValue.trim(),
          ], // Adiciona o chip
          inputValue: '', // Limpa o campo de input após adicionar o chip
        },
      }))
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const updatedConditions = conditions.map(c => {
      if (conditionState[c.id]) {
        // Lógica para o tipo "US"

        if (conditionState[c.id].selectedOption === 'US') {
          return {
            ...c,
            type: 'US',
            condition: [],
            action: actions[c.id]?.action,
            nextStepId: conditionState[c.id].nextStepId,
            userIdDestination: conditionState[c.id].userIdDestination,
            queueId: conditionState[c.id].queueId,
          }
        }

        // Lógica para o tipo "R"
        if (conditionState[c.id].selectedOption === 'R') {
          return {
            ...c,
            type: 'R',
            action: actions[c.id]?.action,
            nextStepId: conditionState[c.id].nextStepId,
            userIdDestination: conditionState[c.id].userIdDestination,
            queueId: conditionState[c.id].queueId,
            condition: conditionState[c.id].chips, // Substitui diretamente pelos chips do estado atual
          }
        }
      }

      return c // Retorna a condição original se não houver alteração no estado
    })

    handleNodeAtualizacaoCondicao(updatedConditions)
  }, [conditionState])

  // Função para deletar um chip
  const handleDelete = (id: string, chipToDelete: string) => {
    setConditionState(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        chips: prevState[id].chips.filter(chip => chip !== chipToDelete),
      },
    }))
  }
  const TabsSelect = (
    <Tabs
      sx={{ mt: 2, minHeight: 60 }}
      variant="fullWidth"
      value={tabSelected}
      onChange={(_event, newValue) => handleChangeTabs(newValue)}
    >
      <Tab label={'interacoes'} {...a11yProps(0, 'interacoes')} />
      <Tab label={'Condicoes'} {...a11yProps(1, 'condicoes')} />
    </Tabs>
  )

  function changePosition(arr: Node[], from: number, to: number) {
    if (to >= 0 && to < arr.length) {
      const newArr = [...arr]
      newArr.splice(to, 0, newArr.splice(from, 1)[0]) // Move o item
      setConditions(newArr) // Atualiza o estado com a nova ordem
      handleNodeAtualizacaoCondicao(newArr)
      if (node) {
        // Atualiza os dados no node (se necessário)
        node.data = {
          ...node.data,
          conditions: newArr,
        }
      }
    }
  }

  const handleChangeSelectOptions = (id, e) => {
    const selectedValue = e.target.value

    setSelectOption(prevState => ({
      ...prevState,
      [id]: selectedValue, // Garantir que só o select do ID correto é atualizado
    }))

    if (radioChoice[id] === 'etapa') {
      setConditionState(prevState => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          nextStepId: selectedValue,
          userIdDestination: null,
          queueId: null,
        },
      }))
    } else if (radioChoice[id] === 'fila') {
      setConditionState(prevState => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          queueId: selectedValue,
          userIdDestination: null,
          nextStepId: null,
        },
      }))
    } else if (radioChoice[id] === 'usuario') {
      setConditionState(prevState => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          userIdDestination: selectedValue,
          queueId: null,
          nextStepId: null,
        },
      }))
    }
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

    if (newRadioValue === 'etapa') {
      setOptionsEtapas(asSource) // Aqui você carrega as etapas
    } else if (newRadioValue === 'fila') {
      setOptionsFilas(filas) // Aqui você carrega as filas
    } else if (newRadioValue === 'usuario') {
      setOptionsUsuarios(usuarios) // Aqui você carrega os usuários
    }
  }

  return (
    <>
      {TabsSelect}
      <TabPanel value={tabSelected} index={0}>
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
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
            <Button>Three</Button>
            <Button>Three</Button>
            <Button>Three</Button>
          </ButtonGroup>
        </Box>
      </TabPanel>
      <TabPanel value={tabSelected} index={1}>
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: '4px' }}>
            <Button size="small" variant="outlined" onClick={addCondiction}>
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
                {}
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
                    onClick={() => changePosition(conditions, idx, idx - 1)}
                  >
                    <North
                      sx={{ fontWeight: '500', width: 20, color: 'green' }}
                    />
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 10, mr: 1 }}
                    onClick={() => changePosition(conditions, idx, idx + 1)}
                  >
                    <South sx={{ fontWeight: '500', width: 20 }} />
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 10, mr: 1 }}
                    onClick={() => removeCondition(conditions, condition.id)}
                  >
                    <Close
                      sx={{ fontWeight: '500', width: 20, color: 'red' }}
                    />
                  </Button>
                </Box>
                <FormControl fullWidth sx={{ padding: 1, mt: 1 / 2 }}>
                  <InputLabel id={`condicaoSe-${condition.id}`}>Se</InputLabel>
                  <Select
                    id={`select_se-${condition.id}`}
                    value={conditionState[condition.id]?.selectedOption || ''}
                    onChange={e => handleSelectChange(condition.id, e)}
                    input={<OutlinedInput label="se" />}
                  >
                    {optionsSe.map(opt => (
                      <MenuItem key={opt.label} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {conditionState[condition.id]?.selectedOption === 'R' && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      {conditionState[condition.id].chips?.map(
                        (chip, index) => (
                          <Chip
                            key={index}
                            label={chip}
                            onDelete={() => handleDelete(condition.id, chip)}
                            sx={{ margin: '4px' }}
                          />
                        )
                      )}
                      <TextField
                        variant="outlined"
                        value={conditionState[condition.id]?.inputValue || ''}
                        onChange={e =>
                          setConditionState(prevState => ({
                            ...prevState,
                            [condition.id]: {
                              ...(prevState[condition.id] || {
                                chips: [],
                                inputValue: '',
                              }), // Garante que tenha uma estrutura inicial
                              inputValue: e.target.value,
                            },
                          }))
                        }
                        onKeyDown={e => handleKeyDown(condition.id, e)}
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
                        value="etapa"
                        disabled={!asSource.length}
                        control={<Radio size="small" />}
                        label="Etapa"
                      />
                      <FormControlLabel
                        value="fila"
                        control={<Radio size="small" />}
                        label="Fila"
                      />
                      <FormControlLabel
                        value="usuario"
                        control={<Radio size="small" />}
                        label="Usúario"
                      />
                      <FormControlLabel
                        value="encerar"
                        control={<Radio size="small" />}
                        label="Encerar"
                      />
                    </RadioGroup>
                  </FormControl>
                  <FormControl fullWidth sx={{ padding: 1, mt: 1 / 2 }}>
                    <Select
                      id={`select_route-${condition.id}`}
                      value={selectOption[condition.id] || ''} // Valor carregado do estado
                      onChange={e => handleChangeSelectOptions(condition.id, e)}
                    >
                      {/* Exibir as opções com base na escolha do radio */}
                      {radioChoice[condition.id] === 'etapa' &&
                        optionsEtapas.map(source => (
                          <MenuItem
                            key={source.id}
                            value={source.target || source.id}
                          >
                            {source.name ||
                              source.queue ||
                              getLabelByTarget(source.target)}
                          </MenuItem>
                        ))}
                      {radioChoice[condition.id] === 'fila' &&
                        optionsFilas.map(source => (
                          <MenuItem
                            key={source.id}
                            value={source.target || source.id}
                          >
                            {source.name ||
                              source.queue ||
                              getLabelByTarget(source.target)}
                          </MenuItem>
                        ))}
                      {radioChoice[condition.id] === 'usuario' &&
                        optionsUsuarios.map(source => (
                          <MenuItem
                            key={source.id}
                            value={source.target || source.id}
                          >
                            {source.name ||
                              source.queue ||
                              getLabelByTarget(source.target)}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </TabPanel>
    </>
  )
}
