import dotenv from "dotenv";
dotenv.config();
import { REST, Routes, ApplicationCommandOptionType } from "discord.js";

// (!!) Ejecutar la primera vez o cada vez que se cambie algo para guardar los cambios

const commands = [
  {
    name: "ping",
    description: "Hace un ping al bot",
  },
  {
    name: "dolar-hoy",
    description: "Envía el último valor del dolar blue.",
  },
  {
    name: "euro-hoy",
    description: "Envía el último valor del euro blue.",
  },
  {
    name: "real-hoy",
    description: "Envía el último valor del real blue.",
  },
  {
    name: "channel",
    description: "Gestionar el canal de actualización del bot",
    options: [
      {
        name: "set",
        description: "Establece un canal donde el bot actualizará el precio del dólar.",
        type: 1,
        options: [
          {
            name: "channel",
            description: "Desactivar las actualizaciones del bot en un canal anteriormente establecido.",
            type: 7,
            required: true,
            channel_types: [0],
          },
        ],
      },
      {
        name: "delete",
        description: "Eliminar un canal esta",
        type: 1,
        options: [
          {
            name: "channel",
            description: "Elige un canal",
            type: 7,
            required: true,
            channel_types: [0],
          },
        ],
      },
    ],
  },
  {
    name: "inflacion",
    description: "Mostrar la variación del IPC en Argentina",
    options: [
      {
        name: "diaria",
        description: "Muestra la inflación diaria.",
        type: 1,
      },
      {
        name: "mensual",
        description: "Muestra la inflación en lo que va del mes.",
        type: 1,
      },
    ],
  },
  {
    name: "noticias",
    description: "Envía las últimas noticias de Argentina",
  },
  {
    name: "convertir",
    description: "Conversor para los distintos tipos de cambio blue.",
    options: [
      {
        name: "pesos",
        type: 1,
        description: "convertir pesos argentinos a alguna divisa blue",
        options: [
          {
            name: "divisa",
            type: ApplicationCommandOptionType.String,
            description: "tipo de cambio blue a conseguir",
            required: true,
            choices: [
              { name: "Dolar Blue", value: "Dólar Blue" },
              { name: "Euro Blue", value: "Euro Blue" },
              { name: "Real Blue", value: "Real Blue" },
            ],
          },
          {
            name: "monto",
            type: ApplicationCommandOptionType.Number,
            description: "monto de pesos argentinos a convertir a cambio blue",
            required: true,
          },
        ]
      },
      {
        name: "blue",
        type: 1,
        description: "convertir alguna divisa blue a pesos argentinos",
        options: [
            {
              name: "divisa",
              type: ApplicationCommandOptionType.String,
              description: "tipo de cambio blue a convertir",
              required: true,
              choices: [
                { name: "Dolar Blue", value: "Dólar Blue" },
                { name: "Euro Blue", value: "Euro Blue" },
                { name: "Real Blue", value: "Real Blue" },
              ],
            },
            {
              name: "monto",
              type: ApplicationCommandOptionType.Number,
              description: "monto de divisa blue a convertir a pesos argentinos",
              required: true,
            },
        ]
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("Slash commands registered successfully");
  } catch (error) {
    console.log(`${error}`);
  }
})();
