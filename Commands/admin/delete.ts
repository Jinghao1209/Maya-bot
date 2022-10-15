import Discord from "discord.js";
import handleError from "../../Function/handleError";
import handleRestError from "../../Function/handleRestError";
import { Commands } from "../../typings/classes";

export default {
    name: "del",
    description: "Delete message",
    type: ["TEXT", "INTERACTION"],
    category: "ADMIN",
    options: [
        {
            name: "messageCount",
            required: true,
            type: Discord.ApplicationCommandOptionType.Integer,
        },
    ],
    permission: "ManageMessages",
    usage: "<messageCount>",
    listener: async (client, message, args) => {
        if (message instanceof Discord.Message) {
            if (!(message.channel instanceof Discord.TextChannel)) return;

            try {
                let count = parseInt(args[1]);

                if (isNaN(count))
                    return message.reply({
                        content: "messageCount is required!",
                    });

                await message.delete();
                await message.channel.bulkDelete(count, true);

                message.channel
                    .send(`Deleted ${count} message(s)`)
                    .then((msg) =>
                        setTimeout(() => msg.delete().catch(handleError), 5000)
                    );
            } catch (e) {
                handleRestError(e, message);
            }
        } else {
            client.logger.info(
                `User ${message.user.tag} send a interaction command <del>`
            );
            // handle interaction command;
        }
    },
} as Commands;
