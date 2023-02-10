import Discord from "discord.js";
import fs from "fs";
import handleError from "../Function/handleError";
import {
    CommandCategory,
    CommandPrefix,
    Commands,
    Events,
} from "../typings/classes";
import { BaseClientOptions } from "../typings/client";
import Client from "./Client";
import Logger from "./Logger";

// all intents
const gateway = [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.DirectMessages,
];

export default class BaseClient extends Discord.Client {
    /** @comments events name */
    public events: string[];
    /** @comments commands name */
    public commands: Commands[];
    public commandCategory: CommandCategory[];
    public helpCommands: {
        [key in CommandCategory]: Discord.APIEmbedField[];
    };
    public functions: {
        command: {
            length: number;
        };
    };
    public commandPrefix: CommandPrefix;
    public logger: Logger;
    public characters: string;
    public requireLog: boolean;

    constructor(options: BaseClientOptions) {
        super({ intents: gateway, partials: [Discord.Partials.Channel] });

        this.events = [];
        this.functions = {
            command: {
                length: 0,
            },
        };
        this.commandPrefix = "[]";
        this.commands = [];
        this.commandCategory = ["REGULAR", "ADMIN", "GAME", "PERSONAL", "VC"];
        this.helpCommands = {} as any;

        this.logger = new Logger();
        this.requireLog = options.requireLog || false;
        this.characters = "";
        for (let i = 48; i <= 112; i++) {
            this.characters += String.fromCharCode(i);
        }
    }

    public addAllListeners(client: Client) {
        fs.readdirSync("./Events")
            .filter((file) => file.endsWith(".ts"))
            .forEach(async (file) => {
                let event = (await import(`../Events/${file}`))
                    .default as Events<any>;

                this.on(event.eventName, event.listener.bind(null, client));
                this.events.push(event.eventName);
            });

        return this;
    }

    public addAllBotStatus() {
        this.user?.setActivity({
            name: "[]help",
            type: Discord.ActivityType.Playing,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        });

        return this;
    }

    public registerAllCommand() {
        fs.readdirSync("./Commands").forEach((dirName) => {
            fs.readdirSync(`./Commands/${dirName}`)
                .filter((file) => file.endsWith(".ts"))
                .forEach(async (file) => {
                    let command = (
                        await import(`../Commands/${dirName}/${file}`)
                    ).default as Commands;

                    this.commands.push(command);
                    this.functions.command.length++;
                });
        });

        return this;
    }

    public initializeHelpCommand() {
        this.commands.map((command) => {
            // if `tempCommand[command.category]` is undefined, initialize array for it
            this.helpCommands[command.category] ??
                (this.helpCommands[command.category] = []);

            this.helpCommands[command.category].push({
                name: `[]${command.name}`,
                value: `${command.name} ${command.usage}\n***description***: ${command.description}\n **permission required**: ${command.permission}`,
            });
        });
    }

    public async fetchAllGuild() {
        await this.guilds
            .fetch()
            .then(() => {
                this.guilds.cache.map(async (g) => {
                    await g.channels.fetch().catch(handleError);
                });
            })
            .catch(handleError);

        return this;
    }
}
