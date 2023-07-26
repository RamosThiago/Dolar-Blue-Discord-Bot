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
        let arrayInfo = Array.from(document.querySelectorAll('.cardBox'));
        let arrayV = arrayInfo.map((x) => {return {
            precio : x.querySelector('.css-srw7ja').innerText,
            nombre : x.querySelector('h2').innerText,
            porcentaje : x.querySelector('.chakra-text.css-12aszlq').innerText} })
        return arrayV
    })

    await browser.close()
    return result;
}

module.exports.getDate = async function getDate(fechaAnterior){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.finanzasargy.com/cotizaciones-mercado-blue')
    await page.waitForSelector('.css-srw7ja')

    const dateEv = await page.evaluate((fechaAnterior) => {

        let date = document.querySelector('.chakra-text.css-1fyayx3').innerText

        if (fechaAnterior === date){
            repeated = true
        } else {
            fechaAnterior = date
            repeated = false
        }
    
        return {
            a: date,
            bool: repeated,
        }
    }, fechaAnterior)

    await browser.close()
    return dateEv;
}

