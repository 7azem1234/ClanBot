const client = require('..');
const chalk = require('chalk');
const fs = require("fs");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const ChannelsStoragePath = "./Storage/ClanTextChannels.json"
let JoinRequests = "./Storage/JoinRequests.json"

client.on("ready", () => {

    client.user.setActivity("Playing Foxmc")
    client.user.setStatus("dnd")
    console.log(chalk.red(`Logged in as ${client.user.tag}!`))


    fs.readFile(ChannelsStoragePath, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
             //now it an object
            global.TextChannels = JSON.parse(data)
        }
    })

});