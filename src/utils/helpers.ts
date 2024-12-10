import { format, parseISO, parseJSON } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UpdateConfiguracoesUsuarios } from "../services/user.js";

export function formatDate(date, dateMask = "dd/MM/yyyy") {
  return format(parseISO(date), dateMask);
}

export const formatarData = (
  data: string | Date,
  formato: string = "dd/MM/yyyy"
): string => {
  // Verifica se a entrada é uma string e tenta converter para um objeto Date
  const dataDate = typeof data === "string" ? parseISO(data) : data;

  // Formata a data usando o formato e locale especificados
  return format(dataDate, formato, { locale: ptBR });
};
export const dataInWords = (date) => {
  return format(parseJSON(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
};
export const formatarMensagemWhatsapp = (body) => {
  if (!body) return;
  let format = body;

  function is_aplhanumeric(c) {
    var x = c.charCodeAt();
    return !!(
      (x >= 65 && x <= 90) ||
      (x >= 97 && x <= 122) ||
      (x >= 48 && x <= 57)
    );
  }
  function hyperlinkify(text) {
    const urlRegex = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;
    return text.replace(urlRegex, (url) => {
      const href = url.startsWith("http") ? url : `http://${url}`;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  }
  function whatsappStyles(format, wildcard, opTag, clTag) {
    var indices = [];
    for (var i = 0; i < format.length; i++) {
      if (format[i] === wildcard) {
        // eslint-disable-next-line no-unused-expressions
        if (indices.length % 2) {
          format[i - 1] == " "
            ? null
            : typeof format[i + 1] == "undefined"
            ? indices.push(i)
            : is_aplhanumeric(format[i + 1])
            ? null
            : indices.push(i);
        } else {
          typeof format[i + 1] == "undefined"
            ? null
            : format[i + 1] == " "
            ? null
            : typeof format[i - 1] == "undefined"
            ? indices.push(i)
            : is_aplhanumeric(format[i - 1])
            ? null
            : indices.push(i);
        }
      } else {
        // eslint-disable-next-line no-unused-expressions
        format[i].charCodeAt() == 10 && indices.length % 2
          ? indices.pop()
          : null;
      }
    }
    // eslint-disable-next-line no-unused-expressions
    indices.length % 2 ? indices.pop() : null;
    var e = 0;
    indices.forEach(function (v, i) {
      var t = i % 2 ? clTag : opTag;
      v += e;
      format = format.substr(0, v) + t + format.substr(v + 1);
      e += t.length - 1;
    });
    return format;
  }
  format = whatsappStyles(format, "_", "<i>", "</i>");
  format = whatsappStyles(format, "*", "<b>", "</b>");
  format = whatsappStyles(format, "~", "<s>", "</s>");
  format = format.replace(/\n/gi, "<br>");
  format = hyperlinkify(format);
  return format;
};
export const formatarValorMoeda = (num, black = false, intl = {}) => {
  const config = {
    language: "pt-br",
    options: {
      // style: 'currency',
      // currency: 'BRL',
      // currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    },
  };
  const intlConfig = {
    ...config,
    ...intl,
  };
  const valor = Intl.NumberFormat(
    intlConfig.language,
    intlConfig.options
  ).format(num);
  if (black && num <= 0.0) {
    return "";
  }
  return valor;
};

const roundTo = (num: number, places: number): number => {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
};

export const arredondar = (num: number, places: number): number => {
  // Verifica se o número é em notação científica
  if (!Number.isFinite(num)) {
    throw new Error("Input is not a finite number");
  }

  // Usa a função de arredondamento para tratar números normais e em notação científica
  return roundTo(num, places);
};
export const iniciaisString = (nomecompleto) => {
  nomecompleto = nomecompleto.replace(/\s(de|da|dos|das)\s/g, " "); // Remove os de,da, dos,das.
  const iniciais = nomecompleto.match(/\b(\w)/gi); // Iniciais de cada parte do nome.
  // var nome = nomecompleto.split(' ')[0].toLowerCase() // Primeiro nome.
  const sobrenomes = iniciais
    .splice(1, iniciais.length - 1)
    .join("")
    .toLowerCase(); // Iniciais
  const iniciaisNome = iniciais + sobrenomes;
  return iniciaisNome.toUpperCase();
};

export const setConfigsUsuario = () => {
  const filtroPadrao = {
    searchParam: "",
    pageNumber: 1,
    status: ["open", "pending"],
    showAll: false,
    count: null,
    queuesIds: [],
    withUnreadMessages: false,
    isNotAssignedUser: false,
    includeNotQueueDefined: true,
    // date: new Date(),
  };
  // this.isDark = !this.isDark
  // Dark.set(isDark)
  // const usuario = JSON.parse(localStorage.getItem('usuario'))
  const usuario = null;
  const filtrosAtendimento =
    JSON.parse(localStorage.getItem("filtrosAtendimento")) || filtroPadrao;
  const data = {
    filtrosAtendimento,
    // isDark: Dark.isActive
  };
  UpdateConfiguracoesUsuarios(usuario.userId, data)
    .then(() => console.log("Configurações do usuário atualizadas"))
    .catch(() => console.error);

  localStorage.setItem(
    "usuario",
    JSON.stringify({ ...usuario, configs: data })
  );
};
