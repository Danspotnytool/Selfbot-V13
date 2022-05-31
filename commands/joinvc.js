const config = require('../config.js');

const voice = require('@discordjs/voice');
const path = require('path');



module.exports = {
    name: "joinvc",
    description: "Joins a VC",
    usage: `${config.prefix}joinVC <channelID>`,

    async execute(msg, args, noreply) {
        let channelID = args[0];
        if (!channelID) {
            // Find the user's voice channel
            const userVoiceChannel = msg.member.voice.channel;
            if (!userVoiceChannel) {
                return msg.reply('You are not in a voice channel!');
            };
            channelID = userVoiceChannel.id;
        };

        // Join the voice channel
        const voiceChannel = msg.client.channels.cache.get(channelID);
        if (!voiceChannel) {
            msg.reply(`${channelID} is not a valid voice channel ID!`);
            return;
        };
        if (voiceChannel.type != 'GUILD_VOICE') {
            msg.reply(`${channelID} is not a voice channel!`);
            return;
        };
        if (!voiceChannel.joinable) {
            msg.reply(`I do not have permission to join ${channelID}!`);
            return;
        };

        try {
            const connection = voice.joinVoiceChannel({
                channelId: channelID,
                guildId: voiceChannel.guild.id,
                adapterCreator: msg.guild.voiceAdapterCreator,
                selfDeaf: true,
                selfMute: true
            });

            // Set current VC
            config.currentVCs[msg.client.user.id] = connection;
            if (!noreply) {
                msg.reply(`Joined ${voiceChannel.name}!`).then((message) => {
                    setTimeout(() => {
                        message.delete();
                    }, 3000);
                });
                console.log(`Joined ${voiceChannel.name}!`);
            };
        } catch(err) {
            if (!noreply) {
                msg.reply(`Failed to join ${voiceChannel.name}!\n${err}`).then((message) => {
                    setTimeout(() => {
                        message.delete();
                    }, 3000);
                });
                console.log(err);
            };
        };
    }
};