"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged is as ${client.user.tag}`);
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (msg.content === "hello") {
    msg.reply("Hello sir!");
  }
});

const token =
  "MTMwMzk4MTE0Nzg4NTQwNDE3MA.Gwvlh6.FwW81LOB9GADLq6C-Zvr_s9mjXanEdGDpMHpKI";
client.login(token);
