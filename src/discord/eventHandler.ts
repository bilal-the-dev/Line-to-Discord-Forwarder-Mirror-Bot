import { Client, Message } from "discord.js";
import { findRelayConfig } from "../utils/verify.js";
import { sendMessageOnLine, transformMentions } from "./functions.js";

export const handleDiscordReady = async (readyClient: Client<true>) =>
  console.log(
    `Discord bot logged in as ${readyClient.user.tag} (${readyClient.user.id})`
  );

export const handleDiscordMessageCreate = async (message: Message) => {
  try {
    const { author, client, channel } = message;

    if (author.id === client.user.id) return; // ignore our bot own messages

    // Now, we check if message is sent in our forwarded channels

    const relayConfig = findRelayConfig(channel.id);

    if (!relayConfig)
      return console.log(
        `Message [Discord] (${channel.id}) but no relay found!`
      );

    transformMentions(message);

    await sendMessageOnLine(message, relayConfig);
  } catch (error) {
    console.log(error);
  }
};
