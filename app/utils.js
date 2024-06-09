import { EmbedBuilder } from "discord.js";
import { getCurrency } from "./fetch.js";

export function descFormat(blue) {
  const name = blue.titulo;
  const diff = (blue.cierre - blue.venta) * -1;
  const perc = (diff / blue.cierre) * 100;
  return `${emoji(perc,name)} ${blue.titulo}: **$${blue.venta},00** (${percFormat(perc)})${diffFormat(diff)}\n\n`;
}

export function lastTime(time) {
  const current = new Date();
  const last = new Date(time);
  const timeDiff = current - last;
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) {
    return "hace menos de un minuto";
  } else if (minutes < 60) {
    return `hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  } else if (hours < 24) {
    return `hace ${hours} hora${hours > 1 ? "s" : ""}`;
  } else {
    return `hace ${days} día${days > 1 ? "s" : ""}`;
  }
}

export function inflationMessage(client, ipc, monthly) {
  const date = new Date();
  let desc;
  if (monthly) {
    desc = `La variación de precios de la canasta básica en el mes de ${monthName(
      date.getMonth()
    )} al día ${date.getDate()} es del **${ipc}**`;
  } else {
    desc = `La variación de precios de la canasta básica en las últimas 24 horas fue del **${ipc}**`;
  }
  const embed = new EmbedBuilder()
    .setAuthor({
      name: "Dólar Bot",
      iconURL: client.user.displayAvatarURL(),
      url: getUrl(monthly),
    })
    .setDescription(desc)
    .setColor("#4169E1")
    .setFooter({ text: `Medición hecha sobre hipermercados` });
  return embed;
}

export function getUrl(monthly) {
  const range = dateFormat(monthly);
  return `https://lookerstudio.google.com/u/0/reporting/836bfaaa-82ac-467f-b5e2-886cca7c97f4/page/p_daihmm6ogd?params=%7B%22df40%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580${range.date1}%22,%22df41%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580${range.date2}%22%7D`;
}

export function compareNews(a, b) {
  if (a.priority === "ATENCIÓN") {
    return -1;
  } else if (b.priority === "ATENCIÓN") {
    return 1;
  } else {
    return 0;
  }
}

export function createErrorMessage(client, error, message, displayError) {
  let embed;
  if (message && displayError) {
    embed = new EmbedBuilder()
      .setAuthor({
        name: "Dólar Bot",
        iconURL: client.user.displayAvatarURL(),
        url: "https://www.finanzasargy.com/",
      })
      .setTitle("⚠ Command Error")
      .setDescription(`${error}, ${message}`)
      .setColor("#d41212");
  } else if (message) {
    embed = new EmbedBuilder()
      .setAuthor({
        name: "Dólar Bot",
        iconURL: client.user.displayAvatarURL(),
        url: "https://www.finanzasargy.com/",
      })
      .setTitle("⚠ Command Error")
      .setDescription(`${message}`)
      .setColor("#d41212");
    console.log(error);
  } else {
    embed = new EmbedBuilder()
      .setAuthor({
        name: "Dólar Bot",
        iconURL: client.user.displayAvatarURL(),
        url: "https://www.finanzasargy.com/",
      })
      .setTitle("⚠ Command Error")
      .setDescription(`(${error})`)
      .setColor("#d41212");
  }
  return embed;
}

export function getType(name) {
  const palabras = name.trim().split(/\s+/);
  let type = palabras[0];
  return type
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function currencyFormat(name, amount) {
  const type = getType(name);
  const format = (amount != 1);
  return `${getSign(type)}${amount} ${getName(type, format)}`;
}

export async function exchange(option, amount, goal) {
  try {
    const goalCurrent = await getCurrency(goal);
    const cant =
      option == "blue"
        ? amount * goalCurrent.compra
        : amount / goalCurrent.venta;
    const strCant = cant.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    let info = {};
    if (option == "blue") {
      info.desc = `${strCant}`;
    } else {
      info.desc = `${currencyFormat(goal, strCant)}`;
    }
    info.currency = goalCurrent;
    info.cant = strCant;
    return info;
  } catch (error) {
    throw error;
  }
}

function getSign(type) {
  if (type == "dolar") {
    return "$";
  } else if (type == "euro") {
    return "€";
  } else if (type == "real") {
    return "R$";
  }
}

function getName(type, format) {
  if (type == "dolar") {
    return `dolar${format ? 'es' : ''}`;
  } else if (type == "euro") {
    return `euro${format ? 's' : ''}`;
  } else if (type == "real") {
    return `real${format ? 'es' : ''}`;
  }
}

function percFormat(perc) {
  let format;
  const percentage = perc.toFixed(1);
  perc <= 0 ? (format = "") : (format = "+");
  format += `${percentage}%`;
  return format;
}

function diffFormat(diff) {
  let format;
  if (diff >= 0) {
    diff == 0 ? (format = "") : (format = `, +${diff} pesos`);
  } else {
    format = `, ${diff} pesos`;
  }
  return format;
}

function emoji(perc, name) {
  if (perc >= 3) {
    return `🔥${currencyEmoji(name)}`;
  } else if (perc <= -3) {
    return `⬇️${currencyEmoji(name)}`;
  } else {
    return `${currencyEmoji(name)}`;
  }
}

function currencyEmoji(name){
  if (name == 'Real Blue') {
    return "🇧🇷";
  } else if (name == 'Euro Blue') {
    return "💶";
  } else if (name == 'Dólar Blue') {
    return "💵";
  } else {
    return "?";
  }
}

function dateFormat(monthly) {
  let range = {};
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  let thisDay =
    date.getHours() < 9
      ? (date.getDate() - 1).toString().padStart(2, "0")
      : date.getDate().toString().padStart(2, "0");
  if (monthly) {
    range.date1 = `${year}${month}01`;
  } else {
    thisDay == 0o1
      ? (range.date1 = `${year}${month}${thisDay}`)
      : (range.date1 = `${year}${month}${(thisDay - 1)
          .toString()
          .padStart(2, "0")}`);
  }
  range.date2 = `${year}${month}${thisDay}`;
  return range;
}

function monthName(monthNumber) {
  const m = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return m[monthNumber];
}