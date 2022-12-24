import { Commands } from "../../typings/classes";
import Discord from "discord.js";
import handleError from "../../Function/handleError";

export default {
    name: "spam",
    description: "How can i spam message?",
    type: ["TEXT", "VOICE", "DM"],
    category: "REGULAR",
    options: [],
    permission: "SendMessages",
    usage: "[-t]",
    listener: (client, message, args) => {
        let channel = message.channel;
        if (!channel) return console.log("channel not found");
        if (!(message instanceof Discord.Message))
            return message.reply({
                content: "THIS IS NOT A MESSAGE",
            });

        let string = "",
            len = Math.floor(Math.random() * 10) + 3;

        message.delete().catch(handleError);

        if (args.includes("-t")) {
            let ll = Math.floor(Math.random() * 10) + 1;
            for (let i = 0; i < ll; i++) {
                for (let j = 0; j < len; j++) {
                    string +=
                        client.characters[
                            Math.floor(Math.random() * client.characters.length)
                        ];
                }

                message.channel.send(string);
                string = "";
            }
        } else {
            for (let i = 0; i < len; i++) {
                string +=
                    client.characters[
                        Math.floor(Math.random() * client.characters.length)
                    ];
            }

            message.channel.send(string);
        }
    },
} as Commands;
