module.exports = async (client) => {
    try {
        const { bank } = require('../database/bank');
        const { Users } = require('../database/dbObjects');
        const stan = require('../affairs/stan')(client);
        const birthday = require('../affairs/birthday')(client);
        const storedBalances = await Users.findAll();
        storedBalances.forEach(b => bank.currency.set(b.user_id, b));
        const getTime = require('../util/getTime');

        // if (client.user.id !== "592760951103684618") {
        // Set slash commands
        if (!client.application?.owner) await client.application?.fetch();

        await client.commands.forEach(command => {
            try {
                client.application?.commands.create(command.config);
            } catch (e) {
                console.log(e);
            };
        });
        // };

        // Set bot status
        client.user.setPresence({ activities: [{ name: 'in Sinnoh' }], status: 'idle' });

        // List servers the bot is connected to
        console.log("Servers:");
        client.guilds.cache.forEach((guild) => {
            console.log(`-${guild.name}`);
        });

        let timestamp = await getTime();

        console.log(`Commands: ${client.commands.size}
Guilds: ${client.guilds.cache.size}
Channels: ${client.channels.cache.size}
Users: ${client.users.cache.size} (cached)
Connected as ${client.user.tag}. (${timestamp})`);

    } catch (e) {
        // log error
        console.log(e);
    };
};

module.exports.birthdayRole = "744719808058228796";
module.exports.botChannelID = "747878956434325626";
module.exports.currency = "💰";
module.exports.embedColor = "#219DCD";
module.exports.lackPerms = `You do not have the required permissions to do this.`;
module.exports.prefix = "?";
module.exports.eventChannelID = "752626723345924157"; // General2
//module.exports.eventChannelID = "665274079397281835"; // Old stan channel
//module.exports.eventChannelID = "593014621095329812";  // Testing
module.exports.stanRole = "stan";
module.exports.starboardLimit = 3;
module.exports.battling = { yes: false };