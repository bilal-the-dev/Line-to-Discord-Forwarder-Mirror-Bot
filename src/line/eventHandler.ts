import { MessageEvent } from "@line/bot-sdk";
import { findRelayConfig } from "../utils/verify.js";
import { sendMessageOnDiscord } from "./functions.js";

export const handleLineMessageCreate = async (messageEvent: MessageEvent) => {
  try {
    console.log(messageEvent);

    const requiredMessageEvents = ["text", "image", "video"];
    const { message, source } = messageEvent;

    if (!requiredMessageEvents.includes(message.type)) return;

    let channelId: string = "";

    if (source.type === "user") channelId = source.userId;
    if (source.type === "group") channelId = source.groupId;
    if (source.type === "room") channelId = source.roomId;

    const relayConfig = findRelayConfig(channelId);

    if (!relayConfig)
      return console.log(`Message [LINE] (${channelId}) but no relay found!`);

    await sendMessageOnDiscord(messageEvent, relayConfig);
  } catch (error) {
    console.log(error);
  }
};
