import { Client, IntentsBitField, PermissionsBitField } from "discord.js";
import dotenv from "dotenv";
import {
  calculate,
  checker,
  deleteChannel,
  displayBlue,
  displayIpc,
  displayNews,
  getRiesgoPais,
  setChannel,
} from "./functions.js";
import { createErrorMessage } from "./utils.js";
dotenv.config();
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log("Bot prendido");
});

// Intervalo que controla cada media hora (durante los días horas que esté abierto el mercado) si cambió el valor

const intervalo = setInterval(async () => {
  const date = new Date();
  if (date.getDay >= 1 || date.getDay <= 5) {
    console.log("Fin de mensajes automaticos, tiempo limite alcanzado");
    clearInterval(intervalo);
    return;
  } else if (date.getHours() <= 17 || date.getHours() > 10) {
    try {
      checker(client);
    } catch (error) {
      console.log(`Error en la función checker: ${error}`);
    }
  }
}, 900000);

// Slash commands

client.on("interactionCreate", async (interaction) => {
  if (interaction.commandName === "ping") {
    interaction.reply("pong");
  }

  if (interaction.commandName === "dolar-hoy") {
    await interaction.deferReply();
    const mensaje = await displayBlue(client, "Dólar Blue");
    interaction.editReply({ embeds: [mensaje] });
  }

  if (interaction.commandName === "euro-hoy") {
    await interaction.deferReply();
    const mensaje = await displayBlue(client, "Euro Blue");
    interaction.editReply({ embeds: [mensaje] });
  }

  if (interaction.commandName === "real-hoy") {
    await interaction.deferReply();
    const mensaje = await displayBlue(client, "Real Blue");
    interaction.editReply({ embeds: [mensaje] });
  }

  if (interaction.commandName === "canasta") {
    const subcommand = interaction.options.getSubcommand();
    let mensaje;
    await interaction.deferReply();
    if (subcommand === "diaria") {
      mensaje = await displayIpc(client, false);
    } else if (subcommand === "mensual") {
      mensaje = await displayIpc(client, true);
    }
    interaction.editReply({ embeds: [mensaje] });
  }

  if (interaction.commandName === "noticias") {
    await interaction.deferReply();
    const mensaje = await displayNews(client);
    interaction.editReply({ embeds: [mensaje] });
  }

  if (interaction.commandName === "channel") {
    const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply();
    if (
      interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      try {
        if (subcommand === "set") {
          await setChannel(interaction);
        } else if (subcommand === "delete") {
          await deleteChannel(interaction);
        }
      } catch (error) {
        interaction.editReply({
          embeds: [
            createErrorMessage(
              client,
              error,
              "Hubo un error al intentar agregar/eliminar el canal."
            ),
          ],
        });
      }
    }
  }

  if (interaction.commandName === "convertir") {
    const option = interaction.options.getSubcommand();
    const type = interaction.options.get("divisa").value;
    const amount = interaction.options.get("monto").value;
    await interaction.deferReply();
    if (amount > 0) {
      try {
        const mensaje = await calculate(client, option, amount, type);
        interaction.editReply({ embeds: [mensaje] });
      } catch (error) {
        interaction.editReply({ embeds: [createErrorMessage(client, error)] });
      }
    } else {
      interaction.editReply({ content: "El número tiene que ser mayor a 0" });
    }
  }

  if (interaction.commandName === "riesgo-pais") {
    await interaction.deferReply();
    const mensaje = await getRiesgoPais(client);
    interaction.editReply({ embeds: [mensaje] });
  }

  if (interaction.commandName === "inflacion") {
    await interaction.deferReply();
    interaction.editReply({ embeds: [mensaje] });
  }

  if (interaction.commandName === "datos-economicos") {
    await interaction.deferReply();
    interaction.editReply({ embeds: [mensaje] });
  }
});

// Comandos de texto

client.on("messageCreate", async (msg) => {
  console.log(msg.content);

  if (/^d[oó]lar (hoy|blue)$/i.test(msg.content)) {
    msg.channel.sendTyping();
    let mensaje = await displayBlue(client, "Dólar Blue");
    msg.reply({ embeds: [mensaje] });
  }

  if (/^euro (hoy|blue)$/i.test(msg.content)) {
    msg.channel.sendTyping();
    let mensaje = await displayBlue(client, "Euro Blue");
    msg.reply({ embeds: [mensaje] });
  }

  if (/^real (hoy|blue)$/i.test(msg.content)) {
    msg.channel.sendTyping();
    let mensaje = await displayBlue(client, "Real Blue");
    msg.reply({ embeds: [mensaje] });
  }

  if (
    msg.content.toLowerCase() === "inflacion diaria" ||
    msg.content.toLowerCase() === "inflación diaria"
  ) {
    msg.channel.sendTyping();
    let mensaje = await displayIpc(client, false);
    msg.reply({ embeds: [mensaje] });
  }

  if (
    msg.content.toLowerCase() === "inflacion mensual" ||
    msg.content.toLowerCase() === "inflación mensual"
  ) {
    msg.channel.sendTyping();
    let mensaje = await displayIpc(client, true);
    msg.reply({ embeds: [mensaje] });
  }

  if (msg.content.toLowerCase() === "noticias hoy") {
    msg.channel.sendTyping();
    let mensaje = await displayNews(client);
    msg.reply({ embeds: [mensaje] });
  }
});

client.login(process.env.TOKEN);
