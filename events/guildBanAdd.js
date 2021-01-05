module.exports = async (client, guild, user) => {
    // Import globals
    let globalVars = require('./ready');
    try {
        console.log(guild)
        const Discord = require("discord.js");
        const log = guild.channels.cache.find(channel => channel.name === "log");
        if (!log) return;
        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });
        const banLog = fetchedLogs.entries.first();
        const { executor, target } = banLog;

        if (target.id !== user.id) return;
        let avatarExecutor = executor.displayAvatarURL({ format: "png", dynamic: true });
        let avatarTarget = target.displayAvatarURL({ format: "png", dynamic: true });

        const banEmbed = new Discord.MessageEmbed()
            .setColor(globalVars.embedColor)
            .setAuthor( `Member Banned 💔`, avatarExecutor)
            .setThumbnail(avatarTarget)
            .addField(`User:`, `${user} (${user.id})`)
            .setFooter(`${target.tag} got banned by ${executor.tag}`)
            .setTimestamp();

        globalVars.totalLogs += 1;
        return log.send(banEmbed);

    } catch (e) {
        // log error
        const logger = require('../util/logger');

        logger(e);
    };
};
