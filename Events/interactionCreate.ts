/*********************
 * interactionCreate *
 *********************/

import { Events } from "../typings/classes";

export default {
    eventName: "interactionCreate",
    listener: (client, interaction) => {
        if (interaction.isCommand()) {
            interaction.reply({
                content: "We are not supporting commands yet!",
                isInteraction: true,
            });
        }
    },
} as Events<"interactionCreate">;
