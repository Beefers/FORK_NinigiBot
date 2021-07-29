module.exports = async (client, oldMember, newMember) => {
    try {
        console.log("voice statse")
        const { VCTextChannels } = require('../database/dbObjects');
        let oldID = null;
        let newID = null;
        if (oldMember.channelID) oldID = oldMember.channelID;
        if (newMember.channelID) newID = newMember.channelID;

        let user = client.users.cache.get(newMember.id);
        // if (user.bot) return;
        console.log(`user bot ${user.bot}`)

        let VCTextChannel = await VCTextChannels.findOne({ where: { server_id: newMember.guild.id } });
        console.log(`vctextchannel ${VCTextChannel}`)
        // if (!VCTextChannel) return;
        await newMember.guild.channels.fetch();
        let textChannel = newMember.guild.channels.cache.find(channel => channel.id == VCTextChannel.channel_id);
        console.log(`textchannel ${textChannel}`)
        // if (!textChannel) return;
        await textChannel.fetch();
        let channelPermOverride = textChannel.permissionOverwrites.cache.get(newMember.id);
        console.log(channelPermOverride)

        // Joined VC
        if (newID) {
            if (channelPermOverride) {
                try {
                    return channelPermOverride.edit({
                        VIEW_CHANNEL: true,
                        READ_MESSAGE_HISTORY: true, user: user
                    });
                } catch (e) {
                    console.log(e);
                };
            } else {
                try {
                    let permOverwrites = textChanel.permissionOverwrites.cache.get(user.id);
                    return permOverwrites.create(user, {
                        VIEW_CHANNEL: true,
                        READ_MESSAGE_HISTORY: true, user: user
                    });
                } catch (e) {
                    console.log(e);
                };
            };
            //Left VC
        } else if (oldID) {
            if (channelPermOverride) {
                return channelPermOverride.delete();
            } else {
                return;
            };
        };

    } catch (e) {
        // log error
        console.log(e);
    };
};