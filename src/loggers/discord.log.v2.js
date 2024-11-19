"use strict";
const { Client, GatewayIntentBits } = require("discord.js");

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    // add channelid
    this.channelId = "1303982262576087149";

    this.client.on("ready", () => {
      console.log("Logged is as ", this.client.user.tag);
    });

    this.client.login(
      "MTMwMzk4MTE0Nzg4NTQwNDE3MA.GhkJzN.cz - YWoQ5J0WGaLsDMdIpOTkAw7T2dOOGxIGRws"
    );
  }

  sendToMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelId);

    if (!channel) {
      console.error(`Counldn't find the channel...`, this.channelId);
    }

    channel.send(message).catch((e) => console.error(e));
  }

  sendToFormatCode(logData) {
    const {
      code,
      message = "This is additional information about the code.",
      title = "Code Example",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    this.sendToMessage(codeMessage);
  }
}

module.exports = new LoggerService();
