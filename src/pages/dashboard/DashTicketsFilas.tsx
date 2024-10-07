import {
  Avatar,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Switch,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import DatePickerValue from '../../components/AtendimentoComponent/DatePicker'

import dayjs, { type Dayjs } from 'dayjs'
import { ConsultarTicketsQueuesService } from '../../services/estatistica'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import { CheckBox } from '@mui/icons-material'
import { ItemTicket } from '../Atendimento/ItemTicket'
import { ItemTicketPainel } from '../Atendimento/ItemTicketPainel'
import { groupBy } from 'lodash'
import { format, sub } from 'date-fns'
import { red } from '@mui/material/colors'
dayjs.extend(isSameOrAfter)

const optionsVisao = [
  { label: 'Por Usuário', value: 'U' },
  { label: 'Por Usuário (Sintético)', value: 'US' },
  { label: 'Por Filas', value: 'F' },
  { label: 'Por Filas (Sintético)', value: 'FS' },
]
export const DashTicketsFilas = () => {
  const { decryptData } = useAuth()
  const [tickets, setTickets] = useState([])
  // const [sets, setSets] = useState([])
  const [selectedOption, setSelectedOption] = useState<string>(
    optionsVisao[0].value
  )
  const [visao, setVisao] = useState('U')
  const [drawerFiltro, setDrawerFiltro] = useState(false)
  const profile = decryptData('profile')
  const [pesquisaTickets, setPesquisaTickets] = useState<{
    showAll: boolean | null
    dateStart: string | null
    dateEnd: string | null
    queuesIds: []
  }>({
    showAll: false,
    dateStart: format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd'),
    dateEnd: dayjs(new Date()).format('YYYY-MM-DD'),
    queuesIds: [],
  })
  const handleChangeChebox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value) // Atualiza o state com a opção selecionada
  }
  // Funções para atualizar dateStart e dateEnd
  const handleDateStartChange = (newDate: Dayjs | null) => {
    setPesquisaTickets(prevState => ({
      ...prevState,
      dateStart: newDate ? newDate.format('YYYY-MM-DD') : null,
    }))
  }

  const handleDateEndChange = (newDate: Dayjs | null) => {
    setPesquisaTickets(prevState => ({
      ...prevState,
      dateEnd: newDate ? newDate.format('YYYY-MM-DD') : null,
    }))
  }
  const [switchStates, setSwitchStates] = useState(() => {
    const savedStates = JSON.parse(localStorage.getItem('filtrosAtendimento'))
    return {
      showAll: savedStates.showAll,
      isNotAssignedUser: savedStates.isNotAssignedUser,
      withUnreadMessages: savedStates.withUnreadMessages,
    }
  })

  const handleCloseDrawer = () => {
    setDrawerFiltro(false)
    // setPesquisaTickets({
    //   showAll: false,
    //   dateStart: null,
    //   dateEnd: null,
    //   queuesIds: [],
    // })
    // toast.info('Filtros restados', {
    //   position: 'top-center',
    //   duration: 2000,
    // })
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    consultarTickets()
  }, [])
  const isDateRangeValid = () => {
    const { dateStart, dateEnd } = pesquisaTickets

    if (dateStart && dateEnd) {
      // Converte as strings para objetos dayjs para comparar as datas
      const start = dayjs(dateStart)
      const end = dayjs(dateEnd)

      // Verifica se dateEnd é maior ou igual a dateStart
      return end.isSameOrAfter(start)
    }
    return true // Se uma das datas for nula, não faz sentido validar, então retorna true
  }
  const consultarTickets = () => {
    if (
      pesquisaTickets.dateEnd &&
      pesquisaTickets.dateEnd &&
      isDateRangeValid()
    ) {
      setIsloading(true)
      ConsultarTicketsQueuesService(pesquisaTickets)
        .then(res => {
          setTickets(res.data)
        })
        .catch(error => { })
        .finally(() => {
          setIsloading(false)
          setDrawerFiltro(false)
        })
    } else {
      toast.info('Verifique os parametros da pesquisa', {
        position: 'top-center',
      })
    }
  }
  // const tickets = [
  //   { id: 1, userId: 1 },
  //   { id: 2, userId: 1 },
  //   { id: 3, userId: 4 },
  //   { id: 3, userId: 2 },
  //   { id: 3, userId: 3 },
  //   { id: 3, userId: 3 },
  // ];
  const cTicketsUser = () => {
    const field = visao === 'U' || visao === 'US' ? 'userId' : 'queueId'
    return [groupBy(tickets, field)]
  }
  const handleChange = event => {
    const { name, checked } = event.target
    // Atualizar o estado específico do switch
    setSwitchStates(prevStates => ({
      ...prevStates,
      [name]: checked, // Atualiza apenas o switch correspondente
    }))
    setPesquisaTickets({
      ...pesquisaTickets,
      [name]: checked,
    })
  }
  // const sizes = {
  //   xl: 4,
  //   lg: 3,
  //   md: 2,
  //   sm: 1,
  //   xs: 1,
  // }
  // const itemsPerSet = (sizes: { [key: string]: number }) => {
  //   const theme = useTheme()
  //   // Verifica os diferentes tamanhos de tela usando useMediaQuery
  //   const isXl = useMediaQuery(theme.breakpoints.up('xl'))
  //   const isLg = useMediaQuery(theme.breakpoints.up('lg'))
  //   const isMd = useMediaQuery(theme.breakpoints.up('md'))
  //   const isSm = useMediaQuery(theme.breakpoints.up('sm'))
  //   const isXs = useMediaQuery(theme.breakpoints.up('xs'))

  //   // Array para verificar os tamanhos de tela
  //   const screenSizes = [
  //     { size: 'xl', matches: isXl },
  //     { size: 'lg', matches: isLg },
  //     { size: 'md', matches: isMd },
  //     { size: 'sm', matches: isSm },
  //     { size: 'xs', matches: isXs },
  //   ]

  //   // Itera sobre os tamanhos de tela e retorna o valor correspondente
  //   for (const { size, matches } of screenSizes) {
  //     if (matches && sizes[size]) {
  //       return sizes[size]
  //     }
  //   }
  //   // Retorno padrão se nenhuma condição for atendida
  //   return 1
  // }

  // const sets = () => {
  //   const items = itemsPerSet(sizes) // Obtém o número de itens por set com base no tamanho da tela
  //   const limit = Math.ceil(cTicketsUser().length / items) // Define o limite de sets

  //   const setsArray = []

  //   for (let index = 0; index < limit; index++) {
  //     const start = index * items
  //     const end = start + items
  //     setsArray.push(cTicketsUser().slice(start, end)) // Divide `cTicketsUser` em subconjuntos
  //   }
  //   return setsArray[0] // Retorna o primeiro conjunto (como no exemplo Vue.js)
  // }

  const definirNomeUsuario = item => {
    // this.verifyIsActionSocket(item)
    return item?.user?.name || 'Pendente'
  }

  const [isLoading, setIsloading] = useState(false)

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
      <Box
        sx={{
          display: 'flex',

          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          px: 3,
        }}
      >
        <Typography variant='h6'>Painel Atendimentos</Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setDrawerFiltro(true)}
          startIcon={<FilterAltOutlinedIcon />}
        >
          Filtros
        </Button>
        <Box >
          <Button
            variant="outlined"
            size="small"

          >
            Action
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          height: '85vh',
          overflow: 'auto',
          willChange: 'scroll-position',
          mt: 2
        }}
      >
        {Object.entries(cTicketsUser()).map(([key, tickets]) => (
          <Grid key={key} container
            spacing={2}
            columns={12}
            sx={{ mb: theme => theme.spacing(2) }}
          >
            {Object.entries(tickets).map(([k, t]) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }}
                sx={{ maxWidth: '100%', minWidth: 0, lineHeight: '1.5', }}
                key={k}>
                <Card sx={{ borderRadius: '0 !important', p: '0 !important', }} >
                  <Stack direction={'row'} alignItems={'center'} gap={2} sx={{ px: 2, py: 1, }}>
                    <Avatar />
                    <Box sx={{ flexDirection: 'column', display: 'flex', }}>
                      <Typography variant='overline' >{definirNomeUsuario(t[0])}</Typography>
                      <Typography variant='caption'> Atendimentos: {t.length}</Typography>
                    </Box>
                  </Stack>
                  <Divider />
                  <Box sx={{ height: 320, overflow: 'auto', backgroundColor: 'background.paper' }}>
                    {t.map(ticket => (
                      <Box key={ticket.protocol} sx={{ px: 2, py: 1 }} >
                        <ItemTicketPainel ticket={ticket} />
                      </Box>
                    ))}
                  </Box>
                </Card>


              </Grid>
            ))}
          </Grid>
        ))}
      </Box>
      <Drawer
        anchor="right"
        open={drawerFiltro}
        sx={{ minWidth: 380 }}
        onClose={() => handleCloseDrawer()}
      >
        <Toolbar />
        <Box
          sx={{
            py: 3,
            gap: 2,
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h6">Filtros</Typography>

            <DatePickerValue
              value={
                pesquisaTickets.dateStart
                  ? dayjs(pesquisaTickets.dateStart)
                  : null
              }
              setValue={handleDateStartChange}
            />
            <DatePickerValue
              value={
                pesquisaTickets.dateEnd ? dayjs(pesquisaTickets.dateEnd) : null
              }
              setValue={handleDateEndChange}
            />
          </Box>
          <Divider sx={{ bgcolor: 'background.paper', width: '100%' }} />
          {profile === 'admin' && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: 2,
                  mb: 2,
                }}
              // className={`flex items-center ml-4 ${switchStates.showAll ? 'mb-4' : ''}`}
              >
                <Switch
                  name="showAll"
                  checked={switchStates.showAll}
                  onChange={handleChange}
                  color="primary"
                />
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="ml-2 text-sm text-gray-700">
                  Visualizar Todos
                </label>
              </Box>
              {/* {pesquisaTickets.showAll && <Divider />} */}
              <Divider sx={{ bgcolor: 'background.paper', width: '100%' }} />
            </>
          )}
          <Typography variant="h5">Tipo de visualização</Typography>
          <List sx={{ fontSize: 18 }}>
            <RadioGroup
              name="visao"
              value={selectedOption} // O valor do grupo de rádios é controlado pelo state
              onChange={handleChangeChebox} // Atualiza o state ao selecionar uma opção
            >
              {optionsVisao.map(option => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />} // Componente Radio
                  label={option.label} // Label da opção
                />
              ))}
            </RadioGroup>
          </List>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              color="info"
              size="medium"
              onClick={() => consultarTickets()}
            >
              Atualizar
            </Button>
          )}
        </Box>
      </Drawer>
    </Box >
  )
}
