const config = require('../config.js');

module.exports = {
    name: "leavevc",
    description: "Leaves a VC",
    usage: `${config.prefix}leaveVC`,

    execute(msg, args, noreply) {
        // Check if the bot is any VC
        if (!config.currentVCs[msg.client.user.id]) {
            return msg.reply('I am not in any voice channel!');
        };

        // Leave the VC
        const connection = config.currentVCs[msg.client.user.id];
        try {
            connection.destroy();
            delete config.currentVCs[msg.client.user.id];
            if (!noreply) {
                msg.reply('Left the voice channel!');
            };
        } catch(err) {
            if (!noreply) {
                msg.reply(`Failed to leave the voice channel!\n${err}`);
            };
        };
    }
};