import { Message, TextChannel } from "discord.js";
import { relayConfig } from "../typings/mix.js";
import { lineClient } from "../line/client.js";
import { randomUUID } from "node:crypto";

export const transformMentions = (message: Message): void => {
  let content = message.content;

  // Replace role mentions with @RoleName
  message.mentions.roles.forEach((role) => {
    content = content.replaceAll(`<@&${role.id}>`, `@${role.name}`);
  });

  // Replace channel mentions with #channelName
  message.mentions.channels.forEach((channel) => {
    content = content.replaceAll(
      `<#${channel.id}>`,
      `#${(channel as TextChannel).name}`
    );
  });

  // Replace user mentions with @Username
  message.mentions.users.forEach((user) => {
    content = content.replaceAll(`<@${user.id}>`, `@${user.username}`);
  });

  message.content = content;
};

const retryLinePushMessage = async (
  payload: Parameters<typeof lineClient.pushMessage>[0],
  retries = 3
): Promise<void> => {
  let attempt = 0;

  const retryKey = randomUUID();

  while (attempt < retries) {
    try {
      await lineClient.pushMessage(payload, retryKey);
      return;
    } catch (error) {
      console.log(error);

      attempt++;
    }
  }
};

export const sendMessageOnLine = async (
  message: Message,
  relayConfig: relayConfig
) => {
  const messagesToSend: any[] = [];

  // Include the cleaned text message if it exists
  if (message.content.trim()) {
    messagesToSend.push({
      type: "text",
      text: `${message.author.displayName}: ${message.content}`,
    });
  }

  // Get up to 4 image/video attachments
  const mediaAttachments = Array.from(message.attachments.values())
    .filter((attachment) => {
      const contentType = attachment.contentType || "";
      return (
        contentType.startsWith("image/") || contentType.startsWith("video/")
      );
    })
    .slice(0, 5); // limit to 4

  for (const attachment of mediaAttachments) {
    const contentType = attachment.contentType || "";

    if (contentType.startsWith("image/")) {
      messagesToSend.push({
        type: "image",
        originalContentUrl: attachment.url,
        previewImageUrl: attachment.url,
      });
    } else if (contentType.startsWith("video/")) {
      messagesToSend.push({
        type: "video",
        originalContentUrl: attachment.url,
        previewImageUrl: attachment.url,
      });
    }
  }

  if (messagesToSend.length > 5) messagesToSend.splice(4); // if text and 4+ media then remove last media

  // Push the message(s) to LINE
  if (messagesToSend.length > 0) {
    await retryLinePushMessage({
      to: relayConfig.lineChannelId,
      messages: messagesToSend,
    });
  }
};
