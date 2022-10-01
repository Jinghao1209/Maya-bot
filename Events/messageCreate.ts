/*****************
 * messageCreate *
 *****************/

import { CommandCategory, Events } from "../typings/classes";
import Client from "../Class/Client";
import Discord from "discord.js";

export default {
    eventName: "messageCreate",
    listener: (client, message) => {
        if (message.author.bot) return;

        if (message.content.startsWith(client.commandPrefix)) {
            const command = message.content
                .slice(client.commandPrefix.length)
                .split(/ +/);
            const commandName = command[0];
            const commandLine = getCommand(
                client,
                commandName,
                message.member
            );

            if (commandLine === 1) {
                return message.channel.send(
                    `Command ${client.commandPrefix}${commandName} not found!`
                );
            } else if (commandLine === 2) {
                return message.channel.send(
                    `You don't have permission to use this command!`
                );
            }

            if (message.channel.type === Discord.ChannelType.GuildVoice) {
                if (
                    commandLine.type.includes("VOICE") ||
                    commandLine.type.includes("ALL")
                ) {
                    commandLine.listener(client, message, command);
                } else {
                    return message.channel.send(
                        `Command ${client.commandPrefix}${commandName} not found!`
                    );
                }
            } else if (message.channel.type === Discord.ChannelType.DM) {
                if (
                    commandLine.type.includes("DM") ||
                    commandLine.type.includes("ALL")
                ) {
                    commandLine.listener(client, message, command);
                } else {
                    return message.channel.send(
                        `Command ${client.commandPrefix}${commandName} not found!`
                    );
                }
            } else {
                commandLine.listener(client, message, command);
            }
        }
    },
} as Events<"messageCreate">;

/**
 * return 1 when command not found
 * return 2 when permission not enough
 */
function getCommand(
    client: Client,
    commandName: string,
    member: Discord.GuildMember | null
) {
    const commandLine = client.commands
        .filter((cmd) => cmd.name === commandName)
        .filter(
            (cmd) =>
                cmd.type.includes("TEXT") ||
                cmd.type.includes("VOICE") ||
                cmd.type.includes("DM") ||
                cmd.type.includes("ALL")
        )[0];

    if (!commandLine) {
        return 1;
    }

    const permission = member?.permissions.has(commandLine.permission, true);
    if (!permission) return 2;

    return commandLine;
}
