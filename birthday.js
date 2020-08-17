module.exports = async (client) => {
    const cron = require("cron");
    const timezone = 'cest';
    const time = '05 00 00 * * *'; //Sec Min Hour 
    const guildID = client.config.botServerID;
    const channelID = client.config.botChannelID;
    const Discord = require("discord.js");
    const { bank } = require('./database/bank');
    const { search } = require('./gifs/search');

    new cron.CronJob(time, async () => {
        let globalVars = require('./events/ready');
        let guild = client.guilds.cache.get(guildID);
        const birthdayRole =  guild.roles.cache.find(role => role.name === globalVars.birthRole)
        if(!birthdayRole) return;
        let yesterdayCuties = birthdayRole.members;
        yesterdayCuties.forEach(cutie => cutie.roles.remove(birthdayRole))
        const cuties = [];
        for (m in guild.members.cache.array()) {
            const member = guild.members.cache.array()[m];
            const birthday = bank.currency.getBirthday(member.id);
            if (birthday) {
                let now = new Date();
                if (now.getDate() === parseInt(birthday.substring(0, 2)) && (now.getMonth() + 1) === parseInt(birthday.substring(2))) {
                    cuties.push(member);
                    await member.roles.add(birthdayRole);
                };
            };
        };

        if (cuties.length < 1) return;

        let channel = guild.channels.cache.find(channel => channel.name === 'casual');

        const gifEmbed = new Discord.MessageEmbed()
            .setColor("#219DCD")
            .setDescription(`> Today's is ${cuties.join(' and ')} birthday, everyone!\n `)
            .setImage(search("birthday"))
            .setTimestamp();
        channel.send(gifEmbed);
    }, timeZone = timezone, start = true);
};
