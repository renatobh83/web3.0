import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
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
import { TabConfiguracao } from './TabConfiguracao'
import { Interacoes } from './FlowInteracoes'

const optionsSe = [
  { label: 'Qualquer resposta', value: 'US' },
  { label: 'Respostas', value: 'R' },
]
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};



export const TabsDetails = ({
  node,
  atualizarNode,
}: { node: Node | undefined; atualizarNode: (arg0: Node) => void }) => {

  const { filas, usuarios, getEdgesByNodeId, getLabelByTarget, updateNode, addConditionToNode } =
    useChatFlowStore()
  const nodeType = node?.type
  const [tabSelected, setTabSelected] = useState(0)

  const [optionsEtapas, setOptionsEtapas] = useState([])
  const [optionsFilas, setOptionsFilas] = useState([])
  const [optionsUsuarios, setOptionsUsuarios] = useState([])
  const [tempValue, setTempValue] = useState({});
  const [selectOption, setSelectOption] = useState({})
  const [radioChoice, setRadioChoice] = useState({})
  const [conditionState, setConditionState] = useState<{
    [key: string]: {
      type: string
      condition: string[]
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
          type: string
          condition: string[]
          inputValue: string
          userIdDestination: string
          queueId: number
          nextStepId: string
        }
      }
      if (node.data.conditions) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        node.data.conditions.forEach(condition => {
          // Verifica se condition.condition é um array e inicializa condition corretamente
          if (!initialState[condition.id]) {
            if (condition.type === 'R') {
              initialState[condition.id] = {
                type: condition.type,
                condition: Array.isArray(condition.condition)
                  ? condition.condition
                  : [condition.condition], // Certifica que condition seja um array
                inputValue: '',
                queueId: condition.queueId,
                userIdDestination: condition.userIdDestination,
                nextStepId: condition.nextStepId,
              }
            } else {
              initialState[condition.id] = {
                type: condition.type,
                condition: [],
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
            // setOptionsEtapas(asSource)
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

  const handleNodeAtualizacaoCondicao = (novasCondicoes: any[]) => { }

  function addCondiction() {
    const newIndex = conditions.length
    const id = crypto.randomUUID()
    setConditions(prev => [
      ...prev,
      {
        type: '',
        condition: [],
        id,
      },
    ])

  }
  function removeCondition(arr, id) {
    // Filtra as condições para remover a que possui o id correspondente
    const newConditions = arr.filter(condition => condition.id !== id)
    setConditions(newConditions)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (conditions.length >= 1) {
      console.log(conditions)
      // addConditionToNode(node?.id, conditions)
    }
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
        type: selectedValue,
      },
    }))
  }

  // Função de debounce
  const debouncedUpdate = debounce((id, value) => {
    setConditionState(prevState => ({
      ...prevState,
      [id]: {
        ...(prevState[id] || { condition: [], inputValue: '' }),
        inputValue: value,
      },
    }));
  }, 1500); // 500ms de debounce
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

  const matchingIdsObj = () => {
    const radioIds = Object.keys(radioChoice);
    // Verifica se algum ID de radioChoice existe em conditionState
    const matchingIds = radioIds.filter(id => conditionState.hasOwnProperty(id));
    // Exibe os IDs correspondentes e os estados correspondentes, se houver
    if (matchingIds.length > 0) {
      return true
    }
    return false
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isEmptyObject(conditionState)) {
      if (matchingIdsObj()) {
        const condicoes = conditions.map(condition => {
          if (conditionState.hasOwnProperty(condition.id)) {
            return {
              ...condition,
              ...conditionState[condition.id]
            }
          }
          return condition
        })
        console.log(condicoes)
        setConditions(condicoes)
      }
      // handleNodeAtualizacaoCondicao(updatedConditions)
    }
  }, [conditionState])

  // Função para deletar um chip
  const handleDelete = (id: string, chipToDelete: string) => {
    setConditionState(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        condition: prevState[id].condition.filter(chip => chip !== chipToDelete),
      },
    }))
  }


  function changePosition(arr: Node[], from: number, to: number) {
    if (to >= 0 && to < arr.length) {
      const newArr = [...arr]
      newArr.splice(to, 0, newArr.splice(from, 1)[0]) // Move o item
      setConditions(newArr) // Atualiza o estado com a nova ordem

      // handleNodeAtualizacaoCondicao(newArr)
      // if (node) {
      //   // Atualiza os dados no node (se necessário)
      //   node.data = {
      //     ...node.data,
      //     conditions: newArr,
      //   }
      // }
    }
  }
  // Função que controla o input temporário
  const handleChange = (id, e) => {
    const value = e.target.value;
    setTempValue(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };
  const handleChangeSelectOptions = (id, e) => {
    const selectedValue = e.target.value

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

    if (newRadioValue === '0') {
      setOptionsEtapas(asSource) // Aqui você carrega as etapas
    } else if (newRadioValue === '1') {
      setOptionsFilas(filas) // Aqui você carrega as filas
    } else if (newRadioValue === '2') {
      setOptionsUsuarios(usuarios) // Aqui você carrega os usuários
    } else if (newRadioValue === '3') {
      setConditionState((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          action: 3
        }
      }))

    }
  }

  return (
    <>
      {nodeType === 'configuracao' ? (
        <TabConfiguracao node={node} />

      ) : nodeType === 'start' ? (
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
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="span">
                Etapa representa o contato inicial.
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                - Caso seja o primeiro contato do cliente, o sistema salvará
                automaticamente na agenda as informações do cliente. - O Bot irá
                interagir nos atendimentos iniciados pelos clientes. - O Bot irá
                parar de interagir caso o atendimento seja assumido por um
                usuário.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <>
          <Tabs
            sx={{ mt: 2, minHeight: 60 }}
            variant="fullWidth"
            value={tabSelected}
            onChange={(_event, newValue) => handleChangeTabs(newValue)}
          >
            <Tab label={'interações'} {...a11yProps(0, 'interacoes')} />
            <Tab label={'Condições'} {...a11yProps(1, 'condicoes')} />
          </Tabs>
          <TabPanel value={tabSelected} index={0}>
            <Interacoes node={node} />
          </TabPanel>
          <TabPanel value={tabSelected} index={1}>
            <Box sx={{ mt: 1 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'flex-end', pr: '4px' }}
              >
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
                        onClick={() =>
                          removeCondition(conditions, condition.id)
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
                        onChange={e => handleSelectChange(condition.id, e)}
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
                                key={index}
                                label={chip}
                                onDelete={() =>
                                  handleDelete(condition.id, chip)
                                }
                                sx={{ margin: '4px' }}
                              />
                            )
                          )}
                          <TextField
                            variant="outlined"
                            value={tempValue[condition.id] || ''} // Usa o valor temporário durante a digitação
                            onChange={e => handleChange(condition.id, e)} // Atualiza o valor temporário ao digitar
                            onKeyDown={e => handleKeyDown(condition.id, e)} // Lida com a tecla Enter
                            placeholder="Digite e pressione Enter"
                            sx={{ width: '100%', margin: '4px' }}
                          />
                          {/* <TextField
                            variant="outlined"
                            value={
                              conditionState[condition.id]?.inputValue || ''
                            }
                            onChange={e =>
                              setConditionState(prevState => ({
                                ...prevState,
                                [condition.id]: {
                                  ...(prevState[condition.id] || {
                                    condition: [],
                                    inputValue: '',
                                  }), // Garante que tenha uma estrutura inicial
                                  inputValue: e.target.value,
                                },
                              }))
                            }
                            onKeyDown={e => handleKeyDown(condition.id, e)}
                            placeholder="Digite e pressione Enter"
                            sx={{ width: '100%', margin: '4px' }}
                          /> */}
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
                      </FormControl>
                      <FormControl fullWidth sx={{ padding: 1, mt: 1 / 2 }}>
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
                                {

                                  getLabelByTarget(source.target)
                                }
                              </MenuItem>
                            ))}
                          {radioChoice[condition.id] === '1' &&
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
                          {radioChoice[condition.id] === '2' &&
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
      )}
    </>
  )
}
