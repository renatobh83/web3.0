import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CriarContato, EditarContato } from '../../services/contatos'
import { toast } from 'sonner'
import { Errors } from '../../utils/error'
interface Contato {
  name: string
  number: string
  email: string
  cpf: string
  birthdayDate: string
  firstName: string
  lastName: string
  businessName: string
}
export const ContatoModal: React.FC<{
  open: boolean
  close: () => void
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  contact?: any
}> = ({ open, close, contact }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Contato>()
  const [isLoading, setLoading] = useState(false)

  const onSubimit = contato => {
    setLoading(true)
    if (contact) {
      EditarContato(contact.id, contato)
        .then(() => {
          toast.success('Contato editado', {
            position: 'top-center',
          })
          close()
        })
        .catch(err => {
          Errors(err)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      CriarContato(contato)
        .then(() => {
          toast.success('Contato criado', {
            position: 'top-center',
          })
          close()
        })
        .catch(err => {
          Errors(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  // const formatPhoneNumber = (value: string) => {
  //   // Remove tudo que não for número
  //   const onlyNumbers = value.replace(/\D/g, '')

  //   // Formata no padrão +DDI (DDD) 99999-9999
  //   const formatted = onlyNumbers.replace(
  //     /^(\d{2})(\d{2})(\d{4,5})(\d{4}).*/,
  //     '+$1 ($2) $3-$4'
  //   )
  //   return formatted
  // }
  const formatCPFNumber = (value: string) => {
    // Remove tudo que não for número
    const onlyNumbers = value.replace(/\D/g, '')

    if (onlyNumbers.length <= 11) {
      return onlyNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }

    // Se for CNPJ (14 dígitos)
    if (onlyNumbers.length === 14) {
      return onlyNumbers.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      )
    }

    // Caso ainda esteja incompleto, retornar o que foi digitado sem formatação completa
    return onlyNumbers
  }
  const formatDN = (value: string) => {
    // Remove tudo que não for número
    const onlyNumbers = value.replace(/\D/g, '')

    // Formata no padrão +DDI (DDD) 99999-9999
    const formatted = onlyNumbers.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3')

    return formatted
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (contact) {
      setValue('name', contact.name || '')
      setValue('email', contact.email || '')
      setValue('number', contact.number || '')
      setValue('cpf', contact.cpf || '')
      setValue('birthdayDate', contact.birthdayDate || '')
      setValue('firstName', contact.name || '')
    }
  }, [contact])

  return (
    <Dialog open={open}>
      <DialogTitle>
        {contact ? 'Editar Contato' : 'Adicionar Contato'}
      </DialogTitle>
      <DialogContent>
        <div className="font-bold p-2">
          <span>Dados Contato</span>
        </div>
        <form onSubmit={handleSubmit(onSubimit)}>
          <Grid container spacing={2} className="row q-col-gutter-md">
            {/* Nome */}
            <Grid sx={{ flexGrow: 1, width: { xs: '100%', md: '50%' } }}>
              <TextField
                fullWidth
                label="Nome"
                variant="outlined"
                {...register('name', { required: 'Nome é obrigatório' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            {/* Número */}
            <Grid sx={{ flexGrow: 1, width: { xs: '100%', md: '50%' } }}>
              <TextField
                fullWidth
                label="Número"
                variant="outlined"
                // value={watch('number')}
                // placeholder="+DDI (DDD) 9999 9999"
                {...register('number', {
                  required: 'Número é obrigatório',
                  // pattern: {
                  //   value: /^\+\d{2} \(\d{2}\) \d{4,5}-\d{4}$/,
                  //   message: 'Número inválido',
                  // },
                })}
                // onChange={e => {
                //   const formattedNumber = formatPhoneNumber(e.target.value)
                //   setValue('number', formattedNumber) // Atualiza o valor do formulário com o número formatado
                // }}
                error={!!errors.number}
                helperText="Número do celular deverá conter 9 dígitos e ser precedido do DDD."
              />
            </Grid>

            {/* Email */}
            <Grid sx={{ flexGrow: 1, width: '100%' }}>
              <TextField
                fullWidth
                label="E-mail"
                variant="outlined"
                {...register('email', {
                  // required: 'Email é obrigatório',
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    message: 'Email inválido',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            {/* CPF/CNPJ */}
            <Grid sx={{ flexGrow: 1, width: { xs: '100%', md: '50%' } }}>
              <TextField
                fullWidth
                label="CPF/CNPJ"
                variant="outlined"
                placeholder="CPF/CNPJ"
                value={watch('cpf')}
                {...register('cpf')}
                error={!!errors.cpf}
                onChange={e => {
                  const formattedCPF = formatCPFNumber(e.target.value)
                  setValue('cpf', formattedCPF) // Atualiza o valor do formulário com o número formatado
                }}
                helperText="Número do CPF/CNPJ apenas numeros."
              />
            </Grid>

            {/* Data de Aniversário */}
            <Grid sx={{ flexGrow: 1, width: { xs: '100%', md: '50%' } }}>
              <TextField
                fullWidth
                label="Data de Aniversário"
                variant="outlined"
                value={watch('birthdayDate')}
                placeholder="01/01/1990"
                {...register('birthdayDate', {
                  // required: 'Data de Aniversário é obrigatória',
                })}
                onChange={e => {
                  const formattedNumber = formatDN(e.target.value)
                  setValue('birthdayDate', formattedNumber) // Atualiza o valor do formulário com o número formatado
                }}
                error={!!errors.birthdayDate}
                // helperText="A data de aniversário deverá ser informada no formato 01/01/1990."
              />
            </Grid>

            {/* Primeiro Nome */}
            <Grid sx={{ flexGrow: 1, width: { xs: '100%', md: '33.33%' } }}>
              <TextField
                fullWidth
                label="Primeiro Nome"
                variant="outlined"
                placeholder="Primeiro Nome"
                {...register('firstName', {
                  // required: 'Primeiro Nome é obrigatório',
                })}
                error={!!errors.firstName}
                helperText="Primeiro nome"
              />
            </Grid>

            {/* Sobrenome */}
            <Grid sx={{ flexGrow: 1, width: { xs: '100%', md: '33.33%' } }}>
              <TextField
                fullWidth
                label="Sobrenome"
                variant="outlined"
                placeholder="Sobrenome"
                {...register('lastName', {
                  // required: 'Sobrenome é obrigatório',
                })}
                error={!!errors.lastName}
                helperText="Sobrenome"
              />
            </Grid>

            {/* Empresa */}
            <Grid sx={{ flexGrow: 1, width: { xs: '100%', md: '33.33%' } }}>
              <TextField
                fullWidth
                label="Empresa"
                variant="outlined"
                placeholder="Empresa"
                {...register('businessName', {
                  // required: 'Empresa é obrigatório',
                })}
                error={!!errors.businessName}
                helperText="Empresa"
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => close()}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={isLoading}
            >
              Confirmar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
