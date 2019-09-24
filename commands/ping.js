exports.run = (client, message, args, member) => {
    try {
        return message.channel.send(`> Pong!'ed back at <@${message.author.id}> in ${new Date().getTime() - message.createdTimestamp}ms.`).catch(console.error);
        
    } catch (e) {
        // send msg to owner
        let members = message.channel.members;
        let owner = members.find('id', client.config.ownerID);
        owner.send(`> An error occurred while <@${message.member.user.id}> tried to use a command in <#${message.channel.id}>, check console for more information.`);
        
        // log error
        console.log(e);

        // return confirmation
        return message.channel.send(`> An error has occurred trying to run the command, please contact <@${client.config.ownerID}>.`);
    };
};

module.exports.help = {
    name: "Ping",
    description: "Responds with Pong! and the time it took to process this command.",
    usage: `ping`
};
