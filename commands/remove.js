const mongo = require('../mongo');
const playerSchema = require('../schemas/player-schema.js');

module.exports = {
    name: 'remove',
    description: 'Removes player from free agent list.',
    async execute(message, args, client) {
        var summonerName = "";
        var nameDetected = false;
        for (var i = 0; i < args.length; i++) {
            var word = args[i];
            if (word.charAt(word.length - 1) === '"') {
                summonerName += word;
                summonerName = summonerName.replaceAll('"', '');
                nameDetected = true;
                break;
            } else {
                summonerName += word + " ";
            }
        }

        if (nameDetected === true) {
            await removePlayer(args, message);
        } else {
            message.channel.send('Inappropriate usage of remove command, please use the format - remove \"<summonerName>\" (name in quotes!)');
        }
        // if (args.length === 1) {
        //     await removePlayer(args, message);
        // } else {
        //     message.channel.send('Inappropriate usage of remove command, please use the format: -remove <summonerName>');
        // }
    }
}

/*
REMOVE PLAYER FUNCTION

Command Format: -remove (summonerName)

Improvements
-------------------------------------------------------------------------------------------------
- check if user exists before trying to remove, give appropriate messsage as well
*/

async function removePlayer(args, message) {
    const summonerName = args[0];
    await mongo().then(async (mongoose) => {
        try {
            await playerSchema.deleteOne({
                summonerName: summonerName
            });
            const msg = `${summonerName} has been removed from the free agents list.`;
            message.channel.send(msg);
        } catch (err) {
            console.log(err);
            message.channel.send("Something went wrong during the execution of the command. Try again in a few seconds.");
        } finally {
            mongoose.connection.close();
        }
    });
}
