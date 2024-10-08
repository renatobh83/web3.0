import { useState } from 'react';
import { Select, MenuItem, InputLabel, FormControl, type SelectChangeEvent, OutlinedInput, Checkbox, ListItemText }
    from '@mui/material';

interface SelectComponentProps {
    filterFilas: (arg0: any) => void,
    pesquisaTickets: any,
    cUserQueues: any[]
}


export const SelectComponent = ({ cUserQueues, pesquisaTickets, filterFilas }: SelectComponentProps) => {
    const [filasSelecionada, setFilasSelecionada] = useState<string[]>([]);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };


    const handleChange = (event: SelectChangeEvent<typeof filasSelecionada>) => {
        const {
            target: { value },
        } = event;
        setFilasSelecionada(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        const newQueues = { ...pesquisaTickets, queuesIds: value }
        // localStorage.setItem(:'filtrosAtendimento', JSON.stringify(newQueues));
        filterFilas(newQueues)

    };
    return (
        <FormControl fullWidth variant="outlined" disabled={pesquisaTickets.showAll}>
            <InputLabel id="select-label">Filas</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={filasSelecionada}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) =>
                    selected
                        .map((id) => cUserQueues.find((fila) => fila.id === id)?.queue)
                        .join(', ')
                }
                MenuProps={MenuProps}
            >
                {cUserQueues.map((fila) => (
                    <MenuItem key={fila.id} value={fila.id}>
                        <Checkbox checked={filasSelecionada.includes(fila.id)} />
                        <ListItemText primary={fila.queue} />
                    </MenuItem>
                ))}
            </Select>
            {/* <Select
                labelId="select-label"
                multiple
                value={pesquisaTickets.queuesIds}
                onChange={handleChange}
                renderValue={(selected) => (
                    <div className="flex flex-wrap gap-1">
                        {selected.map((value) => (
                            <Chip key={value} label={cUserQueues.find((queue) => queue.id === value)?.queue} />
                        ))}
                    </div>
                )}
                // Customize styles using the sx prop
                sx={{
                    '& .MuiSelect-select': {
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px',
                        alignItems: 'center',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ddd',
                    },
                    '& .MuiInputLabel-outlined': {
                        transform: 'translate(14px, 12px) scale(1)',
                    },
                }}
            >
                {cUserQueues.map((queue) => (
                    <MenuItem key={queue.id} value={queue.id}>
                        {queue.queue}
                    </MenuItem>
                ))}
            </Select> */}
        </FormControl>
    );
};


