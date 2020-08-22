module.exports = async (client, message) => {
    try {
        const Discord = require("discord.js");

        const log = message.guild.channels.cache.find(channel => channel.name === "log");
        if (!log) return;

        // Import totals
        let globalVars = require('./ready');

        if (!message.content) {
            message.content = "None";
        };

        const deleteEmbed = new Discord.MessageEmbed()
            .setColor("#219DCD")
            .setAuthor(`Message deleted ❌`, message.author.avatarURL())
            .setDescription(`Message sent by ${message.author} deleted from ${message.channel}.`)
            .addField(`Content:`, message.content, false)
            .setFooter(`Deleted at`)
            .setTimestamp();

        globalVars.totalLogs += 1;
        return log.send(deleteEmbed);

    } catch (e) {
        // log error
        console.log(e);
    };
};