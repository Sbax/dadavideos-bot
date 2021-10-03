require("dotenv").config();
const fsp = require("fs").promises;
const { Client, Intents } = require("discord.js");
let { activeChannel } = require("../config.json");

const token = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.login(token);

/*
 * Commands:
 * !channel: registers current channel as activeChannel and saves it to config.json for future uses
 *
 * Behaviour:
 * When a message is received in the activeChannel a callback specified using startBot is triggered
 */

const saveActiveClient = async (channel) => {
  return fsp
    .writeFile(
      "./config.json",
      JSON.stringify({
        activeChannel: channel,
      })
    )
    .then(() => ({}))
    .catch((error) => ({ error }));
};

const listenToMessages = (callback = () => {}) => {
  client.on("messageCreate", async (message) => {
    const { content, author, channel, member } = message;
    if (author.bot) return;

    const [prefix] = content;

    if (
      prefix === "!" &&
      content.length !== 1 &&
      member.permissions.has("ADMINISTRATOR") // only administrator users can use commands
    ) {
      // handle a command
      const [_, ...commandSplit] = content;
      const command = commandSplit.join("");

      if (command === "channel") {
        const { error } = await saveActiveClient(channel.id);

        if (error) {
          console.error(error);
          channel.send("Couldn't save changes, try again");
          return;
        }

        activeChannel = channel.id;
        channel.send(`Set active channel as ${channel.name}`);
        return;
      }

      return;
    }

    if (channel.id === activeChannel) {
      callback(message);

      return;
    }

    return;
  });
};

// reaction should be an emote like 🍌 or 🍆
const tagMessage = (message, reaction) => message.react(reaction);

const getLatestMessagesInChannel = (limit = 100) => {
  const channel = client.channels.cache.get(activeChannel);

  return new Promise((resolve) => {
    channel.messages.fetch({ limit }).then((messages) => resolve(messages));
  });
};

module.exports = {
  listenToMessages,
  tagMessage,
  getLatestMessagesInChannel,
};
