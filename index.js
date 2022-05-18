const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config({ debug: true });

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const { Chat } = require('./src/db/model');

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  Chat.findOrCreate({ where: { idTelegram: chatId } });
  const resp = match[1]; // the captured "whatever"
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const [chat, created] = await Chat.findOrCreate({
    where: {
      idTelegram: chatId,
      last_name: msg.chat.last_name, first_name: msg.chat.first_name
    }
  });
  console.log(msg);
  bot.sendMessage(chatId, `Received your message ${msg.chat.first_name} chat ${chat.id}`);
});

bot.on('error', (err) => {
  console.log("error pego:", err);
})