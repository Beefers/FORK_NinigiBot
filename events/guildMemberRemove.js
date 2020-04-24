module.exports = (client, member) => {
    try {
        const Discord = require("discord.js");
        const log = member.guild.channels.cache.find(channel => channel.name === "log");

        // Import totals
        let globalVars = require('./ready');

        if (!log) return;
        user = client.users.cache.get(member.id);

        const joinEmbed = new Discord.MessageEmbed()
            .setColor("#219DCD")
            .setAuthor(`Member left 💔`, user.avatarURL())
            .addField(`User:`, `<@${user.id}>`)
            .setFooter(`We'll miss you, ${user.username}!`)
            .setTimestamp();


        globalVars.totalLogs += 1;
        return log.send(joinEmbed);
        
    } catch (e) {
        // log error
        console.log(e);
    };
};