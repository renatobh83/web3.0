import { format, parseISO, parseJSON } from "date-fns";
import { ptBR } from "date-fns/locale";

export const scrollToBottom = () => {
  setTimeout(() => {
    const chat = document.getElementById("chat");
    if (chat) chat.scrollTo(0, chat.scrollHeight);
  }, 200);
};

export const dataInWords = (date: string): string => {
  return format(parseJSON(date), "HH:mm", { locale: ptBR });
};

export const formatarMensagemWhatsapp = (body: string): string | undefined => {
  if (!body) return;

  let formattedMessage = body;

  const isAlphanumeric = (c: string) => {
    const x = c.charCodeAt(0);
    return (
      (x >= 65 && x <= 90) || (x >= 97 && x <= 122) || (x >= 48 && x <= 57)
    );
  };

  const whatsappStyles = (
    text: string,
    wildcard: string,
    opTag: string,
    clTag: string
  ) => {
    const indices: number[] = [];
    for (let i = 0; i < text.length; i++) {
      if (text[i] === wildcard) {
        if (indices.length % 2) {
          if (
            text[i - 1] !== " " &&
            (isAlphanumeric(text[i + 1]) || typeof text[i + 1] === "undefined")
          ) {
            // Fechando tag
          } else {
            indices.push(i);
          }
        } else {
          if (
            text[i + 1] !== " " &&
            (isAlphanumeric(text[i - 1]) || typeof text[i + 1] === "undefined")
          ) {
            indices.push(i);
          }
        }
      } else if (text[i].charCodeAt(0) === 10 && indices.length % 2) {
        indices.pop();
      }
    }
    if (indices.length % 2) indices.pop();

    let e = 0;
    indices.forEach((v, i) => {
      const t = i % 2 ? clTag : opTag;
      v += e;
      text = text.substr(0, v) + t + text.substr(v + 1);
      e += t.length - 1;
    });

    return text;
  };

  formattedMessage = whatsappStyles(formattedMessage, "_", "<i>", "</i>");
  formattedMessage = whatsappStyles(formattedMessage, "*", "<b>", "</b>");
  formattedMessage = whatsappStyles(formattedMessage, "~", "<s>", "</s>");
  formattedMessage = formattedMessage.replace(/\n/g, "<br>");

  return formattedMessage;
};

export const formatarMensagemRespostaBotaoWhatsapp = (body: string): string => {
  if (!body) return "";

  return `➡️ ${formatarMensagemWhatsapp(body)}`;
};

export const formatarNotas = (body: string): string => {
  if (!body) return "";

  return `<b>📝Nota: ${body}</b>`;
};

export const formatarTemplates = (body: string): string => {
  if (!body) return "";
  const components = JSON.parse(body);

  // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
  let headerText = "",
    bodyText = "",
    footerText = "";
  // biome-ignore lint/complexity/noForEach: <explanation>
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  components.forEach((component: any) => {
    if (component.type === "HEADER") {
      headerText = `<h2 style="font-weight: bold;">${component.text}</h2>`;
    } else if (component.type === "BODY") {
      bodyText = `<p>${component.text}</p>`;
    } else if (component.type === "FOOTER") {
      footerText = `<footer style="font-size: 0.75em; color: grey;">${component.text}</footer>`;
    }
  });

  return `${headerText}${bodyText}${footerText}`;
};

export const formatarBotaoWhatsapp = (body: string): string => {
  if (!body) return "";

  let [tituloDescricao, ...botoes] = body.split(", Btn");
  tituloDescricao = `${tituloDescricao
    .replace("Body: ", "")
    .replace(":", ":\n")}\n`;

  botoes = botoes.map((btn) => {
    const [, texto] = btn.split(":");
    return `<button title="Esse botão só é clicável no celular">➡️ ${texto.trim()}</button>`;
  });

  let formatado = [tituloDescricao, ...botoes].join("\n");
  formatado = formatarMensagemWhatsapp(formatado);

  return formatado;
};

export const formatarMensagemDeLista = (body: string): string => {
  if (!body) return "";
  const data = JSON.parse(body);

  const header = data.header
    ? `<h3 style="font-weight: bold;">${data.header}</h3>`
    : "";
  const bodyText = data.body
    ? `<p>${data.body.replace(/\n/g, "<br>")}</p>`
    : "";
  const footer = data.footer
    ? `<footer style="font-size: 0.75em; color: grey;">${data.footer}</footer>`
    : "";
  const buttonText = data.button_text
    ? `<button title="Esse botão só é clicável no celular">➡️ ${data.button_text}</button>`
    : "";

  let sectionsHtml = "";
  if (data.sections && data.sections.length > 0) {
    // biome-ignore lint/complexity/noForEach: <explanation>
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    data.sections.forEach((section: any) => {
      if (section.rows && section.rows.length > 0) {
        sectionsHtml += "<ul>";
        // biome-ignore lint/complexity/noForEach: <explanation>
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        section.rows.forEach((row: any) => {
          sectionsHtml += `<li><strong>${row.title}</strong>: ${row.description}</li>`;
        });
        sectionsHtml += "</ul>";
      }
    });
  }

  return `${header}${bodyText}${buttonText}${sectionsHtml}${footer}`;
};

export const formatarData = (data: string, formato = "dd/MM/yyyy"): string => {
  return format(parseISO(data), formato, { locale: ptBR });
};
