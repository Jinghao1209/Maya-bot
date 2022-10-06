import Discord from 'discord.js';
import handleError from './handleError';

export default function handleRestError(e: any, message: Discord.Message) {
    let embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setTitle(`ERROR: ${e.code}`)
        .setDescription("Errors:")
        .setFields({
            name: `\`${e.code}\``,
            value: `***${e.message}***`,
        });

    message.author.send({ embeds: [embed] }).catch(handleError);
}
