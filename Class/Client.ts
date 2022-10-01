import BaseClient from "./BaseClient";
import dotenv from "dotenv";
import handleError from "../Function/handleError";
import discord from "discord.js";
dotenv.config();

export default class Client extends BaseClient {
    constructor() {
        super();
    }

    public async start() {
        this.removeAllListeners()
            .addAllListeners(this)
            .registerAllCommand()
            .login(process.env.TOKEN);

        this.on("ready", async (client) => {
            await client.guilds
                .fetch()
                .then(() => {
                    client.guilds.cache.map(async (g) => {
                        await g.channels.fetch().catch(handleError);
                        g.channels.cache.map(async (c) => {
                            let channel = await g.channels.cache.get(c.id);
                            if (channel instanceof discord.TextChannel)
                                await channel.messages
                                    .fetch({ limit: 10 })
                                    .catch(handleError);
                        });
                    });
                })
                .catch(handleError);

            this.addAllBotStatus();

            console.clear();
            console.log(`Logged in as \`${client.user.tag}\`!`);
            console.log();
            console.log(`Listeners Count: ${this.events.length}`);
            console.log(`Listeners: `);
            console.table(this.events);
            console.log();
            console.log(
                `Message Command Count: ${this.functions.command.length}`
            );
            console.log(`Message Commands: `);
            console.table(this.commands);
        });

        return this;
    }
}
