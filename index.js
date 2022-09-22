const {Client, GatewayIntentBits, Partials, Collection} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});

const fs = require("fs")
const config = require('./config.json');
require('dotenv').config()

client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection();
client.prefix = config.prefix

global.TextChannels = []
global.Infos = []

module.exports = client

fs.readdirSync('./handlers').forEach((handler) => {
    require(`./handlers/${handler}`)(client)
});


client.login(process.env.TOKEN)
