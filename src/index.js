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

    switch(true) {
        
        case dolar[0].porcentaje.indexOf("-") > -1  && dolar[1].porcentaje.indexOf("-") > -1:

            msg.reply({
                content: `Dólar Blue: ${dolar[0].precio} ${dolar[0].porcentaje} (Actualizado ${dolar[0].date})
Dólar Blue GBA: ${dolar[1].precio} ${dolar[1].porcentaje} (Actualizado ${dolar[1].date})`})
            break;

        case dolar[0].porcentaje.indexOf("-") > -1  && dolar[1].porcentaje.indexOf("-") < -1:

            msg.reply({
                content: `Dólar Blue: ${dolar[0].precio} ${dolar[0].porcentaje} (Actualizado ${dolar[0].date})
Dólar Blue GBA: ${dolar[1].precio} +${dolar[1].porcentaje} (Actualizado ${dolar[1].date})`})

            break;

        case dolar[0].porcentaje.indexOf("-") < -1  && dolar[1].porcentaje.indexOf("-") > -1:

            msg.reply({
                content: `Dólar Blue: ${dolar[0].precio} +${dolar[0].porcentaje} (Actualizado ${dolar[0].date})
Dólar Blue GBA: ${dolar[1].precio} ${dolar[1].porcentaje} (Actualizado ${dolar[1].date})`})

            break;
        
        default: 

            msg.reply({
                content: `Dólar Blue: ${dolar[0].precio} +${dolar[0].porcentaje} (Actualizado ${dolar[0].date})
Dólar Blue GBA: ${dolar[1].precio} +${dolar[1].porcentaje} (Actualizado ${dolar[1].date})`})
            break;
    }}
});

client.login(process.env.TOKEN);


