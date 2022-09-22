const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v10');
const fs = require('fs');
const path = require('node:path');

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

module.exports = {
    async execute(client) {
        client.commandArray = [];
        const commandsPath = path.join(__dirname, 'commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            client.commands.set(command.data.name, command);
            client.commandArray.push(command.data.toJSON);
        }


        const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');

                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    {body: client.commandArray},
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    }
}