import Discord from "discord.js";
import handleError from "../../Function/handleError";
import { Commands } from "../../typings/classes";

export default {
    name: "embed",
    description: "Create a embed",
    type: ["TEXT", "VOICE"],
    category: "PERSONAL",
    options: [],
    permission: "AddReactions",
    listener: (client, message, args) => {
        let channel = message.channel;
        if (!channel) return console.log("channel not found");
        if (!(message instanceof Discord.Message))
            return message.reply({
                content: "THIS IS NOT A MESSAGE",
            });

        let json_text = message.content.split(/ +/);
        json_text.shift();
        let json: any = {};

        try {
            json = JSON.parse(json_text.join(""));

            let embed = new Discord.EmbedBuilder()
                .setColor(json.color ?? "Blue")
                .setDescription(json.text ?? "this is a default text")
                .setTitle(json.title ?? "this is a default title")
                .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() ?? undefined});
            message.reply({
                content: json.content ?? "",
                embeds: [embed],
            });

            console.log(json);
        } catch (e) {
            message.reply(new Error(e as any).message);
            handleError(e);
        }
    },
} as Commands;
