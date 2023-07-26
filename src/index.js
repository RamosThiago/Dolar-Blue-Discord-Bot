// save changes with nodemon in terminal

require('dotenv').config();

var fechaAnterior;

const {getValue, getDate} = require('../websc.js');

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
    if (msg.content.toLowerCase() === 'dolar hoy'){
        var dolar = await getValue()
        var fecha = await getDate(fechaAnterior)
        console.log(fechaAnterior)
        if (fecha.bool) {
            msg.reply({
            content: `Dólar Blue: ${dolar[0].precio} +${dolar[0].porcentaje}
Dólar Blue GBA: ${dolar[1].precio} +${dolar[1].porcentaje}
No se actualizó todavia (Última actualización ${fecha.a})`})}
        else {
            msg.reply({
            content: `Dólar Blue: ${dolar[0].precio} +${dolar[0].porcentaje}
Dólar Blue GBA: ${dolar[1].precio} +${dolar[1].porcentaje}
(Actualizado el ${fecha.a})`})}
    }
});

client.login(process.env.TOKEN);


