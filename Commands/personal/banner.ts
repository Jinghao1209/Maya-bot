import Discord from "discord.js";
import handleError from "../../Function/handleError";
import { Commands } from "../../typings/classes";

export default {
    name: "banner",
    description: "Get user banner",
    type: ["TEXT", "VOICE"],
    category: "PERSONAL",
    options: [],
    permission: "SendMessages",
    usage: "{mentions|clientId}",
    listener: async (client, message, args) => {
        let channel = message.channel,
            guild = message.guild;
        if (!channel || !guild)
            return console.log("channel or guild not found");
        if (!(message instanceof Discord.Message))
            return message
                .reply({
                    content: "THIS IS NOT A MESSAGE",
                })
                .catch(handleError);

        let mentionUser =
            message.mentions.users.first() || guild.members.cache.get(args[1]);
        if (!mentionUser)
            return message
                .reply("mention member not found!")
                .catch(handleError);

        let user = await client.users.fetch(mentionUser, { force: true });

        let embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: user.tag,
                iconURL: user.avatarURL() ?? undefined,
            })
            .setImage(user.bannerURL() ?? null)
            .setFields({
                name: "AccentColor",
                value: user.hexAccentColor ?? "***AccentColor NULL***",
            })
            .setColor(user.hexAccentColor ?? "Red");

        message.channel.send({ embeds: [embed] });
    },
} as Commands;
