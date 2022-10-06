import Discord from "discord.js";
import fs from "fs";
import handleError from "../Function/handleError";
import {
    CommandCategory,
    CommandPrefix,
    Commands,
    Events,
} from "../typings/classes";
import Client from "./Client";

// all intents
// const intents = new Discord.Intents(32767);
const gateway = [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.DirectMessages
];

export default class BaseClient extends Discord.Client {
    /** @comments events name */
    public events: string[];
    /** @comments commands name */
    public commands: Commands[];
    // public commands: {
    //     [key in CommandCategory]: Commands[];
    // };
    public functions: {
        command: {
            length: number;
        };
    };
    public commandPrefix: CommandPrefix;

    constructor() {
        super({ intents: gateway, partials: [
            Discord.Partials.Channel
        ] });

        this.events = [];
        this.functions = {
            command: {
                length: 0,
            },
        };
        this.commandPrefix = "[]";
        this.commands = [];
        // this.commands = [{
        //     ADMIN: [],
        //     PERSONAL: [],
        //     REGULAR: [],
        //     SONG: [],
        // }]
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
        // this.user?.setPresence({
        //     activities: [
        //         {
        //             name: "[]help",
        //             type: "PLAYING",
        //         },
        //         {
        //             name: "[?]play default",
        //             type: "LISTENING",
        //             url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        //         },
        //     ],
        // });
        // this.user?.setActivity({
        //     name: "[]help",
        //     type: "PLAYING",
        //     url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        // })

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
