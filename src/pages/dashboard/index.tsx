import { Box, Button, Stack, Toolbar, Typography } from '@mui/material'
import BasicDateTimePicker from '../../components/AtendimentoComponent/DateTimePicker'
import { useState } from 'react'
import { Dayjs } from 'dayjs'

export const Dashboard: React.FC = () => {
  const [dateTimeStart, setDateTimeStart] = useState<Dayjs | null>(null)
  const [dateTimeEnd, setDateTimeEnd] = useState<Dayjs | null>(null)
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
            >
              Gerar
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}
