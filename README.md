# Line to Discord and Discord to Line Mirror Bot

A bot that **mirrors messages** between Discord channels and Line – including **text, images, files, and emojis** – in real-time.

An example of mirrored messages on both platforms.

![discord](https://github.com/bilal-the-dev/Line-to-Discord-Forwarder-Mirror-Bot/blob/master/discord.PNG?raw=true)
![line](https://github.com/bilal-the-dev/Line-to-Discord-Forwarder-Mirror-Bot/blob/master/line.WEBP?raw=true)

## 🚀 Features

- 🔄 Mirrors messages between channels both ways (vice versa).
- 🖼️ Supports **images, files, and emojis**.
- ⚡ Lightweight & easy setup with Node.js.

## 📦 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/bilal-the-dev/Line-to-Discord-Forwarder-Mirror-Bot mirror-bot
cd mirror-bot
npm install
```

## ⚙️ Configuration

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
CHANNEL_SECRET=xxx
CHANNEL_ACCESS_TOKEN='xx+x/x/x+xxx/xxx/x='
DISCORD_TOKEN='x.xxx.xx'
```

### 2. Channel Mapping

Set up your `config.json` file to define **Discord channel → Line Channel** mappings:

```json
{
  "1395817447382188042": "C96d3d16decb33fcb662f876808776d4c",
  "1395550949866737715": "Caff1e892a85826f8e1dca20324b25f38",
  "1395555255760195794": "Cf1e4329c30e497fa9992b2973fa35eb4"
}
```

- Keys = **Discord channel IDs**
- Values = **Line Channel/room IDs**

## ▶️ Running

Start the bot:

```bash
npm start
```

## 📝 Example

- When a user sends `Hello 👋` in a **Discord channel**, the same message appears in the mapped **LINE group**.
- When an **image** is sent on LINE, it will be mirrored to the corresponding Discord channel.

## 📜 License

MIT License © 2025
