const config = require('../config.js');

const voice = require('@discordjs/voice');
const path = require('path');
const fs = require('fs');


module.exports = {
    name: "play",
    description: "Plays an audio file",
    usage: `${config.prefix}play <filename>`,

    async execute(msg, args) {
        // Possible commands are
        // ;play <filename> <channel>
        // ;play <filename>

        const filename = args[0];
        const channelID = args[1];
        let alreayInVC = false;

        // Check if there's no arguments
        if (args.length === 0) {
            return msg.reply("Please specify a file to play");
        };

        // Check if the file exists
        if (!fs.existsSync(path.join(__dirname, `../assets/audios/${filename}`))) {
            // Reply all the files in the folder
            const files = fs.readdirSync(path.join(__dirname, `../assets/audios/`));
            msg.reply(`The file ${filename} does not exist\nAvailable files:\n\`\`\`md\n- ${files.join('\n- ')}\`\`\``);
            return;
        };

        // Check if the bot is already playing

        // Check if the bot is already in a VC
        if (config.currentVCs[msg.client.user.id] && !channelID) {
            alreayInVC = true;
            // Check if the user is in the same VC
            if (config.currentVCs[msg.client.user.id].joinConfig.channelId !== msg.member.voice.channel.id) {
                return msg.reply("I am already in a different voice channel!");
            };
        };

        // Check if there's a channel specified
        if (channelID) {
            // Check if the channel exists
            if (!msg.guild.channels.cache.find(c => c.id === channelID)) {
                return msg.reply(`The channel ${channelID} does not exist`);
            };

            // Check if the channel is a voice channel
            if (!msg.guild.channels.cache.find(c => c.id === channelID).type === "GUILD_VOICE") {
                return msg.reply(`The channel ${channelID} is not a voice channel`);
            };

            //  Check if it's possible to join the channel
            if (!msg.guild.channels.cache.find(c => c.id === channelID).joinable) {
                return msg.reply(`I do not have permission to join ${channelID}`);
            };

            // Join the channel
            require('./joinvc.js').execute(msg, [channelID], true);
        } else {
            // Check if the user is in a voice channel
            if (!msg.member.voice.channel) {
                return msg.reply("You are not in a voice channel!");
            };

            // Join the user's voice channel
            require('./joinvc.js').execute(msg, [msg.member.voice.channel.id], true);
        };

        const connection = config.currentVCs[msg.client.user.id];
        const player = voice.createAudioPlayer();

        player.on(voice.AudioPlayerStatus.Playing, () => {
            // console.log('Playing!');
        });

        player.on('error', (err) => {
            console.log(err);
        });

        const resource = voice.createAudioResource(path.join(__dirname, `../assets/audios/${filename}`));

        player.play(resource);

        connection.subscribe(player);

        player.on(voice.AudioPlayerStatus.Idle, (track) => {
            if (!alreayInVC) {
                // Leave the VC
                require('./leavevc.js').execute(msg, [], true);
            };
        });

        msg.reply(`Playing ${filename}!`);
    }
};