// (!) Restart bot: 'nodemon' in terminal

require("dotenv").config();

const fs = require('fs');
const { getValue, formatter, checker} = require("../websc.js"); // import functions

const { Client, IntentsBitField, PermissionsBitField } = require("discord.js");
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});

client.on("ready", (c) => {
  console.log("Bot prendido.");  // just for in-compiler control
});

var intervalo = setInterval(() => {  
  if((new Date()).getHours() > 17) {
    clearInterval(intervalo);
    return;
  }
  checker();
}, 1800000)

client.on('interactionCreate', async (interaction) => {  // slash commands 
  
  if (interaction.commandName === 'ping'){
    interaction.reply("pong");
  }

  if (interaction.commandName === 'dolar-hoy'){
    let dolares = await getValue();
    let mensaje = formatter(dolares);
    interaction.reply(mensaje);
  };

  if (interaction.commandName === 'set-channel'){

    if (interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {

      fs.readFile('./guilds.json', 'utf8', (err, guilds) => {

        if (err) {
          console.error(err);
          return;
        }
        try {

          const nuevoCanal = {
            serverid: interaction.guildId,
            channel: interaction.options.get('channel').value
          };   
        
          const jsonObject = JSON.parse(guilds);
          const isItem = jsonObject.channels.find(x => x.serverid === nuevoCanal.serverid);

          if (isItem) {
            isItem.channel = nuevoCanal.channel;
          } else {
          jsonObject.channels.push(nuevoCanal);
        }

          const nuevoContenido = JSON.stringify(jsonObject, null, 2);
      
          fs.writeFile('guilds.json', nuevoContenido, 'utf8', (err) => {
            if (err) {
              console.error('Error al escribir en el archivo:', err);
              return;
            }
            interaction.reply('El bot ahora actualizará el precio en ' + '<#' + nuevoCanal.channel + '>');
          });
        } catch (jsonErr) {
          console.error(jsonErr);
        }
      });  
    } else {
      interaction.reply("Este comando requiere permisos de administrador");
    } }

  if (interaction.commandName === 'delete-channel'){

    if (interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {

      const nuevoCanal = {
        channel: interaction.options.get('channel').value,
      };
    
      fs.readFile('./guilds.json', 'utf8', (err, guilds) => {

        if (err) {
          console.error(err);
          return;
        }
        try {

          const jsonObject = JSON.parse(guilds);
          const index = jsonObject.channels.findIndex(x => x.channel === nuevoCanal.channel);

          if (index != -1) {

            jsonObject.channels.splice(index, 1);
            const nuevoContenido = JSON.stringify(jsonObject, null, 2);
        
            fs.writeFile('guilds.json', nuevoContenido, 'utf8', (err) => {
              if (err) {
                console.error('Error escribiendo nuevo contenido', err);
                return;
              }
              interaction.reply('Se eliminó de la lista el canal ' + '<#' + nuevoCanal.channel + '>');
            });
          }
          else {
            interaction.reply('El canal mencionado no está en la lista');
          }
        } catch (jsonErr) {
          console.error('Error al parsear JSON:', jsonErr);
        }
      }); 
    } else {
      interaction.reply("Este comando requiere permisos de administrador");
    }};

});

client.on("messageCreate", async (msg) => { // text commands

  console.log(msg.content);
  if (msg.content.toLowerCase() === "dolar hoy" || msg.content.toLowerCase() === "dólar hoy") {
    let dolares = await getValue();
    let mensaje = formatter(dolares);
    msg.reply({
      content: mensaje,
    });
  }
});

client.login(process.env.TOKEN);