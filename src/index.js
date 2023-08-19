// save changes with nodemon in terminal

require("dotenv").config();

const { getValue, formatter } = require("../websc.js");

const { Client, IntentsBitField } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log("Bot prendido.");
});

client.on("messageCreate", async (msg) => {
  console.log(msg.content);

  if (
    msg.content.toLowerCase() === "dolar hoy" ||
    msg.content.toLowerCase() === "dólar hoy"
  ) {
    let dolares = await getValue();

    let mensaje = formatter(dolares);
    msg.reply({
      content: mensaje,
    });
  }
});

client.login(process.env.TOKEN);
