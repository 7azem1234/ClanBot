const {ApplicationCommandType, EmbedBuilder} = require("discord.js");
const fs = require("fs");
let LeaderRole = process.env.LEADER_ID
let GeneralRole = process.env.GENERAL_ID
let OfficerRole = process.env.OFFICER_ID
let VeteranRole = process.env.VETERAN_ID
let MemberRole = process.env.MEMBER_ID
let ClansStoragePath = "./Storage/Clans.json"

module.exports = {
    name: 'clantransfer',
    description: "Transfer Clan Leader to a player",
    cooldown: 300000,
    options: [
        {
            name: 'member',
            description: "The Member you want to transfer clan leader to him",
            type: 6,
            required: true
        }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {

        let target = interaction.options.get('member')
        let UserClanRole = null;
        let TargetClanRole = null;

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
                .setDescription('> You already the leader of the clan!')
                .setTimestamp()
                .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
            try{
                interaction.reply({ embeds: [c] })
            }catch (err){
                console.log(err)
            }
            return;
        }

        if (target.user.bot) {//check if target is bot
            interaction.reply({ content: "You can't add Bot to your clan!" })
            const d = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('FoxMC Clans')
                .setDescription('> You can\'t transfer the clan leader to a Bot!')
                .setTimestamp()
                .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
            try{
                interaction.reply({ embeds: [d] })
            }catch (err){
                console.log(err)
            }
            return
        }


        target.member.roles.cache.some(role => {
            if (role.id === GeneralRole || role.id === OfficerRole || role.id === VeteranRole || role.id === MemberRole) {
                TargetClanRole = role.id
            }
        })

        let TargetClan = target.member.roles.cache.some(role => role.id === UserClanRole.id)
        if (!TargetClan) {//check if target in clan
            const y = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('FoxMC Clans')
                .setDescription(`> <@${target.user.id}> must be on your clan to transfer Clan Leader to him!`)
                .setTimestamp()
                .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
            try{
                interaction.reply({ embeds: [y] })
            }catch (err){
                console.log(err)
            }
            return;
        }

        try{
            target.member.roles.add(LeaderRole)
            target.member.roles.remove(TargetClanRole)

            interaction.member.roles.add(MemberRole)
            interaction.member.roles.remove(LeaderRole)
        }catch (err){
            console.log(err)
        }

        fs.readFile(ClansStoragePath, 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                let obj = JSON.parse(data); //now it an object
                let ClanName;
                for(let i = 0; i < obj.length; i++){
                    if(obj[i].LeaderID === interaction.user.id){
                        ClanName = obj[i].ClanName
                        for(let y = 0; y < obj[i].Members.length; y++){
                            if(obj[i].Members[y].MemberID === target.user.id){
                                obj[i].Members[y].ClanRole = LeaderRole
                            }
                            if(obj[i].Members[y].MemberID === interaction.user.id){
                                obj[i].Members[y].ClanRole = MemberRole
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

                const e = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('FoxMC Clans')
                    .setThumbnail(target.member.displayAvatarURL())
                    .setDescription(`> ${ClanName} Clan Leader has been transferred to <@${target.user.id}>`)
                    .setTimestamp()
                    .setFooter({ text: 'FoxMCClans', iconURL: client.user.displayAvatarURL() });
                try{
                    interaction.reply({ embeds: [e] })
                    console.log(`${ClanName} Clan Leader has been transferred to ${target.user.id} (${target.user.username})`)
                }catch (err){
                    console.log(err)
                }
            }
        });
    }
}