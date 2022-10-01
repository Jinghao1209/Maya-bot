import Discord from 'discord.js';
import { Commands } from '../../typings/classes';

export default {
    name: "help",
    description: "Show all commands",
    type: ["TEXT", "VOICE", "DM"],
    category: "REGULAR",
    options: [],
    permission: "ViewChannel",
    listener: (client, message, args) => {
        try {
            message.reply("This command is not yet implemented!");
        } catch (error) {
            console.log(error);
        }
    }
} as Commands;