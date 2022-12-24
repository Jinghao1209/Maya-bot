import Discord from "discord.js";

export default class Logger {
    constructor() {}

    info(...message: any[]) {
        console.log("\u001B[33m[INFO]\u001B[0m", ...message);
    }

    error(...message: any[]) {
        console.log("\u001B[31m[ERROR]\u001B[0m", ...message);
    }

    async onMessage(message: Discord.Message<true>) {
        console.log(
            `\u001B[33m${message.createdAt.toLocaleString()}\u001B[0m <\u001B[35m${
                message.id
            }\u001B[0m> ${message.guild.name} | ${message.channel.name} % ${
                message.author.tag
            }:`
        );

        console.log(message.content);

        if (message.attachments.size > 0) {
            console.log("\u001B[36mWITH IMAGE:\u001B[0m");
            message.attachments.forEach((a) => {
                console.log(a.attachment);
            });
        }

        if (message.reference) {
            console.log("\u001B[36mREPLY TO:\u001B[0m");
            let replyMessage = await message.fetchReference();
            console.log(
                `\t\u001B[33m${replyMessage.createdAt.toLocaleString()}\u001B[0m <\u001B[35m${
                    replyMessage.id
                }\u001B[0m> ${replyMessage.guild.name} | ${
                    replyMessage.channel.name
                } % ${replyMessage.author.tag}:`
            );
            console.log(`\t${replyMessage.content}`);

            if (replyMessage.attachments.size > 0) {
                console.log("\t\u001B[36mWITH IMAGE:\u001B[0m");
                replyMessage.attachments.forEach((a) => {
                    console.log(`\t${a.attachment}`);
                });
            }
        }
    }
}
