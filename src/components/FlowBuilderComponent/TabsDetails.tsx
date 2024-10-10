import { Box, Button, ButtonGroup, Chip, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, SelectChangeEvent, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useReactFlow, type Node } from "@xyflow/react";
import { a11yProps, TabPanel } from "../MaterialUi/TablePanel";
import { useEffect, useState } from "react";
import { ArrowDropDown, Close, North, PreviewRounded, South } from "@mui/icons-material";

const optionsSe = [
    { label: 'Qualquer resposta', value: 'US' },
    { label: 'Respostas', value: 'R' }
]

export const TabsDetails = ({ node, atualizarNode }: { node: Node | undefined, atualizarNode: (arg0: Node) => void }) => {
    const nodeType = node?.type
    const [tabSelected, setTabSelected] = useState(0)
    const [, setConditionsNode] = useState(0)
    const [conditions, setConditions] = useState([]);

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
        node?.data.conditions.push({
            type: '',
            condition: [],
            id: crypto.randomUUID()
        })
        setConditionsNode(node => node + 1)
    }
    function removeCondition(arr, id) {
        const newConditions = arr.filter(condition => condition.id !== id)
        handleNodeAtualizacaoCondicao(newConditions)
        setConditions(newConditions)
        setConditionsNode(newConditions.length)
    }

    const [optionSelect, setOptionSelect] = useState<string>('')
    const handleSelectChange = (event: SelectChangeEvent<typeof optionSelect>) => {
        const {
            target: { value },
        } = event;
        setOptionSelect(value);
    }
    const [inputValue, setInputValue] = useState('');
    const [chips, setChips] = useState<string[]>([]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            event.preventDefault();
            setChips([...chips, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleDelete = (chipToDelete: string) => {
        setChips(chips.filter((chip) => chip !== chipToDelete));
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (node) {
            if (node.data.conditions) {
                setConditions(node.data.conditions)
                setConditionsNode(node.data.conditions.length)
            } else {
                setConditions([])
            }
        }
    }, [node?.id])
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
                                    <InputLabel id="condicaoSe">Se</InputLabel>
                                    <Select
                                        id="select_se"
                                        onChange={handleSelectChange}
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
                                    {optionSelect === "R" &&
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', }}>
                                            {chips.map((chip, index) => (
                                                <Chip
                                                    key={index}
                                                    label={chip}
                                                    onDelete={() => handleDelete(chip)}
                                                    sx={{ margin: '4px' }}
                                                />
                                            ))}
                                            <TextField
                                                variant="outlined"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyDown={handleKeyDown}
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
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                    >
                                        <FormControlLabel value="etapa" control={<Radio size="small" />} label="Etapa" />
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