const config = require('../config.js');

const axios = require('axios');

module.exports = {
    name: "joinserver",
    description: "Join a server",
    usage: `${config.prefix}joinServer <invite>`,

    async execute(msg, args) {
        if (args.length < 1) {
            msg.channel.createMessage('You need to provide an invite code!');
            return;
        };

        // Get the invite code
        const inviteCode = args[0];
        
        // Join the server
        await msg.client.fetchInvite(inviteCode).then(async (invite) => {
            await invite.acceptInvite().then(async (guild) => {
                // Send a message to the channel
                msg.reply(`Joined ${guild.name}!`);
            });
        }).catch(async (err) => {
            // Send a message to the channel
            msg.reply(`Failed to join the server!\n${err}`);
        });
    }
};