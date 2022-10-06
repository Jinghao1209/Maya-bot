import Discord from "discord.js";
import handleError from "../../Function/handleError";
import { Commands } from "../../typings/classes";

export default {
    name: "help",
    description: "Show all commands",
    type: ["TEXT", "VOICE"],
    category: "REGULAR",
    options: [],
    permission: "ViewChannel",
    usage: "[commandName]",
    listener: (client, message, args) => {
        let channel = message.channel;
        if (!channel) return console.log("channel not found");
        if (!(message instanceof Discord.Message))
            return message.reply({
                content: "THIS IS NOT A MESSAGE",
            });

        let embed = new Discord.EmbedBuilder().addFields(
            client.commands
                .map((command) => ({
                    name: `[${command.category}] ${command.name}`,
                    value: `${command.name} ${command.usage}\n***description***: ${command.description}`,
                }))
                .sort()
        )
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() ?? undefined})
            .setColor(message.author.hexAccentColor ?? "#f2b2dc");

        message.reply({ embeds: [embed] }).catch(handleError);

        // message
        //     .reply("This command is not yet implemented!")
        //     .catch(handleError);
    },
} as Commands;
