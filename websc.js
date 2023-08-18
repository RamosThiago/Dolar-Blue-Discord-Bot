const puppeteer = require("puppeteer");

async function openWebPage() {
  const browser = await puppeteer.launch();
  headless: true;
  const page = await browser.newPage();

  await page.goto("https://www.finanzasargy.com/");
  await browser.close();
}

// openWebPage();

module.exports.getValue = async function getValue() {
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
        variacion: x.querySelector(".css-12qh6d8:nth-of-type(2) .css-1ppz1bw")
          .innerText,
        date: x.querySelector(".css-emcyhi").innerText.toLowerCase(),
      };
    });
    return arrayV;
  });

  await browser.close();
  return result;
};

module.exports.formatter = function formatter(dolares) {
  let texto = ``;

  dolares.forEach((x) => {
    // Si la variacion es positiva agrega un "+"
    let variacion =
      x.variacion !== "$0,00"
        ? `, ${
            x.variacion.includes("-")
              ? x.variacion
              : x.variacion.replace("$", "$+")
          }`
        : " Sin variacion";
    // Si el porcentaje es positivo agrega un "+"
    let porcentaje =
      x.porcentaje !== "0.0%"
        ? `(${x.porcentaje.includes("-") ? x.porcentaje : `+${x.porcentaje}`})`
        : "";
    // Hace mayuscula la primera letra de cada palabra del nombre
    let nombre = x.nombre
      .split(" ")
      .map((x) => `${x.charAt(0).toUpperCase()}${x.slice(1)}`)
      .join(" ");

    texto += `${nombre}: **${x.precio}**${porcentaje}${variacion} [Actualizado ${x.date}]\n`;
  });
  return texto;
};
