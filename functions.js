const puppeteer = require("puppeteer");
const fs = require('fs');

const { EmbedBuilder } = require("discord.js");

async function getValue() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.finanzasargy.com/cotizaciones-mercado-blue");
  await page.waitForSelector(".css-srw7ja");

  const result = await page.evaluate(() => {

    let arrayInfo = Array.from(document.querySelectorAll(".cardBox")).slice(
      0,
      2
    );

    let arrayV = arrayInfo.map((x) => {
      return {
        precio: x.querySelector(".css-srw7ja").innerText,
        nombre: x.querySelector("h2").innerText,
        porcentaje: x.querySelector(".chakra-text.css-12aszlq").innerText,
        variacion: x.querySelector(".css-12qh6d8:nth-of-type(2) .css-1ppz1bw").innerText,
        date: x.querySelector(".css-emcyhi").innerText.toLowerCase(),
      };
    });
    
    return arrayV;
  });

  await browser.close();
  return result;
};

async function convertir(valorDolar){
  let dolares = await getValue();
  return parseInt(dolares[0].precio.slice(1, -3), 10);
};

module.exports.convertir = convertir;

module.exports.getValue = getValue;

function formatter(client, dolares) {
  let texto = ``;

  dolares.forEach((x) => {
    // Si la variacion es positiva agrega un "+"
    let variacion =
      x.variacion !== "$0,00"
        ? `, ${
            x.variacion.includes("-")
              ? x.variacion.replace("$", "").replace(",00", "")  // Si la variación es negativa no agrega nada pero elimina $
              : x.variacion.replace("$", "+").replace(",00", "")
          }`
        : ", *sin variación*";
    // Si el porcentaje es positivo agrega un "+"
    let porcentaje =
      x.porcentaje !== "0.0%"
        ? `(${x.porcentaje.includes("-") ? x.porcentaje : `+${x.porcentaje}`})`
        : "";
    // Hace mayuscula la primera letra de cada palabra del nombre
    let nombre = x.nombre
      .split(" ")
      .map((x, index) => {
        if (index === 2) {
            return x.toUpperCase(); }
        else {
            return `${x.charAt(0).toUpperCase()}${x.slice(1)}`
        }
        })
      .join(" ");

    let emoji = 
        x.variacion !== "$0.00"
        ? x.variacion.includes("-") 
            ? "⬇️💵"
            : "🔥💵"
        : "💵";

    texto += `${emoji} ${nombre}: **${x.precio}** ${porcentaje}${variacion} pesos\n\n`;
  });
  const embed = new EmbedBuilder()
      .setAuthor({ name: 'Dólar Bot', iconURL: client.user.displayAvatarURL(), url: 'https://www.finanzasargy.com/' })
      .setDescription(texto)
      .setColor('#4169E1')
      .setFooter({ text: `Actualizado ${dolares[0].date}`});
  return embed;
};

module.exports.formatter = formatter;

module.exports.checker = async function checker(client) {

  let dolares = await getValue();
  let mensaje = formatter(client, dolares);

  fs.readFile('./guilds.json', 'utf8', (err, guilds) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      return;
    }
     
    else {

      const jsonObject = JSON.parse(guilds);
        
      if (dolares[0].precio != jsonObject.values[0][0].precio || dolares[1].precio != jsonObject.values[0][1].precio) {

        try {
          
          jsonObject.values[0] = dolares;

          const nuevoContenido = JSON.stringify(jsonObject, null, 2);
    
          fs.writeFile('guilds.json', nuevoContenido, 'utf8', (err) => {
            if (err) {
              console.error('Error al escribir en el archivo:', err);
              return;
            }
            console.log('Nuevo valor agregado con éxito.');
          });

          jsonObject.channels.forEach(x => {
            const channel0 = client.channels.cache.find(channel => channel.id === x.channel);
            channel0.send({ embeds: [mensaje] });
          }) 

        } catch (jsonErr) {
          console.error(jsonErr);
        }}
       else {
         console.log("Valor repetido");
       }
    }
    });
}
