/*********************
 * interactionCreate *
 *********************/

import { CommandCategory, Events } from "../typings/classes";
import Discord from "discord.js";
import Client from "../Class/Client";
import handleError from "../Function/handleError";

export default {
    eventName: "interactionCreate",
    listener: (client, interaction) => {
        if (interaction.isCommand()) {
            return interaction.reply({
                content: "We are not supporting commands yet!",
                isInteraction: true,
            });
        }

        if (interaction.isSelectMenu())
            return handleSelectMenu(client, interaction);
    },
} as Events<"interactionCreate">;

const handleSelectMenu = async (
    client: Client,
    interaction: Discord.SelectMenuInteraction
) => {
    if (interaction.values[0].length < 1)
        return interaction.reply("Error: Interaction.values less than 1");

    if (interaction.customId === "help_btn_select") {
        let category = interaction.values[0] as CommandCategory;
        interaction.message
            .edit({
                embeds: [
                    new Discord.EmbedBuilder()
                        .addFields(client.helpCommands[category])
                        .setTitle(category)
                        .setColor("#f2b2dc"),
                ],
                content: "there you go!",
            })
            .catch(handleError);

        interaction.deferUpdate().catch(handleError);
    }
};
