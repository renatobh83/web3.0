import { toast } from 'sonner'
import backendErrors from '../services/erros'

interface ErrorResponse {
  data?: {
    error?: string
    message?: string
  }
  response?: {
    data?: {
      error?: string
    }
  }
}

export function Errors(err: ErrorResponse) {
  const errorMsg = err?.data?.error || err?.data?.message
  let error = 'Ocorreu um erro não identificado.'
  if (errorMsg) {
    if (backendErrors[errorMsg]) {
      error = backendErrors[errorMsg]
    } else if (err.response?.data?.error) {
      error = err.response.data.error
    }
  }

  toast.error(error, {
    position: 'top-center',
  })
}
