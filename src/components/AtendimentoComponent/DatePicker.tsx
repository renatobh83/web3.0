import type { Dayjs } from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

interface BasicDateTimePickerProps {
  value: Dayjs | null
  setValue: (newValue: Dayjs | null) => void
}

export default function DatePickerValue({
  value,
  setValue,
}: BasicDateTimePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <DemoContainer components={['DatePicker']}>
        <DatePicker value={value} onChange={newValue => setValue(newValue)} />
      </DemoContainer>
    </LocalizationProvider>
  )
}
