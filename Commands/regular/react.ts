import Discord from "discord.js";
import axios from "axios";
import handleError from "../../Function/handleError";
import { Commands } from "../../typings/classes";

export default {
    name: "react",
    description: "React to a message with a custom emoji",
    type: ["TEXT", "VOICE"],
    category: "REGULAR",
    options: [
        {
            name: "emoji",
            description: "The emoji to react with",
            required: true,
        },
    ],
    permission: "AddReactions",
    usage: "[-gn|--emoji-from-guilds-name] <emojiName...>",
    listener: async (client, message, args) => {
        if (!(message instanceof Discord.Message)) return;
        if (args.length <= 1)
            return message
                .reply("You need to specify an emoji to react with!")
                .catch(handleError);
        args.shift(); // remove the command name

        if (message.deletable) await message.delete().catch(handleError);
        else
            return message.channel.send(
                "❌｜Failed to react message\n***REASON***: failed to delete original message"
            );

        if (!message.reference)
            return message.channel.send(
                "❌｜Failed to react message\n***REASON***: not found message reply"
            );

        const messageReply = await message.channel.messages.fetch(
            message.reference.messageId!
        );

        let needRemoveReactions = false;

        if (args.includes("-r")) {
            args.splice(args.indexOf("-r"), 1);
            needRemoveReactions = true;
        }

        if (args.includes("-gn") || args.includes("--emoji-from-guilds-name")) {
            if (args.includes("-gn")) args.splice(args.indexOf("-gn"), 1);
            if (args.includes("--emoji-from-guilds-name"))
                args.splice(args.indexOf("--emoji-from-guilds-name"), 1);

            let notFoundEmoji: string[] = [];

            args.forEach((emojiName) => {
                let e = message.guild?.emojis.cache.find(
                    (emj) => emj.name === emojiName
                );

                if (e) {
                    messageReply
                        .react(e)
                        .then((s) => {
                            // if (needRemoveReactions)
                            //     setTimeout(() => {
                            //         messageReply.reactions.cache
                            //             .find((v) => {
                            //                 console.log(v.emoji.name);
                            //                 console.log(v.count);
                            //                 return v.me;
                            //             })
                            //             ?.users.reaction.remove();
                            //     }, 1000);
                        })
                        .catch(handleError);
                } else notFoundEmoji.push(emojiName);
            });

            if (notFoundEmoji.length > 0)
                return message.channel.send(
                    `Not found emoji(s): ${notFoundEmoji.join(", ")}`
                );

            return;
        }

        args.forEach((emojiName) => {
            messageReply
                .react(emojiName)
                .then((s) => {
                    // if (needRemoveReactions)
                    //     setTimeout(
                    //         () =>
                    //             message.reactions.cache
                    //                 .find((v) => v.me)
                    //                 ?.remove()
                    //                 .catch(handleError),
                    //         // []r sus -r -gn
                    //         1000
                    //     );
                })
                .catch((e) => handleRestError(e, message));
        });
    },
} as Commands;

function handleRestError(e: any, message: Discord.Message) {
    let embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setTitle(`ERROR: ${e.code}`)
        .setDescription("Errors:")
        .setFields({
            name: `\`${e.code}\``,
            value: `***${e.message}***`,
        });

    message.author.send({ embeds: [embed] }).catch(handleError);
}
