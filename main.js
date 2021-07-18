const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const config = require('./config.json')
const mongo = require('./mongo')

const prefix = config.prefix;

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', async () => {
    console.log('Bot is online!');

    await mongo().then(mongoose => {
        try {
            console.log('Connected to MongoDB!')
        } finally {
            mongoose.connection.close()
        }
    });
})

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    client.commands.get(command).execute(message, args, client).catch((err) => {
        console.error(err);
        message.reply('There was an error trying to execute that command, it may not exist. Type -help for a list of commands, and how to use them!');         
    });
});

//keep client login at end of file 

client.login(config.token);