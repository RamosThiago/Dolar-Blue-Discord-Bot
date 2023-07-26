const puppeteer = require('puppeteer');

async function openWebPage(){
    const browser = await puppeteer.launch()
        headless: true
    const page = await browser.newPage()

    await page.goto('https://www.finanzasargy.com/')
    await browser.close()
}

// openWebPage();

module.exports.getValue = async function getValue(){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.finanzasargy.com/cotizaciones-mercado-blue')
    await page.waitForSelector('.css-srw7ja')
    const result = await page.evaluate(() => {
        let arrayInfo = Array.from(document.querySelectorAll('.cardBox')).slice(0,2);
        let arrayV = arrayInfo.map((x) => {return {
            precio : x.querySelector('.css-srw7ja').innerText,
            nombre : x.querySelector('h2').innerText,
            porcentaje : x.querySelector('.chakra-text.css-12aszlq').innerText,
            date : x.querySelector('.css-emcyhi').innerText.toLowerCase()
        } })
        return arrayV
    })

    await browser.close()
    return result;
}
