const mongo = require('../mongo');
const playerSchema = require('../schemas/player-schema.js');
const Discord = require('discord.js');

module.exports = {
    name: 'display',
    description: 'Displays players in embed format, leaderboard style sorted by points.',
    async execute(message, args, client) {
        var role;
        var playerData;

        if (args.length === 0) { //display all players
            role = '';
            playerData = sortList(await getPlayerList(role));
            console.log(playerData);
        } else if (args.length === 1) { //display by role
            role = args[0];
            playerData = sortList(await getPlayerList(role));
            console.log(playerData);
            const embed = createEmbed(playerData, role);
            message.channel.send(embed);
        } else {
            throw ('Argument Error');
        }
    }
}

/*
GET PLAYER LIST FUNCTION

Params: role (string) - the role that you are searching for ('top', 'jungle', 'mid', 'adc', 'support')

Returns: list, holds object with player data in each index
*/

async function getPlayerList(role) {
    var playerData;
    await mongo().then(async (mongoose) => {
        try {
            if (role === '') {
                playerData = await playerSchema.find();
            } else {
                playerData = await playerSchema.find({
                    role: role
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            mongoose.connection.close();
        }
    });
    return playerData;
}

function sortList(list) {
    list.sort(function (a, b) {
        return b.points - a.points
    });
    return list;
}

function createEmbed(playerData, role) {
    if (role === 'top') {
        role = 'Top';
    } else if (role === 'jungle') {
        role = 'Jungle';
    } else if (role === 'mid') {
        role = 'Mid';
    } else if (role === 'adc') {
        role = 'ADC';
    } else if (role === 'support') {
        role = 'Support';
    } else if (role === ' All') {
        role = 'Server'; //every member of the server
    } else {
        throw ('Argument Error');
    }

    const embed = new Discord.MessageEmbed()
    .setColor(0xFFC300)
    .setTitle('EGL ' + role + ' Free Agents ' + '<:jungle:808248978265210902>');

    var description = "";

    for (i = 0; i < playerData.length; i++) {
        description += '**' + playerData[i].summonerName + '** ' + playerData[i].points + ' points\n';
        console.log(description);
    }

    embed.setDescription(description);
    return embed;
}