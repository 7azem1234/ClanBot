const {
    ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ApplicationCommandType
} = require("discord.js");
const {v4: uuid} = require("uuid");
const fs = require("fs");
const {ClanInformationModel} = require("../../Models/ClanInformation");
const {ClanMember} = require("../../Models/ClanMember");
const {Clan} = require("../../Models/Clan");
const ClansStoragePath = "./Storage/Clans.json"
const ChannelsStoragePath = "./Storage/ClanTextChannels.json"
let Admins = process.env.ADMIN_ID
let LeaderRole = process.env.LEADER_ID

module.exports = {
    name: 'clancreate',
    description: "Create Clan",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {

        //Permissions
        let i = interaction.member.roles.cache.some(role => {
            if (role.id === Admins) {
                return true;
            }
        })
        if (!i) {
            interaction.reply({content: "Only Admins can run this command!"})
            return
        }

        let TaskID = uuid()

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`CreateClanButton-${TaskID}`)
                    .setLabel('Create')
                    .setStyle(ButtonStyle.Success)
            );

        const file = await new AttachmentBuilder('./Image.png');
        const Embed = new EmbedBuilder()
            .setColor('#42b9f5')
            .setTitle('FoxMC Clan')
            .setDescription('> لإنشاء كلان يرجى إدخال المعلومات المحددة بجدية. لديك 15 دقيقة فقط لإكمال انشاء الكلان!' + "\n \n > To create a clan please enter the specified information seriously.\n > You have only 15min to complete this task!")
            .setImage("attachment://Image.png")
            .setTimestamp()
            .setFooter({text: 'FoxMCClans', iconURL: client.user.displayAvatarURL()});

        try {
            await interaction.reply({embeds: [Embed], files: [file], components: [row]})
        } catch (err) {
            console.log(err)
        }

        const collector = interaction.channel.createMessageComponentCollector({time: 900000});

        collector.on('collect', async i => {
            if (i.customId === `CreateClanButton-${TaskID}`) {

                await i.showModal(ModalBuilderFun(TaskID))
                await i.awaitModalSubmit({time: 900000})
                    .then(async interaction => {

                        let Name = interaction.fields.getTextInputValue("Name")
                        let Age = interaction.fields.getTextInputValue("Age")
                        let MinecraftUserName = interaction.fields.getTextInputValue("MinecraftUsername")
                        let ClanName = interaction.fields.getTextInputValue("ClanName")
                        let MembersNumber = interaction.fields.getTextInputValue("MembersNumber")

                        if (isNaN(Age)) {
                            interaction.reply({content: "Please enter a valid age!"})
                            return;
                        }

                        let role = interaction.guild.roles.cache.find(x => x.name === `Clan - ${ClanName}`);
                        if (role !== undefined) {
                            interaction.reply({content: "Clan is already exist"})
                            return;
                        }

                        if (onlySpaces(Name) || onlySpaces(Age) || onlySpaces(MinecraftUserName) || onlySpaces(ClanName) || onlySpaces(MembersNumber)) {
                            interaction.reply({content: "Please enter a valid answer(s)!"})
                            return;
                        }

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`NextStep-${TaskID}`)
                                    .setLabel('Next')
                                    .setStyle(ButtonStyle.Success)
                                    .setEmoji("✅")
                                    .setDisabled(false),

                                new ButtonBuilder()
                                    .setCustomId(`CreateClanButton-${TaskID}`)
                                    .setLabel('Edit')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji("📄"),

                                new ButtonBuilder()
                                    .setCustomId(`CancelCreateInformation-${TaskID}`)
                                    .setLabel('Cancel')
                                    .setStyle(ButtonStyle.Danger)
                            )

                        const file = await new AttachmentBuilder('./Image.png');
                        const step2Embed = new EmbedBuilder()
                            .setColor('#42b9f5')
                            .setTitle('FoxMC Clan')
                            .setDescription(`\`\`\`Name: ${Name}\nAge: ${Age}\nMinecraft Username: ${MinecraftUserName}\nClanName: ${ClanName}\nMembersNumber: ${MembersNumber}\`\`\``)
                            .setImage("attachment://Image.png")
                            .setTimestamp()
                            .setFooter({text: 'FoxMCClans', iconURL: client.user.displayAvatarURL()});


                        await interaction.message.delete()
                        await interaction.reply({embeds: [step2Embed], components: [row], files: [file]})

                        let newOne = []
                        for (let k = 0; k < global.Infos.length; k++) {
                            if (global.Infos[k].UserID !== i.user.id) {
                                newOne.push(global.Infos[k])
                            }
                        }

                        newOne.push(new ClanInformationModel(i.user.id, Name, Age, MinecraftUserName, ClanName, MembersNumber))
                        global.Infos = newOne
                    }).catch(err => console.log(err))
            } else if (i.customId === `NextStep-${TaskID}`) {

                collector.stop()
                let InfoFound = null;

                for (let y = 0; y < global.Infos.length; y++) {
                    if (global.Infos[y].UserID === i.user.id) {
                        InfoFound = global.Infos[y]
                    }
                }

                if (InfoFound === null) {
                    await i.reply({content: "Please try again or open a ticket!"})
                    return
                }

                const file = await new AttachmentBuilder('./Image.png');
                const Embed = new EmbedBuilder()
                    .setColor("#00dddd")
                    .setDescription(`<@&${Admins}>\`\`\`Clan Information:\nRequestedBy: ${interaction.user.tag}\nName: ${InfoFound.Name}\nAge: ${InfoFound.Age}\nMinecraft Username: ${InfoFound.MinecraftUsername}\nClanName: ${InfoFound.ClanName}\nMembersNumber: ${InfoFound.MembersNumber}\`\`\`\nPlease wait until an Admin review your clan request`)
                    .setImage("attachment://Image.png")
                    .setTimestamp()
                    .setFooter({text: 'FoxMCClans', iconURL: client.user.displayAvatarURL()});

                const apply = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`AcceptClan-${TaskID}`)
                            .setLabel('Accept')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`RejectClan-${TaskID}`)
                            .setLabel('Reject')
                            .setStyle(ButtonStyle.Danger)
                    );

                try {
                    await i.message.delete()
                    await i.reply({embeds: [Embed], components: [apply], files: [file]})
                } catch (err) {
                    console.log(err)
                }

                const ApplyCollector = interaction.channel.createMessageComponentCollector({
                    time: 900000
                });

                ApplyCollector.on('collect', async i => {

                    let check = i.member.roles.cache.some(role => {
                        if (role.id === Admins) {
                            return true
                        }
                    })

                    if (!check) {
                        await i.reply({content: "Only Admins can run this command!"})
                        return
                    }

                    switch (i.customId) {
                        case `AcceptClan-${TaskID}`:

                            ApplyCollector.stop()

                            try {
                                await i.message.delete()
                            } catch (err) {
                                console.log(err)
                            }

                            interaction.guild.roles.create({//create ClanRole
                                name: `Clan - ${InfoFound.ClanName}`,
                                color: '#000000',
                                reason: 'Clan Role',
                            })
                                .then(async role => {
                                    let member = interaction.guild.members.cache.get(interaction.user.id)
                                    await member.roles.add(role)
                                    await member.roles.add(LeaderRole)
                                    await interaction.guild.channels.create({//create Category
                                        name: InfoFound.ClanName,
                                        type: 4,
                                        permissionOverwrites: [
                                            {
                                                id: interaction.guild.id,
                                                deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.Connect]
                                            },
                                            {
                                                id: LeaderRole,
                                                allow: [PermissionsBitField.Flags.ManageMessages]
                                            },
                                            {
                                                id: role.id,
                                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                                            },
                                        ]
                                    }).then(async category => {//create channels
                                        await interaction.guild.channels.create({
                                            name: `🔔${InfoFound.ClanName} - Announcements`,
                                            type: 0,
                                            parent: category.id,
                                            permissionOverwrites: [
                                                {
                                                    id: interaction.guild.id,
                                                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                                                },
                                                {
                                                    id: LeaderRole,
                                                    allow: [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.SendMessages]
                                                },
                                                {
                                                    id: role.id,
                                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                                                    deny: [PermissionsBitField.Flags.SendMessages]
                                                },
                                            ]
                                        })
                                        await interaction.guild.channels.create({
                                            name: "💬 Chat",
                                            type: 0,
                                            parent: category.id
                                        }).then(channel => {
                                            channel.lockPermissions()

                                            fs.readFile(ChannelsStoragePath, 'utf8', function readFileCallback(err, data) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    let obj = JSON.parse(data); //now it an object
                                                    obj.push(channel.id) //add some data
                                                    global.TextChannels.push(channel.id)
                                                    let json = JSON.stringify(obj, null, 2); //convert it back to json
                                                    fs.writeFile(ChannelsStoragePath, json, 'utf8', function writeFileCallback(err) {// write it back
                                                        if (err) {
                                                            console.log(err)
                                                        }
                                                    });
                                                }
                                            });


                                        }).catch(error => console.log(error))
                                        interaction.guild.channels.create({
                                            name: "🔊 Voice",
                                            type: 2,
                                            parent: category.id
                                        }).then(channel => {
                                            channel.lockPermissions()
                                        }).catch(error => console.log(error))

                                        interaction.followUp({content: "\`\`\`The Clan has been created successfully\`\`\`"})
                                        console.log(`${InfoFound.ClanName} Clan has been created`)
                                    }).catch(error => console.log(error))
                                }).catch(error => console.log(error))

                            //Create Member Object
                            let Leader = client.users.cache.find(user => user.id === interaction.user.id)
                            let MemberObject = new ClanMember(interaction.user.id, Leader.username, LeaderRole, new Date())

                            //Create Clan Object
                            let ClanOb = new Clan(TaskID, InfoFound.ClanName, interaction.user.id, [MemberObject], 0, new Date())


                            //ReadAndUpdateJsonFile
                            fs.readFile(ClansStoragePath, 'utf8', function readFileCallback(err, data) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    let obj = JSON.parse(data); //now it an object
                                    obj.push(ClanOb) //add some data
                                    let json = JSON.stringify(obj, null, 2); //convert it back to json
                                    fs.writeFile(ClansStoragePath, json, 'utf8', function writeFileCallback(err) {// write it back
                                        if (err) {
                                            console.log(err)
                                        }
                                    });
                                }
                            });

                            break;
                        case `RejectClan-${TaskID}`:
                            ApplyCollector.stop()

                            const Rejectmodal = new ModalBuilder()
                                .setCustomId(`RejectClanRequest-${TaskID}`)
                                .setTitle('Reject Clan Request');

                            const Reason = new TextInputBuilder()
                                .setCustomId('RejectReason')
                                .setLabel("Reason")
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(false);

                            const firstActionRow = new ActionRowBuilder().addComponents(Reason);

                            Rejectmodal.addComponents(firstActionRow);

                            i.showModal(Rejectmodal);

                            await i.awaitModalSubmit({time: 900000})
                                .then(async interaction => {
                                    let reason = interaction.fields.getTextInputValue("RejectReason")
                                    if (reason === "") {
                                        reason = "No Reason"
                                    }

                                    interaction.message.delete()
                                    interaction.reply({content: `\`\`\`Clan Request Has been rejected!\nReason: ${reason}\`\`\``})
                                }).catch(err => console.log(err))
                            break;
                    }
                })

                ApplyCollector.on('end', () => {
                    return false
                });


            } else if (i.customId === `CancelCreateInformation-${TaskID}`) {

                collector.stop()

                if (i.message !== null) {
                    try {
                        await i.message.delete()
                    } catch (err) {
                        console.log(err)
                    }
                }

                try {
                    await i.reply({content: "Creating Clan Task has been canceled"})
                } catch (err) {
                    console.log(err)
                }

                let newOne = []
                for (let k = 0; k < global.Infos.length; k++) {
                    if (global.Infos[k].UserID !== i.user.id) {
                        newOne.push(global.Infos[k])
                    }
                }
                global.Infos = newOne
            }
        })

        collector.on('end', () => {
            return false
        });


        function ModalBuilderFun(TaskID) {
            const modal = new ModalBuilder()
                .setCustomId(`ClanInformationModel-${TaskID}`)
                .setTitle('Clan Information');

            const LeaderName = new TextInputBuilder()
                .setCustomId('Name')
                .setLabel("What's your name?")
                .setMaxLength(30)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const LeaderAge = new TextInputBuilder()
                .setCustomId('Age')
                .setLabel("How old are you?")
                .setMaxLength(2)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const MinecraftUsername = new TextInputBuilder()
                .setCustomId('MinecraftUsername')
                .setLabel("What's your Minecraft Username?")
                .setMaxLength(20)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const ClanName = new TextInputBuilder()
                .setCustomId('ClanName')
                .setLabel("What's your clan name?")
                .setMaxLength(20)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const NumberOfMembers = new TextInputBuilder()
                .setCustomId('MembersNumber')
                .setLabel("How many members will join the clan?")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);


            const firstActionRow = new ActionRowBuilder().addComponents(LeaderName);
            const secondActionRow = new ActionRowBuilder().addComponents(LeaderAge);
            const thirdActionRow = new ActionRowBuilder().addComponents(MinecraftUsername);
            const forthActionRow = new ActionRowBuilder().addComponents(ClanName);
            const fifthActionRow = new ActionRowBuilder().addComponents(NumberOfMembers);

            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, forthActionRow, fifthActionRow);

            return modal;
        }

        function onlySpaces(str) {
            return /^\s*$/.test(str);
        }
    }
};

