const config = require('../config.js');

module.exports = {
    name: "ping",
    description: "Ping the bot",
    usage: `${config.prefix}ping`,

    execute(msg, args) {
        const connection = msg.client.ws.ping;
        msg.reply(`Pong! ${connection}ms`);
    }
};