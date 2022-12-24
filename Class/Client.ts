import BaseClient from "./BaseClient";
import dotenv from "dotenv";
import discord from "discord.js";
import { BaseClientOptions } from "../typings/client";
dotenv.config();

export default class Client extends BaseClient {
    constructor(options: BaseClientOptions = {}) {
        super(options);
    }

    public async start() {
        this.removeAllListeners()
            .addAllListeners(this)
            .registerAllCommand()
            .login(process.env.TOKEN);

        this.on("ready", async (client) => {
            this.addAllBotStatus();
            await this.fetchAllGuild();

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
