import { Autocomplete, TextField } from "@mui/material";
import type React from "react";
import { useState } from "react";
import { ListarContatos } from "../../services/contatos";
interface PesquisaContatoProps {
    getContatoSelecionado: (contato: string) => void
}
export const PesquisaContato: React.FC<PesquisaContatoProps> = ({ getContatoSelecionado }) => {
    const [loading, setLoading] = useState(false);
    const [filaSelecionada, setFilaSelecionada] = useState<number | null>(null);
    const [contatoSelecionado, setContatoSelecionado] = useState<string | null>(null);
    const [contatos, setContatos] = useState<Array<{ id: string, name: string, number: string }>>([]);


    const localizarContato = async (search: string) => {
        if (search.length < 2) {
            return;
        }
        setLoading(true);
        try {
            const { data } = await ListarContatos({ searchParam: search });
            if (data.contacts.length) {
                setContatos(data.contacts);
            } else {
                setContatos([]);
            }
        } catch (error) {
            console.error('Erro ao buscar contatos:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Autocomplete
            sx={{ px: 1, }}
            options={contatos}
            loading={loading}
            getOptionLabel={(option) => option.name}
            onInputChange={(_event, value) => {
                if (value.length >= 2) {
                    localizarContato(value);
                }
            }}
            renderOption={(props, option) => (
                <li {...props} key={option.id}>
                    <div style={{ display: 'flex', gap: 3 }}>
                        <span>{option.name}</span>
                        <span className="text-sm text-gray-500">{option.number}</span>
                    </div>
                </li>
            )}
            value={contatoSelecionado}
            onChange={(_event, newValue) => { setContatoSelecionado(newValue); getContatoSelecionado(newValue) }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    // label="Localize e selecione o contato"
                    variant="filled"
                    fullWidth
                    autoFocus
                    placeholder="Digite no mínimo duas letras para localizar contato"
                />
            )}
        />
    )
}