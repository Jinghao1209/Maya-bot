import Discord from "discord.js";
import handleError from "../../Function/handleError";
import { Commands } from "../../typings/classes";

export default {
    name: "react",
    description: "React to a message with a custom emoji",
    type: ["TEXT", "VOICE", "DM"],
    category: "REGULAR",
    options: [
        {
            name: "emoji",
            description: "The emoji to react with",
            required: true,
        },
    ],
    permission: "AddReactions",
    listener: (client, message, args) => {
        if (message instanceof Discord.CommandInteraction) return;
        if (args.length <= 1)
            return message
                .reply("You need to specify an emoji to react with!")
                .catch(handleError);
        args.shift(); // remove the command name

        try {
            let needRemoveReactions = false;
            if (args.includes("-r")) {
                args.splice(args.indexOf("-r"), 1);
                needRemoveReactions = true;
            }
            message.channel.messages.cache.delete(
                message.channel.lastMessageId ?? ""
            );

            let reactMessage = message.channel.messages.cache.at(
                message.channel.messages.cache.size - 1
            );
            if (args.includes("--")) {
                let temp = message.channel.messages.cache.get(
                    args[args.indexOf("--") + 1]
                );

                if (!temp) {
                    return message
                        .reply(
                            "Couldn't find the message with the id `" +
                                args[args.indexOf("--") + 1] +
                                "`"
                        )
                        .catch(handleError);
                }
                reactMessage = temp;
                args.splice(args.indexOf("--"), 2);
            } else {
                if (reactMessage == null)
                    return message
                        .reply(
                            "Please send a message first! Or add args `-- messageId`"
                        )
                        .catch(handleError);
            }

            if (
                args.includes("-gn") ||
                args.includes("--emoji-from-guilds-name")
            ) {
                if (args.includes("-gn")) args.splice(args.indexOf("-gn"), 1);
                if (args.includes("--emoji-from-guilds-name"))
                    args.splice(args.indexOf("--emoji-from-guilds-name"), 1);

                let notFoundEmoji: any[] = [];

                args.forEach(async (emojiName) => {
                    const emojiToReact = message.guild?.emojis.cache.find(
                        (emj) => emj.name === emojiName
                    );
                    if (emojiToReact) {
                        reactMessage
                            ?.react(emojiToReact)
                            .then((react) => {
                                if (needRemoveReactions) delReact(react);
                            })
                            .catch(() => {
                                message.channel
                                    .send(
                                        "Failed to react with emoji `" +
                                            emojiName +
                                            "`"
                                    )
                                    .catch(handleError);
                            });
                    } else {
                        notFoundEmoji.push(emojiName);
                    }
                });

                if (notFoundEmoji.length > 0) {
                    message
                        .reply(
                            `The following emoji(s) were not found: ${notFoundEmoji.join(
                                ", "
                            )}`
                        )
                        .catch(handleError);
                }

                return message.delete().catch(() => {
                    // ignore
                });
            } else if (
                args.includes("-bn") ||
                args.includes("--emoji-from-bot-name")
            ) {
                if (args.includes("-bn")) args.splice(args.indexOf("-bn"), 1);
                if (args.includes("--emoji-from-bot-name"))
                    args.splice(args.indexOf("--emoji-from-bot-name"), 1);

                let notFoundEmoji: any[] = [];

                args.forEach((emojiName) => {
                    const emojiToReact = client.emojis.cache.find(
                        (emj) => emj.name === emojiName
                    );
                    if (emojiToReact) {
                        reactMessage
                            ?.react(emojiToReact)
                            .then((react) => {
                                if (needRemoveReactions) delReact(react);
                            })
                            .catch(() => {
                                message.channel
                                    .send(
                                        "Failed to react with emoji `" +
                                            emojiName +
                                            "`"
                                    )
                                    .catch(handleError);
                            });
                    } else {
                        notFoundEmoji.push(emojiName);
                    }
                });

                if (notFoundEmoji.length > 0) {
                    message.reply(
                        `The following emoji(s) were not found: ${notFoundEmoji.join(
                            ", "
                        )}`
                    );
                }

                return message.delete().catch(handleError);
            }

            try {
                args.forEach((emoji) => {
                    message
                        .react(emoji)
                        .then((v) => {
                            // [ ]: Not work
                            // setTimeout(() => v.remove().catch(handleError), 10 * 1000);
                        })
                        .catch((err) => {
                            message.reply(`Failed to react with \`${emoji}\``);
                            console.debug(err);
                        });
                });
            } catch (e) {
                message.reply(`Failed to react with \`${args.join(" ")}\``);
                console.debug(e);
            }
        } catch (error) {
            console.log(error);
        }
    },
} as Commands;

function delReact(message: Discord.MessageReaction, ms: number = 10000) {
    setTimeout(() => {
        message.remove().catch(handleError);
    }, ms);
}
