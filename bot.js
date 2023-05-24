onst Eris = require("eris");
const { Configuration, OpenAIApi } = require("openai");
const keepAlive = require("./server");
require('dotenv').config()

const configuration = new Configuration({
  apiKey: "Open AI API Key",
});
const openai = new OpenAIApi(configuration);

const bot = new Eris("BotToken", {
  intents: [
    "guildMessages"
  ]
});

async function runCompletion(message) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    max_tokens: 200,
  });
  return completion.data.choices[0].text;
}

bot.on("ready", () => {
  console.log("Bot is connected and ready!");
});

bot.on("error", (err) => {
  console.error(err);
});

bot.on("messageCreate", (msg) => {
  if (msg.content.startsWith("#")) {
    runCompletion(msg.content.substring(1)).then(result => bot.createMessage(msg.channel.id, result));
  }
});
keepAlive();
bot.connect();
