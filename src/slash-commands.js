require('dotenv').config();

const { REST, Routes } = require('discord.js');

const commands = [ // set slash commands
{
    name : 'ping',
    description: 'Hace un ping al bot',
},
{
    name : 'dolar-hoy',
    description: 'Muestra el último valor del dolar',
},
{
    name: 'set-channel',
    description: 'Establece un canal para que el bot actualice el precio del dolar',
    options: [
        {
            name: 'channel',
            description: 'Elegí un canal',
            type: 7,
            channelTypes: 0,
            required: true,
        }
    ]
},
{
    name: 'delete-channel',
    description: 'Quita un canal del envío automatico de mensajes del bot',
    options: [
        {
            name: 'channel',
            description: 'Elegí un canal',
            type: 7,
            channelTypes: 0,
            required: true,
        }
    ]
}
];

const rest = new REST( { version: '10' }).setToken(process.env.TOKEN, process.env.GUILD_ID);

(async () => {
    try {
        console.log('Registering slash commands...');
        
        await rest.put (
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('Slash commands registered successfully');

    }   catch (error) {
        console.log(`${error}`);
    }
})();