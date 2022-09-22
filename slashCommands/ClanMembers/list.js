const { ApplicationCommandType, EmbedBuilder} = require('discord.js');
let LeaderRole = process.env.LEADER_ID
let GeneralRole = process.env.GENERAL_ID
let OfficerRole = process.env.OFFICER_ID
let VeteranRole = process.env.VETERAN_ID
let MemberRole = process.env.MEMBER_ID

module.exports = {
    name: 'clanlist',
    description: "Show List of clan members",
    cooldown: 12000,
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        //check if user in clan

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

        let members = []
        try{
            await interaction.guild.members.fetch()
            await interaction.guild.roles.cache.get(UserClanRole.id).members.map(member => {
                let ClanRole = null;
                for(let i = 0; i < member._roles.length; i++){
                    if(member._roles[i] === LeaderRole) {
                        ClanRole = "Leader"
                        break;
                    } else if(member._roles[i] === GeneralRole) {
                        ClanRole = "General"
                        break;
                    } else if(member._roles[i] === OfficerRole) {
                        ClanRole = "Officer"
                        break;
                    } else if(member._roles[i] === VeteranRole) {
                        ClanRole = "Veteran"
                        break;
                    } else if(member._roles[i] === MemberRole) {
                        ClanRole = "Member"
                        break;
                    }
                }
                members.push(`${ClanRole}: ${member.user.username}`)
            })
        }catch (err){
            console.log(err)
        }

        try{
            await interaction.reply({ content: `\`\`\`${members.join("\n")}\n\`\`\`` })
        }catch (err){
            console.log(err)
        }
    }
};