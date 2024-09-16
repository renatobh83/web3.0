import React, { useState, useCallback } from 'react';
import { Select, MenuItem, Chip, InputLabel, FormControl } from '@mui/material';
import { debounce } from 'lodash';

export const SelectComponent = ({ cUserQueues, pesquisaTickets }) => {
    // Define o debounce para a função de filtro


    const debouncedBuscarTicketFiltro = useCallback(
        debounce(() => {
            // Função a ser chamada quando o valor do select muda
            // Adapte conforme a necessidade
            console.log('BuscarTicketFiltro chamado');
        }, 700),
        []
    );

    const handleChange = (event) => {
        const { value } = event.target;
        // Atualiza o estado com as opções selecionadas
        const newQueues = { ...pesquisaTickets, queuesIds: value }
        localStorage.setItem('filtrosAtendimento', JSON.stringify(newQueues));
        debouncedBuscarTicketFiltro();
    };

    return (
        <FormControl fullWidth variant="outlined" disabled={pesquisaTickets.showAll}>
            <InputLabel id="select-label">Filas</InputLabel>
            <Select
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
            </Select>
        </FormControl>
    );
};


