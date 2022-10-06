import Discord from "discord.js";
import handleError from "../../Function/handleError";
import { Commands } from "../../typings/classes";

export default {
    name: "btn",
    description: "Create a button",
    type: ["TEXT", "VOICE"],
    category: "PERSONAL",
    options: [],
    permission: "EmbedLinks",
    usage: "<JSON[label|style|text]>",
    listener: (client, message, args) => {
        let channel = message.channel;
        if (!channel) return console.log("channel not found");
        if (!(message instanceof Discord.Message))
            return message.reply({
                content: "THIS IS NOT A MESSAGE",
            }).catch(handleError);

        let json_text = message.content.split(/ +/);
        json_text.shift();
        let json: any = {};

        try {
            json = JSON.parse(json_text.join(""));

            let row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("invalid_button")
                    .setStyle(json.style ?? Discord.ButtonStyle.Primary)
                    .setLabel(json.label ?? "***NULL LABEL***")
            ) as any;

            message.reply({
                content: json.text ?? "",
                components: [row],
            }).catch(handleError);

            console.log(json);
        } catch (e) {
            message.reply(new Error(e as any).message);
            handleError(e);
        }
    },
} as Commands;
