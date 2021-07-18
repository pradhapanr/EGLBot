module.exports = {
    name: 'ping',
    description: 'Returns latency of the bot and the API.',
    async execute(message, args, client) {
        const msg = await message.channel.send('Pinging...');
        
        const latency = msg.createdTimestamp - message.createdTimestamp;

        msg.edit('Bot Latency: ' + latency + ' ms, API Latency: ' + Math.round(client.ws.ping) + ' ms')
    }
}