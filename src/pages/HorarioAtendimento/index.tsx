import {
  Help,
  HelpCenterOutlined,
  Inbox,
  QuestionMark,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  type TooltipProps,
  Typography,
  styled,
  tooltipClasses,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useCallback, useEffect, useState } from 'react'
import {
  AtualizarHorariosAtendiemento,
  AtualizarMensagemHorariosAtendiemento,
  MostrarHorariosAtendiemento,
} from '../../services/empresa'
import { toast } from 'sonner'

const optType = [
  { value: 'O', label: 'Aberto' },
  { value: 'C', label: 'Fechado' },
  { value: 'H', label: 'Horário' },
]
const title =
  ' Aberto: Estabelecimento aberto durante todo o dia. Não será feito envio de mensagem de ausência \
                Fechado: Estabelecimento fechado durante todo o dia. Será feito envio de mensagem de ausência, independente do horário; \
                Horário: Representa o horário de funcionamento do estabelecimento. O sistema enviará mensagem de ausênica quando mensagens forem recebidas \
                **Importante: A mensagem de ausência será enviada após o encerramento do atendimento automático.'
const initialBusinessHours = [
  {
    day: 0,
    label: 'Domingo',
    type: 'O',
    hr1: '08:00',
    hr2: '12:00',
    hr3: '14:00',
    hr4: '18:00',
  },
  {
    day: 1,
    label: 'Segunda-Feira',
    type: 'O',
    hr1: '08:00',
    hr2: '12:00',
    hr3: '14:00',
    hr4: '18:00',
  },
  {
    day: 2,
    label: 'Terça-Feira',
    type: 'O',
    hr1: '08:00',
    hr2: '12:00',
    hr3: '14:00',
    hr4: '18:00',
  },
  {
    day: 3,
    label: 'Quarta-Feira',
    type: 'O',
    hr1: '08:00',
    hr2: '12:00',
    hr3: '14:00',
    hr4: '18:00',
  },
  {
    day: 4,
    label: 'Quinta-Feira',
    type: 'O',
    hr1: '08:00',
    hr2: '12:00',
    hr3: '14:00',
    hr4: '18:00',
  },
  {
    day: 5,
    label: 'Sexta-Feira',
    type: 'O',
    hr1: '08:00',
    hr2: '12:00',
    hr3: '14:00',
    hr4: '18:00',
  },
  {
    day: 6,
    label: 'Sábado',
    type: 'O',
    hr1: '08:00',
    hr2: '12:00',
    hr3: '14:00',
    hr4: '18:00',
  },
]

