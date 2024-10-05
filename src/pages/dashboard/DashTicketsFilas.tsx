import { Button, Drawer, Toolbar, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useState } from 'react'
import DatePickerValue from '../../components/AtendimentoComponent/DatePicker'

import { format, sub } from 'date-fns'
import dayjs, { Dayjs } from 'dayjs'
import { ConsultarTicketsQueuesService } from '../../services/estatistica'

export const DashTicketsFilas = () => {
  const [drawerFiltro, setDrawerFiltro] = useState(false)

  const [pesquisaTickets, setPesquisaTickets] = useState<{
    showAll: boolean
    dateStart: string | null
    dateEnd: string | null
    queuesIds: []
  }>({
    showAll: true,
    dateStart: null,
    dateEnd: null,
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
  const handleCloseDrawer = () => {
    setDrawerFiltro(false)
    setPesquisaTickets({
      showAll: true,
      dateStart: null,
      dateEnd: null,
      queuesIds: [],
    })
  }
  const consultarTickets = () => {
    console.log(pesquisaTickets)
    ConsultarTicketsQueuesService(pesquisaTickets)
      .then(res => {
        console.log(res)
      })
      .catch(error => {})
  }
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
          <Button
            variant="contained"
            color="info"
            size="medium"
            onClick={() => consultarTickets()}
          >
            Atualizar
          </Button>
        </Box>
      </Drawer>
    </Box>
  )
}
