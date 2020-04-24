module.exports = async (client, message, oldMessage, newMessage) => {
    try {
        console.log("0")
        const Discord = require("discord.js");
        const entry = await message.member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_UPDATE',
        });
        const log = message.guild.channels.cache.find(channel => channel.name === "log");

        console.log("1")
        if (!log) return;

        // Import totals
        let globalVars = require('./ready');

        if (message.content == "") return;
        if (message.content === oldMessage.content) return;
        if (message.channel.id == "549220763341815808") return; //Glazesdump

        if (!log) return;

        let user = message.author;

        console.log("2")

        const updateEmbed = new Discord.MessageEmbed()
            .setColor("#219DCD")
            .setAuthor(`Message edited ⚒️`, message.author.avatarURL())
            .setDescription(`Message sent by ${message.author} edited in <#${message.channel.id}>.`)
            //Why does oldMessage return the newMessage, does newMessage not exist and does message return the old message?
            .addField(`Before:`, message.content, false)
            .addField(`After:`, oldMessage.content, false)
            .addField(`Jump to message:`, `[Link](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`, false)
            .setFooter(`Edited by ${user.tag}`)
            .setTimestamp();

        globalVars.totalLogs += 1;
        return log.send(updateEmbed);
        
    } catch (e) {
        // log error
        console.log(e);
    };
};