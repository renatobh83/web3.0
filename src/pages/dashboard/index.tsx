import { Box, Button, Stack, Typography } from '@mui/material'
import BasicDateTimePicker from '../../components/AtendimentoComponent/DateTimePicker'
import { useState } from 'react'
import type { Dayjs } from 'dayjs'
// import { differenceInDays } from 'date-fns'

export const Dashboard: React.FC = () => {
  const [dateTimeStart, setDateTimeStart] = useState<Dayjs | null>(null)
  const [dateTimeEnd, setDateTimeEnd] = useState<Dayjs | null>(null)

  const setConfigWidth = () => {
    // const diffDays = differenceInDays(
    //   new Date(dateTimeEnd),
    //   new Date(dateTimeStart)
    // )
    // if (diffDays > 30) {
    //   configWidth = { horizontal: true, width: 2200 }
    // } else {
    //   const actualWidth = this.$q.screen.width
    //   configWidth = {
    //     horizontal: true,
    //     width: actualWidth - (actualWidth < 768 ? 40 : 100),
    //   }
    // }
  }
  const getDashData = () => {
    setConfigWidth()
  }
  return (
    <>
      <Box
        sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}
      >
        <Stack
          direction={{ md: 'row' }}
          sx={{
            gap: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1,
            // maxHeight: 100,
            flexWrap: 'wrap',
            backgroundColor: 'background.paper',
            borderRadius: 0.73,
          }}
        >
          <Typography variant="h4" sx={{ mx: 3 }}>
            Painel de controle
          </Typography>
          <Stack
            gap={1}
            sx={{
              alignItems: 'center',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <BasicDateTimePicker
              label="Inicio"
              value={dateTimeStart}
              setValue={setDateTimeStart}
            />
            <BasicDateTimePicker
              label="Fim"
              value={dateTimeEnd}
              setValue={setDateTimeEnd}
            />
            <Button
              variant="contained"
              color="info"
              sx={{ cursor: 'pointer', opacity: 1 }}
              onClick={() => getDashData()}
            >
              Gerar
            </Button>
          </Stack>
        </Stack>

      </Box>
    </>
  )
}
