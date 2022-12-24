/*****************
 * messageUpdate *
 *****************/

import Discord from "discord.js";
import { Events } from "../typings/classes";

export default {
    eventName: "messageUpdate",
    listener: async (client, oldMessage, newMessage) => {
        if (!client.requireLog) return;
        if (oldMessage.partial)
            await oldMessage.fetch();
        if (newMessage.partial)
            await newMessage.fetch();
        
        console.log("\u001B[31mCONTENT CHANGED FROM:");
        await client.logger.onMessage(oldMessage as Discord.Message<true>);
        console.log("\u001B[32mTO:");
        await client.logger.onMessage(newMessage as Discord.Message<true>);
        console.log("\u001B[0m");
    },
} as Events<"messageUpdate">;
