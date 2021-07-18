const mongo = require('../mongo');
const playerSchema = require('../schemas/player-schema.js');

module.exports = {
    name: 'add',
    description: 'Adds player to free agent list.',
    async execute(message, args, client) {
        var summonerName = "";
        var role;
        var points;
        var nameDetected = false;
        for (var i = 0; i < args.length; i++) {
            var word = args[i];
            if (word.charAt(word.length - 1) === '"') {
                summonerName += word;
                summonerName = summonerName.replaceAll('"', '');
                var role = args[i + 1];
                var points = args [i + 2];
                nameDetected = true;
                break;
            } else {
                summonerName += word + " ";
            }
        }
        
        if (nameDetected === true && role != null && points != null) {
            await addPlayer(summonerName, role, points, message);
        } else {
            message.channel.send('Inappropriate usage of add command, please use the format: -add \"<summonerName>\" <role> <points> (name in quotes!)');
        }

        // if (args.length === 3) {
        //     await addPlayer(args, message);
        // } else {
        //     message.channel.send('Inappropriate usage of add command, please use the format: -add <summonerName> <role> <points>');
        // }
    }
}

/*
ADD PLAYER FUNCTION

Command Format: -add "(summonerName)" (role) (points)

Improvements
-------------------------------------------------------------------------------------------------
- add duplicate document check, message user if they are entering already inputted user
*/

async function addPlayer(summonerName, role, points, message) {
    await mongo().then(async (mongoose) => {
        try {
            await playerSchema.updateOne({
                summonerName: summonerName
            },
            { $set: 
                {
                    summonerName: summonerName,
                    role: role,
                    points: points
                }
            }, 
            {
                upsert: true
            }).exec();
            const msg = `${summonerName} has been added to the free agents list.`;
            message.channel.send(msg); 
        } catch (err) {
            console.log(err);
        } finally {
            mongoose.connection.close();
        }
    });
}
