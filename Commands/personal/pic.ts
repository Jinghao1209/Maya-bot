import axios from "axios";
import Discord from "discord.js";
import handleError from "../../Function/handleError";
import handleRestError from "../../Function/handleRestError";
import { Commands } from "../../typings/classes";

export default {
    name: "pic",
    description: "Send a random picture",
    type: ["TEXT", "DM"],
    category: "PERSONAL",
    options: [],
    permission: "AttachFiles",
    usage: "",
    listener: async (client, message, args) => {
        if (!(message instanceof Discord.Message))
            return message
                .reply({
                    content: "THIS IS NOT A MESSAGE",
                })
                .catch(handleError);

        let fetching_text = "fetching picture";

        if (args.length === 1) {
            message
                .reply("please specify pet, ***cat***, ***dog*** or ***duck***")
                .catch(handleError);
            args.push("cat");
        }

        const msg = await message.channel.send(fetching_text),
            i = setInterval(async () => {
                await msg.edit((fetching_text += ".")).catch(handleError);
            }, 200);

        switch (args[1]) {
            case "cat":
                try {
                    const req = await axios.get("https://api.thecatapi.com/v1/images/search");
                    clearInterval(i);

                    msg.edit({
                        content: "there you go!",
                        files: [
                            {
                                attachment: req.data[0].url,
                                name: "picture.jpg",
                            },
                        ],
                    }).catch((e) => handleRestError(e, msg));
                } catch (e) {
                    handleError(e);
                }
                break;

            case "dog":
                try {
                    // const req = await axios.get("https://random.dog/woof.json");
                    const req = await axios.get("https://dog.ceo/api/breeds/image/random");
                    clearInterval(i);

                    msg.edit({
                        content: "there you go!",
                        files: [
                            {
                                // attachment: req.data.url,
                                attachment: req.data.message,
                                name: "picture.jpg",
                            },
                        ],
                    });
                } catch (e) {
                    handleError(e);
                }
                break;

            case "duck":
                try {
                    const req = await axios.get(
                        "https://random-d.uk/api/random?format=json"
                    );
                    clearInterval(i);

                    msg.edit({
                        content: "there you go!",
                        files: [
                            {
                                attachment: req.data.url,
                                name: "picture.jpg",
                            },
                        ],
                    });
                } catch (e) {
                    handleError(e);
                }
                break;

            default:
                clearInterval(i);
                msg.delete().catch(handleError);
                message
                    .reply("This pet is not supported yet!")
                    .catch(handleError);
                message.react("🥲").catch(handleError);
                break;
        }

        // for if forget to clear
        return clearInterval(i);
    },
} as Commands;
