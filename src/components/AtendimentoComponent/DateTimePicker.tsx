import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import type { Dayjs } from 'dayjs'

interface BasicDateTimePickerProps {
  label: string
  value: Dayjs | null
  setValue: (dt: Dayjs | null) => void
}

export default function BasicDateTimePicker({
  label,
  value,
  setValue,
}: BasicDateTimePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker
          label={label}
          value={value}
          onChange={newValue => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  )
}
