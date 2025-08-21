import express, { Request } from "express";
import * as line from "@line/bot-sdk";
import { handleLineMessageCreate } from "./eventHandler.js";

export const lineClient = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
});

export const lineBlobClient = new line.messagingApi.MessagingApiBlobClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
});

const app = express();

// Middelwares
app.use(express.json());

app.post(
  "/line/callback",
  async (req: Request<{}, {}, line.WebhookRequestBody>, res) => {
    for (const event of req.body.events) {
      if (event.type !== "message") continue;
      await handleLineMessageCreate(event);
    }

    res.json({});
  }
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port} for line webhook!`);
});
