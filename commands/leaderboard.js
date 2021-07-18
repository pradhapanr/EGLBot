const mongo = require('../mongo');
const config = require('../config.json')
const leaderboardSchema = require('../schemas/leaderboard-schema');
const { default: axios } = require('axios');
const Discord = require('discord.js');

module.exports = {
    name: 'leaderboard',
    description: 'Leaderboard for League of Legends rankings for players on the server.',
    async execute(message, args, client) {
        if (args[0] === 'add') { //add a player to the leaderboard
            const summonerName = args.slice(1).join(' ');
            const [tier, division, leaguePoints] = await getDetails(summonerName);
            const pointValue = generatePointValue(tier, division, leaguePoints);
            await updateRank(summonerName, tier, division, leaguePoints, pointValue);
            message.channel.send(summonerName + " has been added to the leaderboard!");
        } else if (args[0] === 'remove') { //remove a player from the leaderboard
            const summonerName = args[1];
            removePlayer(summonerName);
            message.channel.send(summonerName + " has been removed from the leaderboard!");
        } else if (args[0] === 'update') { //update rank for each player on leaderboard
            const playerData = await getPlayerData(); //get all player data to update all current players
            for (i = 0; i < playerData.length; i++) {
                if (i % 9 === 0) {
                    await sleep(1000);
                }
                const [tier, division, leaguePoints] = await getDetails(playerData[i].summonerName);
                const pointValue = generatePointValue(tier, division, leaguePoints);
                await updateRank(playerData[i].summonerName, tier, division, leaguePoints, pointValue);
            }
            message.channel.send("Leaderboard has been updated!");
        } else if (args.length === 0) { //display leaderboard
            const playerData = await getPlayerData();
            const leaderboard = createLeaderboard(playerData);
            var description = '';

            const Embed = new Discord.MessageEmbed()
            .setColor(0xFFC300)
            .setTitle('Server League of Legends Leaderboard');

            for (i = 0; i < leaderboard.length; i++) {
                description = description + '**' + leaderboard[i].summonerName + '** ' +
                            leaderboard[i].tier + ' ' + leaderboard[i].division + ' ' + leaderboard[i].leaguePoints + ' LP\n';
            }

            Embed.setDescription(description)

            message.channel.send(Embed)

        } else {
            throw "Argument Error";
        }
    }
}

class Player {
    constructor(summonerName, tier, division, leaguePoints, pointValue) {
        this.summonerName = summonerName;
        this.tier = tier;
        this.division = division;
        this.leaguePoints = leaguePoints;
        this.pointValue = pointValue;
    }
}

async function getDetails(summonerName) {
    const idLink = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + config.riotKey;
    var summonerId = '';

    //try catch for getting summonerId

    try {
        const res = await axios.get(idLink);
        summonerId = res.data.id;
    } catch (error) {
        console.log("error", error);
    }

    const userDetailsLink = 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summonerId + '?api_key=' + config.riotKey;

    //try catch for getting persons rank 

    try {
        const res = await axios.get(userDetailsLink);
        if (res === null) {
            console.log("we null walahi");
        }
        return [res.data[0].tier, res.data[0].rank, res.data[0].leaguePoints];
    } catch (error) {
        console.log("error", error);
    }
}

function generatePointValue(tier, division, leaguePoints) {
    var tierValue;
    var divisionValue;
    var leaguePointsValue = leaguePoints;

    //setting tier value

    if (tier === 'IRON') {
        tierValue = 0;
    } else if (tier === 'BRONZE') {
        tierValue = 4;
    } else if (tier === 'SILVER') {
        tierValue = 8;
    } else if (tier === 'GOLD') {
        tierValue = 12;
    } else if (tier === 'PLATINUM') {
        tierValue = 16;
    } else if (tier === 'DIAMOND') {
        tierValue = 20;
    } else if (tier === 'MASTER' || tier === 'GRANDMASTER' || tier === 'CHALLENGER') {
        tierValue = 21;
    }

    //setting division value

    if (division == 'I') {
        divisionValue = 4;
    } else if (division == 'II') {
        divisionValue = 3;
    } else if (division == 'III') {
        divisionValue = 2;
    } else if (division == 'IV') {
        divisionValue = 1;
    }

    //setting leaguePointsValue

    leaguePointsValue = parseFloat((leaguePointsValue / 1000).toFixed(3));
    
    pointValue = tierValue + divisionValue + leaguePointsValue;

    return pointValue;
    
}

async function updateRank(summonerName, tier, division, leaguePoints, pointValue) {
    await mongo().then(async (mongoose) => {
        try {
            await leaderboardSchema.insertMany({
                summonerName: summonerName,
                tier: tier,
                division: division,
                leaguePoints: leaguePoints,
                pointValue: pointValue
            }, 
            {
                upsert: true
            });
        } finally {
            mongoose.connection.close();
        }
    });
}

async function getPlayerData() {
    var playerData;
    await mongo().then(async (mongoose) => {
        try {
            playerData = await leaderboardSchema.find();
        } finally {
            mongoose.connection.close();
        }
    });
    return playerData;
}

async function removePlayer(summonerName) {
    await mongo().then(async (mongoose) => {
        try {
            await leaderboardSchema.remove({
                summonerName: summonerName
            });
        } finally {
            mongoose.connection.close();
        }
    });
}

function createLeaderboard(playerData) {
    var leaderboard = [];

    for (i = 0; i < playerData.length; i++) {
        leaderboard.push(new Player(playerData[i].summonerName, playerData[i].tier, playerData[i].division, playerData[i].leaguePoints, playerData[i].pointValue));
    }

    leaderboard.sort(function (a, b) {
        return b.pointValue - a.pointValue
    });

    return leaderboard;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}