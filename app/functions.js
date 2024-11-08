import { EmbedBuilder } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import puppeteer from "puppeteer";
import { getCurrency, getDatosArgy, lastNews } from "./fetch.js";
import {
  compareNews,
  createErrorMessage,
  currencyFormat,
  descFormat,
  exchange,
  getUrl,
  inflationMessage,
  lastTime,
} from "./utils.js";

function blueMessage(client, blue) {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: "Dólar Bot",
      iconURL: client.user.displayAvatarURL(),
      url: "https://www.finanzasargy.com/",
    })
    .setDescription(descFormat(blue))
    .setColor("#4169E1")
    .setFooter({ text: `Actualizado ${lastTime(blue.updatedAt)}` });
  return embed;
}

// Revisa si el valor obtenido es diferente al guardado, si es asi lo guarda en el json y actualiza en todos los canales registrados

export async function checker(client) {
  try {
    const dolarBlue = await getCurrency("Dólar Blue");
    const actual = dolarBlue.venta;
    const data = await readFile("./app/data/guilds.json", "utf8");
    const jsonObject = JSON.parse(data);
    console.log("Actual: " + actual + " - Last: " + jsonObject.lastValue.venta);
    if (actual !== jsonObject.lastValue.venta) {
      jsonObject.lastValue.venta = actual;
      const mensaje = blueMessage(client, dolarBlue);
      const changedJson = JSON.stringify(jsonObject, null, 2);
      await writeFile("./app/data/guilds.json", changedJson, "utf8");
      jsonObject.channels.forEach((json) => {
        const ch = client.channels.cache.find((c) => c.id === json.channel);
        ch.send({ embeds: [mensaje] });
      });
    } else {
      console.log("No se actualizó los canales: valor repetido");
    }
  } catch (error) {
    throw error;
  }
}

export async function displayBlue(client, name) {
  try {
    const blue = await getCurrency(name);
    return blueMessage(client, blue);
  } catch (error) {
    const embed = createErrorMessage(
      client,
      error,
      "hubo un error al intentar acceder a la API.",
      true
    );
    return embed;
  }
}

// Se genera la url según la fecha y de si se pide ipc diario o mensual, y con puppeteer se obtiene la variación desde el html del lookerstudio (puede llegar a cambiar el elemento)

export async function displayIpc(client, monthly) {
  try {
    const lookerUrl = getUrl(monthly);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(lookerUrl);
    await page.waitForSelector(".cd-49hhmm6ogd .valueLabel");
    const ipc = await page.evaluate(() => {
      return document.querySelector(".cd-49hhmm6ogd .valueLabel").innerText;
    });
    await browser.close();
    return inflationMessage(client, ipc, monthly);
  } catch (error) {
    return createErrorMessage(client, error);
  }
}

// Obtiene las noticias de la API y genera un embed ordenado según la prioridad

export async function displayNews(client) {
  let embed;
  try {
    let news = await lastNews();
    let desc = "";
    news.sort(compareNews);
    news.forEach((x) => {
      desc += `- [${x.priority === "ATENCIÓN" ? "AHORA: " : ""}${x.title}](${
        x.link ? `${x.link}` : "https://www.finanzasargy.com/"
      }
      )\n\n`;
    });
    desc += `\n`;
    embed = new EmbedBuilder()
      .setAuthor({
        name: "Dólar Bot",
        iconURL: client.user.displayAvatarURL(),
        url: "https://www.finanzasargy.com/",
      })
      .setDescription(desc)
      .setColor("#d6e8f5");
  } catch (error) {
    embed = createErrorMessage(
      client,
      error,
      "hubo un error al intentar acceder a la API.",
      true
    );
  } finally {
    return embed;
  }
}

