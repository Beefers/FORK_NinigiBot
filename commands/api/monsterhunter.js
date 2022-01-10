exports.run = async (client, interaction, args = interaction.options._hoistedOptions) => {
    const logger = require('../../util/logger');
    // Import globals
    let globalVars = require('../../events/ready');
    try {
        const sendMessage = require('../../util/sendMessage');
        const Discord = require("discord.js");
        const randomNumber = require('../../util/randomNumber');

        // Load JSON
        const monstersJSON = require("../../submodules/monster-hunter-DB/monsters.json");
        const questsJSON = require("../../submodules/monster-hunter-DB/quests.json");
        const elementEmotes = require('../../objects/monsterhunter/elementEmotes.json');

        switch (interaction.options._subcommand) {
            // Specific quest
            case "quest":
                let questName = args.find(element => element.name == "quest-name").value.toLowerCase();
                let questData;
                questsJSON.quests.forEach(quest => {
                    if (quest.name.toLowerCase() == questName) questData = quest;
                });
                if (!questData) return sendMessage(client, interaction, "Could not find the specified quest.");

                // Format quest title
                let questTitle = `${questData.difficulty}⭐ ${questData.name}`;
                if (questData.isKey) questTitle += ` 🔑`;

                // Set up quest targets
                let targets = "";
                if (questData.targets.length > 1) {
                    questData.targets.forEach(target => {
                        if (targets.length == 0) {
                            targets = target;
                        } else {
                            targets += `, ${target}`;
                        };
                    });
                };

                // Make embed
                let questEmbed = new Discord.MessageEmbed()
                    .setColor(globalVars.embedColor)
                    .setAuthor({ name: questTitle })
                    .setDescription(`${questData.description} -${questData.client}`)
                    .addField("Game:", questData.game, true)
                    .addField("Type:", questData.questType, true)
                    .addField("Map:", questData.map, true)
                    .addField("Objective:", questData.objective, true);
                if (targets.length > 0) questEmbed.addField("Targets:", targets, true);
                questEmbed
                    .setFooter(interaction.member.user.tag)
                    .setTimestamp();

                return sendMessage(client, interaction, null, questEmbed);

            // All quests from a game
            case "quests":
                let gameName = args.find(element => element.name == "game-name").value.toLowerCase();

                // Generalize game names and abbreviations
                // Only World and Rise are currently supported; but since other game are WIP I want to filter them either way
                let MH3Titles = [
                    "monster hunter 3 ultimate",
                    "monster hunter 3",
                    "monster hunter 3u",
                    "mh3",
                    "mh3u",
                    "3",
                    "3u"
                ];
                let MH4Titles = [
                    "monster hunter 4 ultimate",
                    "monster hunter 4",
                    "monster hunter 4u",
                    "mh4",
                    "mh4u",
                    "3",
                    "3u"
                ];
                let MHGUTitles = [
                    "monster hunter generations ultimate",
                    "monster hunter generations",
                    "monster hunter generations u",
                    "mhg",
                    "mhgu",
                    "g",
                    "gu"
                ];
                let MH5Titles = [
                    "monster hunter world",
                    "monster hunter 5",
                    "monster hunter world iceborne",
                    "mh5",
                    "mhw",
                    "mhwi",
                    "world"
                ];
                let MH5PTitles = [
                    "monster hunter rise",
                    "monster hunter 5 portable",
                    "monster hunter rise sunbreak",
                    "mhr",
                    "mh5p",
                    "rise"
                ];
                let MHSTTitles = [
                    "monster hunter stories",
                    "mhs",
                    "mhst",
                    "stories"
                ];
                let MHST2Titles = [
                    "monster hunter stories 2",
                    "monster hunter stories 2 wings of ruin",
                    "mhs2",
                    "mhst2",
                    "stories 2"
                ];
                if (MH3Titles.includes(gameName)) gameName = "Monster Hunter 3 Ultimate"
                if (MH4Titles.includes(gameName)) gameName = "Monster Hunter 4 Ultimate";
                if (MHGUTitles.includes(gameName)) gameName = "Monster Hunter Generations Ultimate";
                if (MH5Titles.includes(gameName)) gameName = "Monster Hunter World";
                if (MH5PTitles.includes(gameName)) gameName = "Monster Hunter Rise";
                if (MHSTTitles.includes(gameName)) gameName = "Monster Hunter Stories";
                if (MHST2Titles.includes(gameName)) gameName = "Monster Hunter Stories 2";

                // Add quests matching game title to an array
                let questsTotal = questsJSON.quests.filter(quest => quest.game == gameName);
                if (questsTotal.length == 0) return sendMessage(client, interaction, "Could not find any quests for that game. If you are certain this game exists the quest list may still be a work in progress.");

                // Sort by difficulty
                questsTotal = questsTotal.sort(compare);

                // Make embed
                let questsEmbed = new Discord.MessageEmbed()
                    .setColor(globalVars.embedColor)
                    .setAuthor({ name: `${gameName} Quests` }) // Game name instead of input because of capitalization
                    .setTimestamp();

                let totalQuests = questsTotal.length;
                let pageLength = 10;
                let currentPage = 1; // Load page 1 on command use (duh)
                let questsPaged = questsTotal.reduce((questsTotal, item, index) => {
                    const chunkIndex = Math.floor(index / pageLength);

                    // start a new chunk
                    if (!questsTotal[chunkIndex]) questsTotal[chunkIndex] = [];

                    questsTotal[chunkIndex].push(item);
                    return questsTotal;
                }, []);
                let totalPages = questsPaged.length;

                questsPaged[currentPage - 1].forEach(quest => {
                    let questTitle = `${quest.difficulty}⭐ ${quest.name}`;
                    if (quest.isKey) questTitle += ` 🔑`;
                    questsEmbed.addField(`${questTitle}`, `${quest.objective} in ${quest.map}`, false);
                });

                let startIndex = currentPage + pageLength * currentPage;
                let endIndex = startIndex + pageLength - 1;
                questsEmbed.setFooter(`Page ${currentPage}/${totalPages}`);

                return sendMessage(client, interaction, null, questsEmbed);

                // Function to sort by difficulty
                function compare(a, b) {
                    if (a.difficulty > b.difficulty) return -1;
                    if (a.difficulty < b.difficulty) return 1;
                    return 0;
                };

            // Monsters
            case "monster":
                let monsterName = args.find(element => element.name == "monster-name").value.toLowerCase();

                // Get monster
                let monsterData;
                if (monsterName == "random") {
                    // Get random monster
                    let randomIndex = randomNumber(0, monstersJSON.monsters.length);
                    monsterData = monstersJSON.monsters[randomIndex];
                } else {
                    // Get named monster
                    monstersJSON.monsters.forEach(monster => {
                        if (monster.name.toLowerCase() == monsterName) monsterData = monster;
                    });
                };
                if (!monsterData) return sendMessage(client, interaction, "Could not find the specified monster.");

                // Get icon, description and game appearances
                let monsterIcon;
                let monsterDescription;
                let monsterDanger;
                let gameAppearances = "";
                let mostRecentMainlineGame = "Monster Hunter Rise";
                let fallbackGame1 = "Monster Hunter World";
                let fallbackGame2 = "Monster Hunter Generations Ultimate";
                let mostRecentGameEntry = monsterData.games[monsterData.games.length - 1];
                monsterData.games.forEach(game => {
                    // Add to game appearances list
                    gameAppearances += game.game + "\n";
                    // Works because games are in chronological order
                    if (game.game == mostRecentMainlineGame || game.game == fallbackGame1 || game.game == fallbackGame2) {
                        monsterIcon = `https://github.com/CrimsonNynja/monster-hunter-DB/blob/master/icons/${game.image}?raw=true`;
                        monsterDescription = game.info;
                        monsterDanger = game.danger;
                    };
                });
                // If it isn't in the most recent mainline game; instead use the most recent game it's been in
                if (!monsterIcon) monsterIcon = `https://github.com/CrimsonNynja/monster-hunter-DB/blob/master/icons/${mostRecentGameEntry.image}?raw=true`;
                if (!monsterDescription) monsterDescription = mostRecentMainlineGame.info;
                if (!monsterDanger) monsterDanger = mostRecentGameEntry.danger;

                // Format size
                let monsterSize = "Small";
                if (monsterData.isLarge) monsterSize = "Large";
                // Get elements, ailments and weaknesses
                let monsterElements = "";
                let monsterWeaknesses = "";
                let monsterAilments = "";
                if (monsterData.elements) {
                    monsterData.elements.forEach(element => {
                        let elementString = `${elementEmotes[element]}${element}`;
                        if (monsterElements.length == 0) {
                            monsterElements = elementString;
                        } else {
                            monsterElements += `, ${elementString}`;
                        };
                    });
                };
                if (monsterData.weakness) {
                    monsterData.weakness.forEach(element => {
                        let elementString = `${elementEmotes[element]}${element}`;
                        if (monsterWeaknesses.length == 0) {
                            monsterWeaknesses = elementString;
                        } else {
                            monsterWeaknesses += `, ${elementString}`;
                        };
                    });
                };
                if (monsterData.ailments) {
                    monsterData.ailments.forEach(ailment => {
                        if (monsterAilments.length == 0) {
                            monsterAilments = ailment;
                        } else {
                            monsterAilments += `, ${ailment}`;
                        };
                    });
                };

                // Make embed
                let monsterEmbed = new Discord.MessageEmbed()
                    .setColor(globalVars.embedColor)
                    .setAuthor({ name: `${monsterData.name} (${monsterData.type})` })
                    .setThumbnail(monsterIcon);
                if (monsterDescription) monsterEmbed.setDescription(monsterDescription);
                monsterEmbed
                    .addField("Size:", monsterSize, true)
                if (monsterDanger) monsterEmbed.addField("Danger:", monsterDanger, true);
                if (monsterElements.length > 0) monsterEmbed.addField("Element(s):", monsterElements, true);
                if (monsterWeaknesses.length > 0) monsterEmbed.addField("Weakness(es):", monsterWeaknesses, true);
                if (monsterAilments.length > 0) monsterEmbed.addField("Ailment(s):", monsterAilments, true);
                monsterEmbed
                    .addField("Game(s):", gameAppearances, false)
                    .setFooter(interaction.member.user.tag)
                    .setTimestamp();

                return sendMessage(client, interaction, null, monsterEmbed);
        };

    } catch (e) {
        // Log error
        logger(e, client, interaction);
    };
};

module.exports.config = {
    name: "monsterhunter",
    aliases: ["monster", "mh"],
    description: "Shows Monster Hunter data.",
    options: [{
        name: "quest",
        type: "SUB_COMMAND",
        description: "Get info on a specific quest.",
        options: [{
            name: "quest-name",
            type: "STRING",
            description: "Specify quest by name.",
            required: true
        }]
    },
    {
        name: "quests",
        type: "SUB_COMMAND",
        description: "List all quests from a game.",
        options: [{
            name: "game-name",
            type: "STRING",
            description: "Specify game by name or abbreviation.",
            required: true
        }]
    }, {
        name: "monster",
        type: "SUB_COMMAND",
        description: "Get info on a monster.",
        options: [{
            name: "monster-name",
            type: "STRING",
            description: "Specify monster by its English name.",
            required: true
        }]
    }]
};