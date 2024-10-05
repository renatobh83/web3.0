import {
  Button,
  CircularProgress,
  Divider,
  Drawer,
  Skeleton,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import Box from '@mui/material/Box'
import { useState } from 'react'
import DatePickerValue from '../../components/AtendimentoComponent/DatePicker'

import dayjs, { type Dayjs } from 'dayjs'
import { ConsultarTicketsQueuesService } from '../../services/estatistica'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
dayjs.extend(isSameOrAfter)

export const DashTicketsFilas = () => {
  const { decryptData } = useAuth()
  const [drawerFiltro, setDrawerFiltro] = useState(false)
  const profile = decryptData('profile')
  const [pesquisaTickets, setPesquisaTickets] = useState<{
    showAll: boolean | null
    dateStart: string | null
    dateEnd: string | null
    queuesIds: []
  }>({
    showAll: false,
    dateStart: dayjs(new Date()).toString(),
    dateEnd: dayjs(new Date()).toString(),
    queuesIds: [],
  })
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
    setPesquisaTickets({
      showAll: false,
      dateStart: dayjs(new Date()).toString(),
      dateEnd: dayjs(new Date()).toString(),
      queuesIds: [],
    })
    toast.info('Filtros restados', {
      position: 'top-center',
    })
  }
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
          console.log(res.data)
        })
        .catch(error => {})
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
  const [isLoading, setIsloading] = useState(false)
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
        }}
      >
        <Typography variant="h3">Painel Atendimentos</Typography>
        <Box>
          <Button onClick={() => setDrawerFiltro(true)}>Filtros</Button>
        </Box>
        <Box>action</Box>
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
            <Typography variant="subtitle1">Filtros</Typography>

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
          <Divider />
          {profile === 'admin' && (
            <>
              <div
                className={`flex items-center ml-4 ${switchStates.showAll ? 'mb-4' : ''}`}
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
              </div>
              {pesquisaTickets.showAll && <Divider />}
            </>
          )}
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
    </Box>
  )
}
