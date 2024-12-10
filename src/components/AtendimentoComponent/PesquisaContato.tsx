import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { ListarContatos } from "../../services/contatos";

interface PesquisaContatoProps {
    getContatoSelecionado: (x: any) => void;
}

interface Contato {
    id: string;
    name: string;
    number: string;
}

export const PesquisaContato: React.FC<PesquisaContatoProps> = ({ getContatoSelecionado }) => {


    const [loading, setLoading] = useState(false);
    const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(null);
    const [contatos, setContatos] = useState<Contato[]>([]);

    const localizarContato = async (search: string) => {
        if (search.length < 2) return;

        setLoading(true);
        try {
            const { data } = await ListarContatos({ searchParam: search });
            if (data.contacts.length >= 1) {
                setContatos(data.contacts);

            } else {
                setContatos([]);
                console.log("Nenhum contato encontrado");
            }
        } catch (error) {
            console.error("Erro ao buscar contatos:", error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <Autocomplete
            sx={{ px: 1 }}
            options={contatos}
            loading={loading}
            getOptionLabel={(option) => option.name || ""}
            isOptionEqualToValue={(option, value) => value === null || option.id === value.id}
            onInputChange={(_event, value) => {
                if (value.length >= 2) {
                    localizarContato(value);
                }
            }}
            renderOption={(props, option) => {

                return (
                    <li {...props} key={option.id}>
                        <div style={{ display: "flex", gap: 8 }}>
                            <span>{option.name}</span>
                            <span style={{ fontSize: "0.875rem", color: "gray" }}>{option.number}</span>
                        </div>
                    </li>
                );
            }}
            value={contatoSelecionado}
            onChange={(_event, newValue) => {
                setContatoSelecionado(newValue);

                getContatoSelecionado(newValue); // Callback para enviar o contato selecionado
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="filled"
                    fullWidth
                    autoFocus
                    placeholder="Digite no mínimo duas letras para localizar contato"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};
