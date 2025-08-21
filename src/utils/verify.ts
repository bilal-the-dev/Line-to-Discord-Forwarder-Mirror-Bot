import { relayConfig } from "../typings/mix.js";
import { config } from "./constants.js";

export const findRelayConfig = (
  channelId: string
): relayConfig | undefined => {
  const found = Object.entries(config).find((keyVal) => {
    const [discordChId, lineChId] = keyVal;
    return channelId === discordChId || channelId === lineChId;
  });

  if (!found) return;

  return { discordChannelId: found[0], lineChannelId: found[1] };
};
