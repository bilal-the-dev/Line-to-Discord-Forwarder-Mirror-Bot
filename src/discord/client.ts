import { Client, GatewayIntentBits } from "discord.js";
import {
  handleDiscordMessageCreate,
  handleDiscordReady,
} from "./eventHandler.js";

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

discordClient.once("ready", handleDiscordReady);

discordClient.on("messageCreate", handleDiscordMessageCreate);

discordClient.login(process.env.DISCORD_TOKEN);

export default discordClient;
