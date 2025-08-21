import { EventSource, MessageEvent } from "@line/bot-sdk";
import { relayConfig } from "../typings/mix.js";
import discordClient from "../discord/client.js";
import { lineBlobClient, lineClient } from "./client.js";
import { Readable } from "stream";

const grabUsernameOfLineUser = async (source: EventSource) => {
  try {
    let username;

    if (source.type === "group") {
      const user = await lineClient.getGroupMemberProfile(
        source.groupId,
        source.userId!
      );
      username = user.displayName;
    }

    if (source.type === "room") {
      const user = await lineClient.getRoomMemberProfile(
        source.roomId,
        source.userId!
      );
      username = user.displayName;
    }

    return username;
  } catch (error) {
    console.log(error);
  }
};

export const sendMessageOnDiscord = async (
  eventMessage: MessageEvent,
  relayConfig: relayConfig
) => {
  const channel = discordClient.channels.cache.get(
    relayConfig.discordChannelId
  );
  if (!channel || !channel.isSendable()) return;

  const username =
    (await grabUsernameOfLineUser(eventMessage.source)) ?? "LINE User";

  const { message } = eventMessage;

  if (message.type === "text") {
    await channel.send(`**${username}**: ${message.text}`);
  }

  if (message.type === "image" || message.type === "video") {
    let imageData: string | Readable = "";

    if (message.contentProvider.type === "external")
      imageData = message.contentProvider.originalContentUrl;

    if (message.contentProvider.type === "line") {
      imageData = await lineBlobClient.getMessageContent(message.id);
    }

    await channel.send({
      content: `🖼️ **${username}**:`,
      files: [
        {
          attachment: imageData,
          name: `${username}.${message.type === "image" ? "webp" : "mp4"}`,
        },
      ],
    });
  }
};
