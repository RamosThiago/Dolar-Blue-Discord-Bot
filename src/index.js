// save changes with nodemon in terminal

require('dotenv').config();

var fechaAnterior;

const {getValue} = require('../websc.js');

const { Client, IntentsBitField} = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.on('ready', (c) => {
    console.log('Bot prendido.');
});

client.on('messageCreate', async (msg) => {

    console.log(msg.content);

    if ((msg.content.toLowerCase() === 'dolar hoy') || (msg.content.toLowerCase() === 'dólar hoy')) {

        var dolar = await getValue()
        
        console.log(dolar[0].date,dolar[1].date)

        var dolar0 = parseFloat(dolar[0].precio.replace("$", ""));
        var dolar1 = parseFloat(dolar[1].precio.replace("$", ""));
        var porcentaje0 = parseFloat(dolar[0].porcentaje.replace("%", ""));
        var porcentaje1 = parseFloat(dolar[1].porcentaje.replace("%", ""));
        
        var difDolar0 = Math.round((dolar0 * porcentaje0) / 100)
        var difDolar1 = Math.round((dolar1 * porcentaje1) / 100)

    switch(true) {

        case difDolar0 > 0 && difDolar1 > 0: // 1 - +dif0 y +dif1
            msg.reply({
                content: `🔥💵 Dólar Blue: **${dolar[0].precio}** *+${dolar[0].porcentaje}, +${difDolar0} pesos* [Actualizado ${dolar[0].date}]
🔥💵 Dólar Blue GBA: **${dolar[1].precio}** *+${dolar[1].porcentaje}, +${difDolar1} pesos* [Actualizado ${dolar[1].date}]`})
            break;
        
        case difDolar0 > 0 && difDolar1 < 0: // 2 - +dif0 y -dif1 presentes
            msg.reply({
                content: `🔥💵 Dólar Blue: **${dolar[0].precio}** *+${dolar[0].porcentaje}, +${difDolar0} pesos* [Actualizado ${dolar[0].date}]
⬇️💵 Dólar Blue GBA: **${dolar[1].precio}** *${dolar[1].porcentaje}, ${difDolar1} pesos* [Actualizado ${dolar[1].date}]`})
            break;
        
        case difDolar0 > 0 && difDolar1 == 0: // 3 - +dif0
            msg.reply({
                content: `💵 Dólar Blue: **${dolar[0].precio}** *+${dolar[0].porcentaje}, +${difDolar0} pesos* [Actualizado ${dolar[0].date}]
🔥💵 Dólar Blue GBA: **${dolar[1].precio}** *${dolar[1].porcentaje}* [Actualizado ${dolar[1].date}]`})
            break;

        case difDolar0 < 0 && difDolar1 > 0: // 4 - -dif0 y +dif1 presentes
            msg.reply({
                content: `⬇️💵 Dólar Blue: **${dolar[0].precio}** *${dolar[0].porcentaje}, ${difDolar0} pesos* [Actualizado ${dolar[0].date}]
🔥💵 Dólar Blue GBA: **${dolar[1].precio}** *+${dolar[1].porcentaje}, +${difDolar1} pesos* [Actualizado ${dolar[1].date}]`})
            break;
        
        case difDolar0 < 0 && difDolar1 < 0: // 5 - -dif0 y -dif1 presentes
            msg.reply({
                content: `⬇️💵 Dólar Blue: **${dolar[0].precio}** *${dolar[0].porcentaje}, ${difDolar0} pesos* [Actualizado ${dolar[0].date}]
⬇️💵 Dólar Blue GBA: **${dolar[1].precio}** *${dolar[1].porcentaje}, ${difDolar1} pesos* [Actualizado ${dolar[1].date}]`})
            break;

        case difDolar0 < 0 && difDolar1 == 0: // 6 - -dif0 
            msg.reply({
                content: `⬇️💵 Dólar Blue: **${dolar[0].precio}** *${dolar[0].porcentaje}, ${difDolar0} pesos* [Actualizado ${dolar[0].date}]
💵 Dólar Blue GBA: **${dolar[1].precio}** *${dolar[1].porcentaje}* [Actualizado ${dolar[1].date}]`})
            break;
        
        case difDolar0 > 0 && difDolar1 == 0: // 7 - +dif1 
            msg.reply({
                content: `💵 Dólar Blue: **${dolar[0].precio}** *${dolar[0].porcentaje}* [Actualizado ${dolar[0].date}]
🔥💵 Dólar Blue GBA: **${dolar[1].precio}** *+${dolar[1].porcentaje}, +${difDolar1} pesos* [Actualizado ${dolar[1].date}]`})
            break;

        case difDolar0 < 0 && difDolar1 == 0: // 8 - -dif1
            msg.reply({
                content: `💵 Dólar Blue: **${dolar[0].precio}** *${dolar[0].porcentaje}* [Actualizado ${dolar[0].date}]
⬇️💵 Dólar Blue GBA: **${dolar[1].precio}** *${dolar[1].porcentaje}, ${difDolar1} pesos* [Actualizado ${dolar[1].date}]`})
            break;

        default:  // 9 - Sin diferencia

            msg.reply({
                content: `💵 Dólar Blue: **${dolar[0].precio}** *${dolar[0].porcentaje}* [Actualizado ${dolar[0].date}]
💵 Dólar Blue GBA: **${dolar[1].precio}** *${dolar[1].porcentaje}* [Actualizado ${dolar[1].date}]`})
            break;
    }}
});

// client.channels.cache.get(`828717280829243422`).send(`Text`)

client.login(process.env.TOKEN);


