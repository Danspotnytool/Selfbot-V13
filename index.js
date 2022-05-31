
const config = require('./config.js');

const Discord = require('discord.js-selfbot-v13');
const client = new Discord.Client();


// Load the commands
const fs = require('fs');
const commands = {};
fs.readdir('./commands/', (err, files) => {
    if (err) { console.error(err) };
    // Ignore files that is not js
    const jsFiles = files.filter(file => file.split('.').pop() === 'js');
    if (jsFiles.length <= 0) { return console.log('No commands to load!') };
    // Load the commands
    jsFiles.forEach((file) => {
        const command = require(`./commands/${file}`);
        commands[command.name] = command;
    });
});


client.on('ready', async () => {
    console.log(`${client.user.username} is ready!`);
    // Set activity
    // client.user.setPresence({
    //     activities: [{
    //         name: 'My master',
    //         type: 2,
    //         details: 'Slave of the Master',
    //         state: 'Currently under development'
    //     }]
    // });
});

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) { return };
    if (!msg.content.startsWith(config.prefix)) { return };
    if (msg.author.id != config.owner) { return };

    const args = msg.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!commands[commandName]) { return };

    try {
        commands[commandName].execute(msg, args);
    } catch (err) {
        msg.reply(`Error!\n${err}`);
    };
});


client.login(`${config.token}`);