export async function setChannel(interaction) {
  try {
    const guilds = await readFile("./app/data/guilds.json", "utf8");
    const newCh = {
      serverid: interaction.guildId,
      channel: interaction.options.get("channel").value,
    };
    const jsonObject = JSON.parse(guilds);
    const server = jsonObject.channels.find(
      (x) => x.serverid === newCh.serverid
    );
    server ? (server.channel = newCh.channel) : jsonObject.channels.push(newCh);
    const changedJson = JSON.stringify(jsonObject, null, 2);
    await writeFile("./app/data/guilds.json", changedJson, "utf8");
    await interaction.editReply(
      "El bot ahora actualizará el precio en " + "<#" + newCh.channel + ">"
    );
  } catch (error) {
    console.log("Error en la función setChannel: " + error);
    throw error;
  }
}

export async function deleteChannel(interaction) {
  try {
    const newCh = {
      channel: interaction.options.get("channel").value,
    };
    const guilds = await readFile("./app/data/guilds.json", "utf8");
    const jsonObject = JSON.parse(guilds);
    const index = jsonObject.channels.findIndex(
      (x) => x.channel === newCh.channel
    );
    if (index !== -1) {
      jsonObject.channels.splice(index, 1);
      const newJson = JSON.stringify(jsonObject, null, 2);
      await writeFile("./app/data/guilds.json", newJson, "utf8");
      await interaction.editReply(
        "Se eliminó de la lista el canal " + "<#" + newCh.channel + ">"
      );
    } else {
      await interaction.editReply("El canal seleccionado no está en la lista");
    }
  } catch (error) {
    console.log("Error en la función deleteChannel: " + error);
    throw error;
  }
}

// Calculo con los distintos tipos de cambio obtenidos en la API

export async function calculate(client, option, amount, type) {
  try {
    const info = await exchange(option, amount, type);
    let desc = "";
    let embed = new EmbedBuilder()
      .setAuthor({
        name: "Dólar Bot",
        iconURL: client.user.displayAvatarURL(),
        url: "https://www.finanzasargy.com/",
      })
      .setColor("#4169E1");
    if (option == "blue") {
      desc += `${currencyFormat(type, amount)} ${
        info.cant != 1 ? "son" : "es"
      } **ARS$${info.desc} pesos**.`;
      embed.setFooter({
        text: `Precio de compra para ${type}: ${info.currency.compra}`,
      });
    } else {
      desc += `ARS$${amount.toLocaleString("de-DE")} ${
        amount != 1 ? "pesos argentinos" : "peso argentino"
      } ${info.cant != 1 ? "son" : "es"} **${info.desc}**.`;
      embed.setFooter({
        text: `Precio de venta para ${type}: ${info.currency.venta}`,
      });
    }
    embed.setDescription(desc);
    return embed;
  } catch (error) {
    return createErrorMessage(client, error);
  }
}

export async function getRiesgoPais(client) {
  try {
    const datos = await getDatosArgy();
    const objRiesgo = datos.find((obj) => obj["NOMBRE"] === "Riesgo país");

    if (objRiesgo) {
      const riesgoPais = objRiesgo["ULTIMO-VALOR"];
      const ultimaActualizacion = objRiesgo["ÚLTIMA ACTUALIZACION"];
      const ultimoDato = objRiesgo["ANTE-ULTIMO-DATO"].value;
      let emoji = "";

      console.log("Riesgo país: " + riesgoPais);
      console.log("Último dato: " + ultimoDato);

      if (riesgoPais > ultimoDato) {
        emoji = "⬆️";
      } else if (riesgoPais < ultimoDato) {
        emoji = "⬇️";
      }

      let desc = `**Riesgo país**: ${emoji} ${riesgoPais} puntos`;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: "Dólar Bot",
          iconURL: client.user.displayAvatarURL(),
          url: "https://www.finanzasargy.com/datos-argy",
        })
        .setDescription(desc)
        .setColor("#4169E1")
        .setFooter({ text: `Ultima actualizacion: ${ultimaActualizacion}` });
      return embed;
    } else {
      console.log('No se encontró el objeto con la clave "Riesgo país".');
    }
    return;
  } catch (error) {
    console.log(error);
  }
}
