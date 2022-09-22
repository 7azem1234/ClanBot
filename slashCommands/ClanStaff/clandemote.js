const { ApplicationCommandType, EmbedBuilder} = require('discord.js');
let LeaderRole = process.env.LEADER_ID
let GeneralRole = process.env.GENERAL_ID
let OfficerRole = process.env.OFFICER_ID
let VeteranRole = process.env.VETERAN_ID
let MemberRole = process.env.MEMBER_ID
let ClansStoragePath = "./Storage/Clans.json"
const fs = require("fs");

module.exports = {
    name: 'clandemote',
    description: "Demote Player in your clan",
    cooldown: 3000,
    options: [
        {
            name: 'member',
            description: "The Member you want to demote on your clan",
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
                .setDescription('> You can\'t demote yourself!')
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
                .setDescription(`> ${target.user.username} is not on your clan!`)
                .setTimestamp()
                .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
            try{
                interaction.reply({ embeds: [d] })
            }catch (err){
                console.log(err)
            }
            return;
        }

        target.member.roles.cache.some(role => {

            switch (role.id) {
                case MemberRole:
                    const e = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('FoxMC Clans')
                        .setThumbnail(target.member.displayAvatarURL())
                        .setDescription("> You can't demote a Member in your clan")
                        .setTimestamp()
                        .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
                    try{
                        interaction.reply({ embeds: [e] })
                    }catch (err){
                        console.log(err)
                    }
                    break;
                case VeteranRole:
                    target.member.roles.add(MemberRole).then(() => {
                        try{
                            target.member.roles.remove(role)
                        }catch (err){
                            console.log(err)
                        }
                        UpdateData(MemberRole)
                        const f = new EmbedBuilder()
                            .setColor('#00FF00')
                            .setTitle('FoxMC Clans')
                            .setThumbnail(target.member.displayAvatarURL())
                            .setDescription(`> ${target.user.username} has been successfully demoted to Clan Member`)
                            .setTimestamp()
                            .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
                        try{
                            interaction.reply({ embeds: [f] })
                            console.log(`${target.user.id} (${target.user.username}) has been successfully demoted to Clan Member`)
                        }catch (err){
                            console.log(err)
                        }
                    })
                    break;
                case OfficerRole:
                    target.member.roles.add(VeteranRole).then(() => {
                        try{
                            target.member.roles.remove(role)
                        }catch (err){
                            console.log(err)
                        }
                        UpdateData(VeteranRole)
                        const y = new EmbedBuilder()
                            .setColor('#00FF00')
                            .setTitle('FoxMC Clans')
                            .setThumbnail(target.member.displayAvatarURL())
                            .setDescription(`> ${target.user.username} has been successfully demoted to Clan Veteran`)
                            .setTimestamp()
                            .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
                        try{
                            interaction.reply({ embeds: [y] })
                            console.log(`${target.user.id} (${target.user.username}) has been successfully demoted to Clan Veteran`)
                        }catch (err){
                            console.log(err)
                        }
                    })
                    break;
                case GeneralRole:
                    target.member.roles.add(OfficerRole).then(() => {
                        try{
                            target.member.roles.remove(role)
                        }catch (err){
                            console.log(err)
                        }
                        UpdateData(OfficerRole)
                        const k = new EmbedBuilder()
                            .setColor('#00FF00')
                            .setTitle('FoxMC Clans')
                            .setThumbnail(target.member.displayAvatarURL())
                            .setDescription(`> ${target.user.username} has been successfully demoted to Clan Officer`)
                            .setTimestamp()
                            .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
                        try{
                            interaction.reply({ embeds: [k] })
                            console.log(`${target.user.id} (${target.user.username}) has been successfully demoted to Clan Officer`)
                        }catch (err){
                            console.log(err)
                        }
                    })
                    break;
            }


            function UpdateData(Role){
                fs.readFile(ClansStoragePath, 'utf8', function readFileCallback(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        let obj = JSON.parse(data); //now it an object
                        for(let i = 0; i < obj.length; i++){
                            if(obj[i].LeaderID === interaction.user.id){
                                for(let y = 0; y < obj[i].Members.length; y++){
                                    if(obj[i].Members[y].MemberID === target.user.id){
                                        obj[i].Members[y].ClanRole = Role
                                    }
                                }
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
            }
        })
    }
}