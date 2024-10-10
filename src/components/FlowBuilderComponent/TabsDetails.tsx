import { Box, Button, ButtonGroup, Chip, Divider, Tab, Tabs } from "@mui/material";
import { useReactFlow, type Node } from "@xyflow/react";
import { a11yProps, TabPanel } from "../MaterialUi/TablePanel";
import { useEffect, useState } from "react";
import { ArrowDropDown, Close, North, PreviewRounded, South } from "@mui/icons-material";



export const TabsDetails = ({ node, atualizarNode }: { node: Node | undefined, atualizarNode: (arg0: Node[]) => void }) => {
    const nodeType = node?.type
    const [tabSelected, setTabSelected] = useState(0)
    const [, setConditionsNode] = useState(0)
    const [conditions, setConditions] = useState([]);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleChangeTabs = (newValue: any) => {
        setTabSelected(newValue)

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
        let newArr = [...arr];
        newArr = newArr.filter(condition => condition.id !== id)

        if (node) {
            // atualizarNode((nodes) => {
            //     nodes.map((n) => {
            //         if (n.id === node.id) {
            //             const updatedConditions = n.data.conditions.filter(
            //                 (condition) => condition.id !== id
            //             );
            //             return {
            //                 ...node,
            //                 data: {
            //                     ...node.data,
            //                     conditions: updatedConditions,
            //                 },
            //             };
            //         }
            //         return node;
            //     })
            // })
            // node.data = {
            //     ...node.data,
            //     conditions: newArr
            // }
            // console.log(node.data)

        }
        console.log(node)
        setConditions(newArr)
        setConditionsNode(newArr.length)
    }
    useEffect(() => {
        setConditionsNode(node?.data?.conditions.length || 0)
    }, [])

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (node)
            setConditions(node.data.conditions)
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
                                        onClick={() => changePosition(node?.data.conditions, idx, idx - 1)}
                                    >
                                        <North sx={{ fontWeight: '500', width: 20, color: 'green' }} />
                                    </Button>
                                    <Button size="small" variant='outlined' sx={{ minWidth: 10, mr: 1 }}
                                        onClick={() => changePosition(node?.data.conditions, idx, idx + 1)}
                                    >
                                        <South sx={{ fontWeight: '500', width: 20, }} />
                                    </Button>
                                    <Button size="small" variant='outlined' sx={{ minWidth: 10, mr: 1 }}
                                        onClick={() => removeCondition(node?.data.conditions, condition.id)}
                                    >
                                        <Close sx={{ fontWeight: '500', width: 20, color: 'red' }} />
                                    </Button>

                                </Box>
                                <Box>{condition.id}</Box>
                                <Box>3</Box>
                            </Box>
                        ))}

                    </Box>
                </Box>
            </TabPanel >
        </>
    )

}