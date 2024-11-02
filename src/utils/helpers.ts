import { format, parseISO, parseJSON } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { UpdateConfiguracoesUsuarios } from '../services/user.js'

export function formatDate(date: string, dateMask = 'dd/MM/yyyy') {
  return format(parseISO(date), dateMask)
}

export const formatarData = (
  data: string | Date,
  formato = 'dd/MM/yyyy'
): string => {
  // Verifica se a entrada é uma string e tenta converter para um objeto Date
  const dataDate = typeof data === 'string' ? parseISO(data) : data

  // Formata a data usando o formato e locale especificados
  return format(dataDate, formato, { locale: ptBR })
}

export const dataInWords = (date: string) => {
  return format(parseJSON(date), 'dd/MM/yyyy HH:mm', { locale: ptBR })
}
export const formatarMensagemWhatsapp = (body: string): string | undefined => {
  if (!body) return
  let textoFormatado = body

  // Função para verificar se o caractere é alfanumérico
  function isAlphanumeric(c: string): boolean {
    const x = c.charCodeAt(0)
    return (x >= 65 && x <= 90) || (x >= 97 && x <= 122) || (x >= 48 && x <= 57)
  }

  // Função para aplicar estilos do WhatsApp com caracteres especiais
  function whatsappStyles(
    texto: string,
    wildcard: string,
    opTag: string,
    clTag: string
  ): string {
    const indices: number[] = []
    for (let i = 0; i < texto.length; i++) {
      if (texto[i] === wildcard) {
        if (indices.length % 2) {
          if (
            texto[i - 1] !== ' ' &&
            typeof texto[i + 1] !== 'undefined' &&
            !isAlphanumeric(texto[i + 1])
          ) {
            indices.push(i)
          }
        } else {
          if (
            typeof texto[i + 1] !== 'undefined' &&
            texto[i + 1] !== ' ' &&
            (typeof texto[i - 1] === 'undefined' ||
              !isAlphanumeric(texto[i - 1]))
          ) {
            indices.push(i)
          }
        }
      } else if (texto[i].charCodeAt(0) === 10 && indices.length % 2) {
        indices.pop()
      }
    }

    if (indices.length % 2) indices.pop()

    let e = 0
    indices.forEach((v, i) => {
      const tag = i % 2 ? clTag : opTag
      v += e
      texto = texto.substring(0, v) + tag + texto.substring(v + 1)
      e += tag.length - 1
    })

    return texto
  }

  textoFormatado = whatsappStyles(textoFormatado, '_', '<i>', '</i>')
  textoFormatado = whatsappStyles(textoFormatado, '*', '<b>', '</b>')
  textoFormatado = whatsappStyles(textoFormatado, '~', '<s>', '</s>')
  textoFormatado = textoFormatado.replace(/\n/g, '<br>')
  return textoFormatado
}

export const formatarValorMoeda = (
  num: number | bigint,
  black = false,
  intl = {}
) => {
  const config = {
    language: 'pt-br',
    options: {
      // style: 'currency',
      // currency: 'BRL',
      // currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    },
  }
  const intlConfig = {
    ...config,
    ...intl,
  }
  const valor = Intl.NumberFormat(
    intlConfig.language,
    intlConfig.options
  ).format(num)
  if (black && num <= 0.0) {
    return ''
  }
  return valor
}

const roundTo = (num: number, places: number): number => {
  const factor = 10 ** places
  return Math.round(num * factor) / factor
}

export const arredondar = (num: number, places: number): number => {
  // Verifica se o número é em notação científica
  if (!Number.isFinite(num)) {
    throw new Error('Input is not a finite number')
  }

  // Usa a função de arredondamento para tratar números normais e em notação científica
  return roundTo(num, places)
}
export const iniciaisString = (nomecompleto: string): string => {
  // Remove conectivos comuns
  const nome = nomecompleto.replace(/\s(de|da|dos|das)\s/gi, ' ').trim()

  // Pega as iniciais de cada palavra
  const iniciais = nome.match(/\b(\w)/gi)

  if (!iniciais) return '' // Retorna string vazia se não houver correspondência

  // Pega a inicial do primeiro nome e do último nome
  const primeiraInicial = iniciais[0]
  const ultimaInicial = iniciais[iniciais.length - 1]

  // Junta as iniciais e retorna em maiúsculo
  return (primeiraInicial + ultimaInicial).toUpperCase()
}

export const setConfigsUsuario = () => {
  const filtroPadrao = {
    searchParam: '',
    pageNumber: 1,
    status: ['open', 'pending'],
    showAll: false,
    count: null,
    queuesIds: [],
    withUnreadMessages: false,
    isNotAssignedUser: false,
    includeNotQueueDefined: true,
    // date: new Date(),
  }
  // this.isDark = !this.isDark
  // Dark.set(isDark)
  // const usuario = JSON.parse(localStorage.getItem('usuario'))
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let usuario: any
  const filtrosAtendimento =
    JSON.parse(localStorage.getItem('filtrosAtendimento') || '') || filtroPadrao
  const data = {
    filtrosAtendimento,
    // isDark: Dark.isActive
  }
  UpdateConfiguracoesUsuarios(usuario.userId, data)
    .then(() => console.log('Configurações do usuário atualizadas'))
    .catch(() => console.error)

  localStorage.setItem('usuario', JSON.stringify({ ...usuario, configs: data }))
}
