import { Box, Button, ButtonGroup, Chip, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, SelectChangeEvent, Tab, Tabs, TextField, Typography, useStepContext } from "@mui/material";
import { useReactFlow, type Node } from "@xyflow/react";
import { a11yProps, TabPanel } from "../MaterialUi/TablePanel";
import { useEffect, useState } from "react";
import { ArrowDropDown, Close, North, PreviewRounded, South } from "@mui/icons-material";
import useChatFlowStore from "../../store/chatFlow";

const optionsSe = [
    { label: 'Qualquer resposta', value: 'US' },
    { label: 'Respostas', value: 'R' }
]

export const TabsDetails = ({ node, atualizarNode }: { node: Node | undefined, atualizarNode: (arg0: Node) => void }) => {



    const { filas, usuarios, getEdgesByNodeId } = useChatFlowStore()
    const nodeType = node?.type
    const [tabSelected, setTabSelected] = useState(0)
    const [conditionState, setConditionState] = useState<{
        [key: string]: { selectedOption: string; chips: string[]; inputValue: string }
    }>({});

    const [conditions, setConditions] = useState([]);


    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (node) {
            const { asSource, asTarget } = getEdgesByNodeId(node.id)
            console.log(asSource)
            const initialState = {} as { [key: string]: { selectedOption: string; chips: string[]; inputValue: string } };
            if (node.data.conditions) {
                // biome-ignore lint/complexity/noForEach: <explanation>
                node.data.conditions.forEach(condition => {
                    // Verifica se condition.condition é um array e inicializa chips corretamente
                    if (!initialState[condition.id]) {
                        if (condition.type === "R") {
                            initialState[condition.id] = {
                                selectedOption: condition.type,
                                chips: Array.isArray(condition.condition) ? condition.condition : [condition.condition], // Certifica que chips seja um array
                                inputValue: ''
                            };
                        } else {
                            initialState[condition.id] = {
                                selectedOption: condition.type,
                                chips: [],
                                inputValue: ''
                            };
                        }
                    }
                });
                setConditions(node.data.conditions);
                setConditionState(initialState);
            } else {
                setConditions([]);
            }
        }
    }, [node?.id]);


    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleChangeTabs = (newValue: any) => {
        setTabSelected(newValue)
    }


    const handleNodeAtualizacaoCondicao = (novasCondicoes) => {
        if (node) {
            const dataNew = {
                ...node.data,
                conditions: novasCondicoes
            }
            const nodeAtt = {
                ...node,
                data: dataNew
            }
            atualizarNode(nodeAtt)
        }
    }
    function addCondiction() {
        setConditions(prev => [...prev, {
            type: '',
            condition: [],
            id: crypto.randomUUID()
        }])

    }
    function removeCondition(arr, id) {
        const newConditions = arr.filter(condition => condition.id !== id)
        handleNodeAtualizacaoCondicao(newConditions)
        setConditions(newConditions)

    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {

        handleNodeAtualizacaoCondicao(conditions)
    }, [conditions])

    // Função para capturar mudanças no Select e enviar o id
    const handleSelectChange = (id: string, event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedValue = event.target.value as string;
        setConditionState(prevState => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                selectedOption: selectedValue,
            },
        }));
    };
    // Função para lidar com a inserção de chips
    const handleKeyDown = (id: string, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && (conditionState[id]?.inputValue?.trim() !== "")) {
            setConditionState(prevState => ({
                ...prevState,
                [id]: {
                    ...prevState[id] || { chips: [], inputValue: '' }, // Garante que tenha uma estrutura inicial
                    chips: [...(prevState[id]?.chips || []), conditionState[id].inputValue.trim()], // Adiciona o chip
                    inputValue: "",  // Limpa o campo de input após adicionar o chip
                },
            }));
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const updatedConditions = conditions.map(c => {
            if (conditionState[c.id]) {
                // Lógica para o tipo "US"
                if (conditionState[c.id].selectedOption === "US") {
                    return {
                        ...c,
                        type: "US",
                        action: 0,
                        nextStepId: null,
                        userIdDestination: null,
                        condition: []
                    };
                }

                // Lógica para o tipo "R"
                if (conditionState[c.id].selectedOption === "R") {
                    return {
                        ...c,
                        type: "R",
                        action: 1,
                        queueId: 2,
                        nextStepId: null,
                        userIdDestination: null,
                        closeTicket: null,
                        condition: conditionState[c.id].chips // Substitui diretamente pelos chips do estado atual
                    };
                }
            }

            return c; // Retorna a condição original se não houver alteração no estado
        });

        handleNodeAtualizacaoCondicao(updatedConditions);
    }, [conditionState]);


    // Função para deletar um chip
    const handleDelete = (id: string, chipToDelete: string) => {
        setConditionState(prevState => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                chips: prevState[id].chips.filter(chip => chip !== chipToDelete),
            },
        }));
    };
    const TabsSelect = (
        <Tabs
            sx={{ mt: 2, minHeight: 60 }}
            variant="fullWidth"
            value={tabSelected}
            onChange={(_event, newValue) => handleChangeTabs(newValue)}
        >
            <Tab
                label={"interacoes"}
                {...a11yProps(0, 'interacoes')}
            />
            <Tab
                label={"Condicoes"}
                {...a11yProps(1, 'condicoes')}
            />
        </Tabs>
    )

    function changePosition(arr: Node[], from: number, to: number) {
        if (to >= 0 && to < arr.length) {
            const newArr = [...arr];
            newArr.splice(to, 0, newArr.splice(from, 1)[0]); // Move o item
            setConditions(newArr); // Atualiza o estado com a nova ordem
            handleNodeAtualizacaoCondicao(newArr)
            if (node) {
                // Atualiza os dados no node (se necessário)
                node.data = {
                    ...node.data,
                    conditions: newArr,
                };
            }
        }
    }

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
    };

    return (
        <>
            {TabsSelect}
            < TabPanel value={tabSelected} index={0} >
                <Box sx={{ mt: 1 }}>
                    <ButtonGroup size="small" variant="outlined" aria-label="Basic button group"
                        sx={{ flexWrap: 'wrap', display: 'flex', justifyContent: 'center', px: '1px' }}>
                        <Button>One</Button>
                        <Button>Two</Button>
                        <Button>Three</Button>
                        <Button>Three</Button>
                        <Button>Three</Button>
                        <Button>Three</Button>
                    </ButtonGroup>
                </Box>
            </TabPanel >
            < TabPanel value={tabSelected} index={1}  >
                <Box sx={{ mt: 1 }} >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: '4px' }}>
                        <Button size="small" variant="outlined" onClick={addCondiction} >Add</Button>
                    </Box>
                </Box>

                <Box sx={{
                    height: 'calc(100vh - 435px)',
                    my: 2,
                    transition: 'background-color 0.3s ease-in-out',
                    overflow: 'auto',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',

                }}>

                    <Box id="content" sx={{
                        height: 'auto',
                        width: '100%'
                    }}>
                        {conditions.map((condition, idx) => (

                            <Box id={condition.id} key={condition.id}
                                sx={{
                                    backgroundColor: '#f1f3f4',
                                    minHeight: '250px',
                                    transition: 'box-shadow 0.3s ease-in-out',
                                    my: 1,
                                    borderRadius: '0.4rem',
                                    width: '100%',
                                    border: '1px solid rgba(0, 0, 0, 0.12)'
                                }}
                            >
                                <Box sx={{
                                    width: '100%',
                                    padding: 1 / 2,
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    textAlign: 'left',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    transition: 'background-color 0.3s ease-in-out',
                                }}>
                                    <Chip label={idx + 1} />
                                    <Box component={'span'} sx={{ flexGrow: '1' }} />
                                    <Button size="small" variant='outlined' sx={{ minWidth: 10, mr: 1 }}
                                        onClick={() => changePosition(conditions, idx, idx - 1)}
                                    >
                                        <North sx={{ fontWeight: '500', width: 20, color: 'green' }} />
                                    </Button>
                                    <Button size="small" variant='outlined' sx={{ minWidth: 10, mr: 1 }}
                                        onClick={() => changePosition(conditions, idx, idx + 1)}
                                    >
                                        <South sx={{ fontWeight: '500', width: 20, }} />
                                    </Button>
                                    <Button size="small" variant='outlined' sx={{ minWidth: 10, mr: 1 }}
                                        onClick={() => removeCondition(conditions, condition.id)}
                                    >
                                        <Close sx={{ fontWeight: '500', width: 20, color: 'red' }} />
                                    </Button>

                                </Box>
                                <FormControl fullWidth sx={{ padding: 1, mt: 1 / 2 }}>
                                    <InputLabel id={`condicaoSe-${condition.id}`}>Se</InputLabel>
                                    <Select
                                        id={`select_se-${condition.id}`}
                                        value={conditionState[condition.id]?.selectedOption || ""}
                                        onChange={(e) => handleSelectChange(condition.id, e)}
                                        input={<OutlinedInput label="se" />}
                                    >
                                        {optionsSe.map(opt => (
                                            <MenuItem
                                                key={opt.label}
                                                value={opt.value} >
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {conditionState[condition.id]?.selectedOption === "R" &&
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', }}>
                                            {conditionState[condition.id].chips?.map((chip, index) => (
                                                <Chip
                                                    key={index}
                                                    label={chip}
                                                    onDelete={() => handleDelete(condition.id, chip)}
                                                    sx={{ margin: '4px' }}
                                                />
                                            ))}
                                            <TextField
                                                variant="outlined"
                                                value={conditionState[condition.id]?.inputValue || ''}
                                                onChange={(e) =>
                                                    setConditionState(prevState => ({
                                                        ...prevState,
                                                        [condition.id]: {
                                                            ...prevState[condition.id] || { chips: [], inputValue: '' }, // Garante que tenha uma estrutura inicial
                                                            inputValue: e.target.value,
                                                        },
                                                    }))
                                                }
                                                onKeyDown={(e) => handleKeyDown(condition.id, e)}
                                                placeholder="Digite e pressione Enter"
                                                sx={{ width: '100%', margin: '4px' }}
                                            />
                                        </Box>}
                                </FormControl>
                                <Divider />
                                <Box sx={{ padding: 1 }}>
                                    <Typography variant="subtitle1" sx={{ px: 1 }}>Rotear para:</Typography>
                                    <RadioGroup
                                        row
                                        onChange={handleRadioChange}
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}
                                    >
                                        <FormControlLabel value="fila" control={<Radio size="small" />} label="Fila" />
                                        <FormControlLabel value="usuario" control={<Radio size="small" />} label="Usúario" />
                                        <FormControlLabel value="encerar" control={<Radio size="small" />} label="Encerar" />
                                    </RadioGroup>
                                </Box>
                            </Box>

                        ))}

                    </Box>
                </Box>
            </TabPanel >
        </>
    )

}