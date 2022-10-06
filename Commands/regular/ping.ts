import { Commands } from "../../typings/classes";

export default {
    name: "ping",
    description: "Ping!",
    type: ["TEXT", "VOICE", "DM"],
    category: "REGULAR",
    options: [],
    permission: "SendMessages",
    usage: "",
    listener: (client, message, args) => {
        message.reply("Pong! at " + (Date.now() - message.createdTimestamp) + "ms");
    }
} as Commands;