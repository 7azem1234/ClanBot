const client = require('..');
const fs = require("fs");
const ClansStoragePath = "./Storage/Clans.json"

client.on('messageCreate', async message => {
    if(global.TextChannels.includes(message.channelId) && !message.author.bot){
        fs.readFile(ClansStoragePath, 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                let obj = JSON.parse(data); //now it an object
                for(let i = 0; i < obj.length; i++){
                    for(let y = 0; y < obj[i].Members.length; y++){
                        if(obj[i].Members[y].MemberID === message.author.id){
                            obj[i].MsgsCounter++
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
