const { ApplicationCommandType, EmbedBuilder} = require('discord.js');
const fs = require("fs");
let LeaderRole = process.env.LEADER_ID
let GeneralRole = process.env.GENERAL_ID
let OfficerRole = process.env.OFFICER_ID
let VeteranRole = process.env.VETERAN_ID
let MemberRole = process.env.MEMBER_ID
let ClansStoragePath = "./Storage/Clans.json"

module.exports = {
    name: 'clankick',
    description: "Kick Member from Clan",
    cooldown: 6000,
    options: [
        {
            name: 'member',
            description: "The Member you want to kick from the clan",
            type: 6,
            required: true
        }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {

        let target = interaction.options.get('member')
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


        let UserLeaderRole = interaction.member.roles.cache.some(role => { if (role.id === LeaderRole) return true })
        if (!UserLeaderRole) {//check if user is clan leader
            const b = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('FoxMC Clans')
                .setDescription('> Only Clan Leaders can run this command!')
                .setTimestamp()
                .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
            try{
                interaction.reply({ embeds: [b] })
            }catch (err){
                console.log(err)
            }
            return;
        }


        if (target.user.id === interaction.member.user.id) {//check if target == user
            const c = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('FoxMC Clans')
                .setDescription('> You can\'t kick yourself!')
                .setTimestamp()
                .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
            try{
                interaction.reply({ embeds: [c] })
            }catch (err){
                console.log(err)
            }
            return;
        }

        let TargetClan = target.member.roles.cache.some(role => role.id === UserClanRole.id)

        if (!TargetClan) {//check if target in clan
            const d = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('FoxMC Clans')
                .setDescription('> The player is not on your clan!')
                .setTimestamp()
                .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
            try{
                interaction.reply({ embeds: [d] })
            }catch (err){
                console.log(err)
            }
            return;
        }

        fs.readFile(ClansStoragePath, 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                let obj = JSON.parse(data); //now it an object
                for(let i = 0; i < obj.length; i++){
                    if(obj[i].LeaderID === interaction.user.id){
                        obj[i].Members = obj[i].Members.filter(member => member.MemberID !== target.user.id)
                    }
                }

                let json = JSON.stringify(obj, null, 2); //convert it back to json
                fs.writeFile(ClansStoragePath, json, 'utf8', function writeFileCallback(err) {// write it back
                    if (err) {
                        console.log(err)
                    }
                });
            }
        });




        target.member.roles.cache.some(role => {
            if (role.id === GeneralRole || role.id === OfficerRole || role.id === VeteranRole || role.id === MemberRole) {
                try{
                    target.member.roles.remove(role)
                    target.member.roles.remove(UserClanRole)
                }catch (err){
                    console.log(err)
                }

                const e = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('FoxMC Clans')
                    .setThumbnail(target.member.displayAvatarURL())
                    .setDescription(`> ${target.user.username} has been removed successfully`)
                    .setTimestamp()
                    .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });

                try{
                    interaction.reply({ embeds: [e] })
                }catch (err){
                    console.log(err)
                }

                return true;
            }
        })

    }
};