import Discord from "discord.js";
import Client from "../Class/Client";

export type CommandPrefix = "[]";
export type CommandType = "TEXT" | "VOICE" | "INTERACTION" | "DM" | "ALL";
export type CommandCategory = "ADMIN" | "PERSONAL" | "REGULAR" | "VC" | "GAME";

export interface Commands {
    /** @warn 不要有空格和特殊字符 */
    category: CommandCategory;
    description: string;
    listener: (
        client: Client,
        message: Discord.Message | Discord.CommandInteraction,
        args: string[]
    ) => Promise<void> | void;
    name: string;
    options: Discord.ApplicationCommandOption[];
    permission: Discord.PermissionsString;
    type: CommandType[];
    usage: string; // try to live with []help
}

export interface Events<K extends keyof Discord.ClientEvents> {
    eventName: K;
    listener: (client: Client, ...eventArgs: Discord.ClientEvents[K]) => void;
}
