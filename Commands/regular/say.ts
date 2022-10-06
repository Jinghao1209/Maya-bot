import { Commands } from "../../typings/classes";
import Discord from "discord.js";
import handleError from "../../Function/handleError";

export default {
    name: "say",
    description: "Say HI to ME!",
    type: ["TEXT", "DM"],
    category: "REGULAR",
    options: [],
    permission: "SendMessages",
    usage: "",
    listener: async (client, message, args) => {
        let channel = message.channel;
        if (!channel) return console.log("channel not found");
        if (!(message instanceof Discord.Message))
            return message.reply({
                content: "THIS IS NOT A MESSAGE",
            });

        console.log(`${message.author.tag}: ${args.join(" ")}`);

        if (channel instanceof Discord.DMChannel) {
            args.shift();
            if (args.length === 0)
                return message.channel.send("You can't send a empty message");
            if (!args.includes("-c"))
                return message.channel.send(
                    "You need to specify a channel id with -c <channelId>!"
                );

            client.channels
                .fetch(args[args.indexOf("-c") + 1])
                .then((v) => {
                    if (!v) {
                        message.channel
                            .send("not found channel!")
                            .catch(handleError);
                        return;
                    }

                    if (v.type !== Discord.ChannelType.GuildText) {
                        message.channel
                            .send("not a text channel")
                            .catch(handleError);
                        return;
                    } else {
                        let u = v.members.find(
                            (v) => v.user.id === message.author.id
                        );
                        if (!u) {
                            message.channel
                                .send("not found channel")
                                .catch(handleError);
                            return;
                        }

                        args.splice(args.indexOf("-c"), 2);
                        if (args.length === 0) {
                            message.channel
                                .send("You can't send a empty message")
                                .catch(handleError);
                            return;
                        }
                        v.send(args.join(" ")).catch(handleError);
                    }
                })
                .catch(handleError);
        } else if (channel instanceof Discord.TextChannel) {
            await message.delete().catch((err) => {
                handleError(err);

                channel?.send("DELETE ERROR").catch(handleError);
            });

            args.shift();
            channel.send(args.join(" "));
        }
    },
} as Commands;
