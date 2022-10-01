import Discord from "discord.js";
import Client from "../Class/Client";

export type CommandPrefix = "[]";
export type CommandType = "TEXT" | "VOICE" | "INTERACTION" | "DM" | "ALL";
export type CommandCategory = "ADMIN" | "PERSONAL" | "REGULAR" | "SONG";

export interface Commands {
    /** @warn 不要有空格和特殊字符 */
    name: string;
    description: string;
    type: CommandType[];
    category: CommandCategory;
    options: Discord.ApplicationCommandOption[];
    permission: Discord.PermissionsString;
    listener: (
        client: Client,
        message: Discord.Message | Discord.CommandInteraction,
        args: string[]
    ) => void;
}

export interface Events<K extends keyof Discord.ClientEvents> {
    eventName: K;
    listener: (client: Client, ...eventArgs: Discord.ClientEvents[K]) => void;
}
