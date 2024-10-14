import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
} from '@mui/material'
import { useEffect, useState } from 'react'
import useChatFlowStore from '../../store/chatFlow'

interface RadioComponentCardProps {
  arg0?: any
}

export const RadioComponentCard = ({ arg0 }: RadioComponentCardProps) => {
  const { filas, usuarios } = useChatFlowStore()
  const [radioValue, setRadioValue] = useState<string>('')
  const [selectOption, setSelectOption] = useState<string>('')
  const [optionsFilas, setOptionsFilas] = useState<any[]>([])
  const [optionsUsuarios, setOptionsUsuarios] = useState<any[]>([])

  const handleRadioChange = (value: string) => {
    setSelectOption('') // Reseta a seleção do select ao mudar o rádio
    setRadioValue(value)

    if (value === '1') {
      setOptionsFilas(filas)
    } else if (value === '2') {
      setOptionsUsuarios(usuarios)
    } else if (value === '3') {
      arg0.type = 3 // Encerra a opção
    }
  }

  const handleChangeSelectOptions = (value: string) => {
    setSelectOption(value)

    if (radioValue === '1') {
      arg0.type = 1
      arg0.destiny = value
    } else if (radioValue === '2') {
      arg0.type = 2
      arg0.destiny = value
    }
  }

  useEffect(() => {
    // Inicializa os valores a partir de arg0
    setRadioValue(arg0.type?.toString() || '')
    setSelectOption(arg0.destiny || '')

    // Inicializa as opções de filas e usuários
    if (arg0.type === 1) {
      setOptionsFilas(filas)
    } else if (arg0.type === 2) {
      setOptionsUsuarios(usuarios)
    }
  }, [arg0, filas, usuarios])

  return (
    <FormControl>
      <RadioGroup
        row
        value={radioValue}
        onChange={e => handleRadioChange(e.target.value)}
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <FormControlLabel
          value="1"
          control={<Radio size="small" />}
          label="Fila"
        />
        <FormControlLabel
          value="2"
          control={<Radio size="small" />}
          label="Usuário"
        />
        <FormControlLabel
          value="3"
          control={<Radio size="small" />}
          label="Encerrar"
        />
      </RadioGroup>

      {radioValue !== '3' && (
        <Select
          value={selectOption}
          onChange={e => handleChangeSelectOptions(e.target.value)}
        >
          {radioValue === '1' &&
            optionsFilas.map(fila => (
              <MenuItem key={fila.id} value={fila.id}>
                {fila.queue}
              </MenuItem>
            ))}
          {radioValue === '2' &&
            optionsUsuarios.map(usuario => (
              <MenuItem key={usuario.id} value={usuario.id}>
                {usuario.name}
              </MenuItem>
            ))}
        </Select>
      )}
    </FormControl>
  )
}