export const HorarioAtendimento = () => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const [type, setType] = useState(optType)
  const [businessHours, setBusinessHours] = useState(initialBusinessHours)
  const [messageBusinessHours, setMessageBusinessHours] = useState('')

  const handleChangeMensage = value => {
    setMessageBusinessHours(value)
  }

  const mostrarHorarioAtendimento = useCallback(async () => {
    const { data } = await MostrarHorariosAtendiemento()
    setBusinessHours(data.businessHours)
    setMessageBusinessHours(data.messageBusinessHours)
  }, [])

  useEffect(() => {
    mostrarHorarioAtendimento()
  }, [mostrarHorarioAtendimento])

  const [typeSelected, setTypeSelected] = useState(
    businessHours.reduce(
      (acc, curr) => {
        acc[curr.day] = { type: curr.type }
        return acc
      },
      {} as { [key: number]: { type: string } }
    )
  )

  const handleChangeRadio = (day: number, newType: string) => {
    setTypeSelected(prevState => ({
      ...prevState,
      [day]: { type: newType },
    }))

    // Atualiza o type diretamente no businessHours
    setBusinessHours(prevBusinessHours =>
      prevBusinessHours.map(bh =>
        bh.day === day ? { ...bh, type: newType } : bh
      )
    )
  }

  // Função para formatar o tempo e inserir os dois pontos
  const formatTime = (value: string) => {
    // Remove tudo o que não for número
    const cleanValue = value.replace(/\D/g, '')

    if (cleanValue.length >= 3) {
      // Insere ":" depois de dois dígitos (para formatar como HH:MM)
      return `${cleanValue.slice(0, 2)}:${cleanValue.slice(2, 4)}`
    }
    return cleanValue
  }
  const handleTimeChange = (day: number, key: string, value: string) => {
    const formattedValue = formatTime(value)

    // Apenas atualiza o estado se o valor for menor ou igual a 5 caracteres (HH:MM)
    if (formattedValue.length <= 5) {
      setBusinessHours(prevBusinessHours =>
        prevBusinessHours.map(bh =>
          bh.day === day ? { ...bh, [key]: formattedValue } : bh
        )
      )
    }
  }
  async function salvarMensagemAusencia() {
    try {
      if (!messageBusinessHours.trim()) return
      await AtualizarMensagemHorariosAtendiemento({
        messageBusinessHours: messageBusinessHours,
      })

      toast.info('Mensagem de ausência atualizada.')
    } catch (e) {
      console.log(`Mensagem de ausência erro :${e}`)
    }
  }

  const handleBlur = (day: number, key: string, value: string) => {
    // Valida o valor no formato HH:MM
    const isValidTime = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number)
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
    }

    if (!isValidTime(value)) {
      setBusinessHours(prevBusinessHours =>
        prevBusinessHours.map(bh =>
          bh.day === day ? { ...bh, [key]: '' } : bh
        )
      )
    }
  }
  const salvarHorariosAtendimento = async () => {
    try {
      await AtualizarHorariosAtendiemento(businessHours)
      toast.info('Horário de funcionamento atualizado.')
    } catch (e) {
      console.log(`Mensagem de ausência erro :${e}`)
    }
  }
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',

        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 / 2 }}>
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            Horário de Atendimento
          </Typography>
          <CustomWidthTooltip title={title} arrow>
            <Help />
          </CustomWidthTooltip>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => salvarHorariosAtendimento()}
        >
          Salvar
        </Button>
      </Box>
      <Box
        sx={{
          padding: 2,
          position: 'relative',
          width: '100%',
        }}
      >
        <Card
          id="Cards"
          sx={{
            mt: '-8px',
            ml: '-8px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            backgroundColor: theme.palette.background.default,
            transition: 'background-color 0.3s ease-in-out',
            width: '100%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ width: '100%' }}
          >
            {businessHours.map((v, index) => (
              <Grid
                key={v.day}
                size={{ xs: 2, sm: 4, md: 4 }}
                sx={{ border: '1px solid #ccdd' }}
              >
                <CardHeader
                  sx={{
                    pl: 1,
                    py: 1 / 2,
                    backgroundColor: isDarkMode
                      ? theme.palette.grey[600]
                      : theme.palette.grey[200],
                    color: 'black !important',
                  }}
                  subheader={v.label}
                />
                <CardContent sx={{ px: 2, paddingBottom: '16px !important' }}>
                  <RadioGroup
                    value={typeSelected[v.day].type}
                    onChange={e => handleChangeRadio(v.day, e.target.value)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    {type.map(i => (
                      <FormControlLabel
                        key={i.value}
                        value={i.value}
                        control={<Radio size="small" />}
                        label={i.label}
                      />
                    ))}
                  </RadioGroup>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <TextField
                        id={v.hr1}
                        placeholder="HH:MM"
                        onBlur={e => handleBlur(v.day, 'hr1', e.target.value)}
                        inputProps={{ maxLength: 5 }}
                        onChange={e =>
                          handleTimeChange(v.day, 'hr1', e.target.value)
                        }
                        value={v.hr1}
                        disabled={typeSelected[v.day].type !== 'H'}
                      />
                      <span> às</span>
                      <TextField
                        id={v.hr2}
                        placeholder="HH:MM"
                        onBlur={e => handleBlur(v.day, 'hr2', e.target.value)}
                        inputProps={{ maxLength: 5 }}
                        onChange={e =>
                          handleTimeChange(v.day, 'hr2', e.target.value)
                        }
                        value={v.hr2}
                        disabled={typeSelected[v.day].type !== 'H'}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <TextField
                        id={v.hr3}
                        placeholder="HH:MM"
                        onBlur={e => handleBlur(v.day, 'hr3', e.target.value)}
                        inputProps={{ maxLength: 5 }}
                        onChange={e =>
                          handleTimeChange(v.day, 'hr3', e.target.value)
                        }
                        value={v.hr3}
                        disabled={typeSelected[v.day].type !== 'H'}
                      />
                      <span>às</span>
                      <TextField
                        id={v.hr4}
                        placeholder="HH:MM"
                        onBlur={e => handleBlur(v.day, 'hr4', e.target.value)}
                        inputProps={{ maxLength: 5 }}
                        onChange={e =>
                          handleTimeChange(v.day, 'hr4', e.target.value)
                        }
                        value={v.hr4}
                        disabled={typeSelected[v.day].type !== 'H'}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Grid>
            ))}
          </Grid>
        </Card>
        <Card
          id="Cards"
          sx={{
            mt: '8px',
            ml: '-8px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            backgroundColor: theme.palette.background.default,
            width: '100%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            height: 200,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1 / 2,
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Mensagem de Ausência
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => salvarMensagemAusencia()}
            >
              Salvar
            </Button>
          </Box>

          <TextField
            value={messageBusinessHours}
            onChange={e => handleChangeMensage(e.target.value)}
            multiline
            fullWidth
            margin="dense"
            variant="filled"
            rows={2}
          />
        </Card>
      </Box>
    </Box>
  )
}

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 700,
    fontSize: 18,
  },
})
