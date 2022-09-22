const {ApplicationCommandType, EmbedBuilder} = require('discord.js');
let LeaderRole = process.env.LEADER_ID
let GeneralRole = process.env.GENERAL_ID
let OfficerRole = process.env.OFFICER_ID
let VeteranRole = process.env.VETERAN_ID
let MemberRole = process.env.MEMBER_ID
let ClansStoragePath = "./Storage/Clans.json"
const fs = require("fs");

module.exports = {
    name: 'clanleave',
    description: "Leave from clan",
    cooldown: 30000,
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {

        let UserClanRole = null;

        let CheckUserClanRole = interaction.member.roles.cache.some(role => {
            if (role.name.includes("Clan -")) {
                UserClanRole = role
                return true
            }
        })

        if (!CheckUserClanRole) {//check if user in clan
            const a = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('FoxMC Clans')
                .setDescription('> You are not on a clan!')
                .setTimestamp()
                .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
            try{
                interaction.reply({ embeds: [a] })
            }catch (err){
                console.log(err)
            }
            return;
        }


        interaction.member.roles.cache.some(role => {
            if (role.id === LeaderRole) {//check if user is leader
                const b = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('FoxMC Clans')
                    .setDescription('> You are The Leader of the clan. To delete your clan open a ticket or transfer the clan Leader to someone')
                    .setTimestamp()
                    .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
                try{
                    interaction.reply({ embeds: [b] })
                }catch (err){
                    console.log(err)
                }
                return false;
            }
            if (role.id === GeneralRole || role.id === OfficerRole || role.id === VeteranRole || role.id === MemberRole) {
                try{
                    interaction.member.roles.remove(role)
                    interaction.member.roles.remove(UserClanRole)
                }catch (err){
                    console.log(err)
                }

                fs.readFile(ClansStoragePath, 'utf8', function readFileCallback(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        let obj = JSON.parse(data); //now it an object
                        for (let i = 0; i < obj.length; i++) {
                            obj[i].Members = obj[i].Members.filter(member => member.MemberID !== interaction.user.id)
                        }
                        /////////
                        let json = JSON.stringify(obj, null, 2); //convert it back to json
                        fs.writeFile(ClansStoragePath, json, 'utf8', function writeFileCallback(err) {// write it back
                            if (err) {
                                console.log(err)
                            }
                        });
                    }
                });

                const c = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('FoxMC Clans')
                    .setThumbnail(interaction.member.displayAvatarURL())
                    .setDescription(`> ${interaction.user.username} has left the clan`)
                    .setTimestamp()
                    .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
                try{
                    interaction.reply({ embeds: [c] })
                }catch (err){
                    console.log(err)
                }

                return true;
            }
        })
    }
};