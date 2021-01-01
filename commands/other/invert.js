module.exports.run = async (client, message) => {
    try {
        if (!message.channel.permissionsFor(message.guild.me).has("ATTACH_FILES")) return message.channel.send(`> I can't send you files because I don't have permissions to attach files to my messages, ${message.author}.`);

        const Discord = require("discord.js");
        const Canvas = require("canvas");

        let user = message.mentions.users.first();

        if (!user) {
            const input = message.content.split(` `, 2);
            let userID = input[1];
            user = client.users.cache.get(userID);
        };

        if (!user) {
            user = message.author;
        };

        let totalMessage = `> Here you go, ${message.author}, ${user.tag}'s inverted avatar.`;

        let avatar = null;
        if (user.avatarURL()) avatar = user.avatarURL({ format: "png", dynamic: true });
        if (!avatar) return message.channel.send(`> ${user.tag} doesn't have an avatar, ${message.author}.`);

        let startOffset = 0;
        let avatarSize = 128;
        let canvas = Canvas.createCanvas(avatarSize, avatarSize);
        let ctx = canvas.getContext('2d');
        let drawAvatar = await Canvas.loadImage(avatar);
        ctx.drawImage(drawAvatar, startOffset, startOffset);
        ctx.beginPath();
        let imageData = ctx.getImageData(startOffset, startOffset, avatarSize, avatarSize);
        let data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            // red
            data[i] = 255 - data[i];
            // green
            data[i + 1] = 255 - data[i + 1];
            // blue
            data[i + 2] = 255 - data[i + 2];
        };

        // Overwrite image
        ctx.putImageData(imageData, startOffset, startOffset);
        ctx.closePath();
        ctx.clip();

        return message.channel.send(totalMessage, {
            files: [canvas.toBuffer()]
        });

    } catch (e) {
        // log error
        const logger = require('../../util/logger');

        logger(e, client, message);
    };
};

module.exports.config = {
    name: "invert",
    aliases: []
};
