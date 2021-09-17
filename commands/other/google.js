exports.run = async (client, message, args = []) => {
    const logger = require('../../util/logger');
    // Import globals
    let globalVars = require('../../events/ready');
    try {
        const sendMessage = require('../../util/sendMessage');
        const Discord = require("discord.js");

        let replyMessage;
        let input;
        let questionAskUser;

        // Reply
        if (message.reference) {
            if (message.reference) replyMessage = await message.channel.messages.fetch(message.reference.messageId);
            input = replyMessage.content;
            questionAskUser = replyMessage.author;

            // Text in command
        } else {
            if (message.type == "APPLICATION_COMMAND") {
                message = await message.channel.messages.fetch(args[0]);
                input = message.content;
                questionAskUser = `**${message.member.user.tag}**`;
            } else {
                questionAskUser = `**${message.author.tag}**`;
                input = args.join(" ");
            };
        };

        if (input.length < 1) return sendMessage(client, message, `Make sure you provided input either by typing it out as an argument or replying to a message that has text in it.`);

        let question = input.replaceAll("+", "%2B").replaceAll(" ", "+");
        let googleLink = `https://www.google.com/search?q=${question}`;

        // Button
        let googleButton = new Discord.MessageActionRow()
            .addComponents(new Discord.MessageButton({ label: 'Google', style: 'LINK', url: googleLink }));

        let returnString = `Here's the answer to your question, ${questionAskUser}:`;

        return sendMessage(client, message, returnString, null, null, false, googleButton, true);

    } catch (e) {
        // Log error
        logger(e, client, message);
    };
};

module.exports.config = {
    name: "google",
    aliases: ["lmgtfy"],
    type: "MESSAGE"
};