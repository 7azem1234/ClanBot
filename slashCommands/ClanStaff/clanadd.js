const { ApplicationCommandType, EmbedBuilder} = require('discord.js');
const fs = require("fs");
let LeaderRole = process.env.LEADER_ID
let MemberRole = process.env.MEMBER_ID
let ClansStoragePath = "./Storage/Clans.json"
let { ClanMember } = require("../../models/ClanMember")

module.exports = {
    name: 'clanadd',
    description: "Add Member to the Clan",
    options: [
        {
            name: 'member',
            description: "The Member you want to add to the clan",
            type: 6,
            required: true
        }
    ],
    cooldown: 6000,
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


        if (target.user.bot) {//check if target is bot
            const c = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('FoxMC Clans')
                .setDescription('> You can\'t add a Bot to your clan!')
                .setTimestamp()
                .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
            try{
                interaction.reply({ embeds: [c] })
            }catch (err){
                console.log(err)
            }
            return
        }


        let CheckTargetClanRole = target.member.roles.cache.some(role => {
            if (role.name.includes("Clan -")) {
                return true;
            }
        })

        if (target.user.id === interaction.member.user.id) {//check if target == user
            const d = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('FoxMC Clans')
                .setDescription('> You can\'t add yourself to the clan!')
                .setTimestamp()
                .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
            try{
                interaction.reply({ embeds: [d] })
            }catch (err){
                console.log(err)
            }
            return;
        }

        if (CheckTargetClanRole) {//check if target in clan
            const e = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('FoxMC Clans')
                .setDescription(`> ${target.user.username} is already on a clan`)
                .setTimestamp()
                .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
            try{
                interaction.reply({ embeds: [e] })
            }catch (err){
                console.log(err)
            }
            return;
        }

        try{
            target.member.roles.add(UserClanRole)
            target.member.roles.add(MemberRole)
        }catch (err){
            console.log(err)
        }

        //Member Object
        let MemberObject = new ClanMember(target.user.id, target.user.username, MemberRole, 0, Date())

        fs.readFile(ClansStoragePath, 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                let obj = JSON.parse(data); //now it an object
                for (let i = 0; i < obj.length; i++) {
                        if (obj[i].LeaderID === interaction.user.id) {
                            obj[i].Members = [...(obj[i].Members), MemberObject]//add some data
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

        const f = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('FoxMC Clans')
            .setDescription(`> ${target.user.username} has been added to the clan!`)
            .setThumbnail(target.member.displayAvatarURL())
            .setTimestamp()
            .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
        try{
            interaction.reply({ embeds: [f] })
            console.log(`${target.user.id} (${target.user.username}) has been added to a clan!`)
        }catch (err){
            console.log(err)
        }


    }
};