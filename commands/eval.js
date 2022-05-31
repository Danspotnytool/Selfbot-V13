const config = require('../config.js');

module.exports = {
    name: "eval",
    description: "executes code",
    usage: `${config.prefix}eval <code>`,

    execute(msg, args) {
        // Get the content to be evaluated
        let content = msg.content.split(' ');
        content.shift();
        content = content.join(' ');

        // Try to evaluate the code
        try {
            eval(`${content}`);
        } catch(err) {
            msg.reply(`Something went wrong!\n\`\`\`xl
${err}\n\`\`\``);
        };
    }
};