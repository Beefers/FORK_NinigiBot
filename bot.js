let botjsFunction = async function botjsFunction() {
    const Discord = require('discord.js');
    const Enmap = require("enmap");
    const fs = require("fs");
    const path = require("path");

    // all except guild presence
    // privileged: guild_messages, guild_members
    const intents = [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.GuildBans, Discord.GatewayIntentBits.GuildEmojisAndStickers, Discord.GatewayIntentBits.GuildIntegrations, Discord.GatewayIntentBits.GuildVoiceStates, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildMessageReactions, Discord.GatewayIntentBits.DirectMessages];

    const client = new Discord.Client({
        intents: intents,
        partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
        allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
    });
    const config = require("./config.json");
    client.config = config;

    // This loop reads the /events/ folder and attaches each event file to the appropriate event.
    fs.readdir("./events/", (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {

            // If the file is not a JS file, ignore it.
            if (!file.endsWith(".js")) return;

            // Load the event file itself
            const event = require(`./events/${file}`);

            // Get just the event name from the file name
            let eventName = file.split(".")[0];

            // Each event will be called with the client argument,
            // followed by its "normal" arguments, like message, member, etc.
            client.on(eventName, event.bind(null, client));
            delete require.cache[require.resolve(`./events/${file}`)];
        });
    });

    client.commands = new Enmap();
    client.aliases = new Discord.Collection();

    await walk(`./commands/`);
    console.log("Loaded commands!");

    client.login(config.token);

    // This loop reads the /commands/ folder and attaches each command file to the appropriate command.
    async function walk(dir, callback) {
        fs.readdir(dir, function (err, files) {
            if (err) throw err;

            files.forEach(function (file) {
                let filepath = path.join(dir, file);
                fs.stat(filepath, function (err, stats) {
                    if (stats.isDirectory()) {
                        walk(filepath, callback);
                    } else if (stats.isFile() && file.endsWith('.js')) {
                        let props = require(`./${filepath}`);
                        if (!props.config.type) props.config.type = Discord.ApplicationCommandType.ChatInput;
                        let commandName = file.split(".")[0];
                        //console.log(`Loaded command: ${commandName} ✔`);
                        client.commands.set(commandName, props);
                        if (props.config.aliases) {
                            props.config.aliases.forEach(alias => {
                                if (client.aliases.get(alias)) return console.log(`Warning: Two commands share an alias name: ${alias}`);
                                client.aliases.set(alias, commandName);
                            });
                        };
                    };
                });
            });
        });
    };
};

let botjs = botjsFunction;

botjsFunction();