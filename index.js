const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config({ debug: true });
const { pesquisa, sugestao } = require('./src/lib/signo');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const { Log } = require('./src/db/model');

bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  Chat.findOrCreate({ where: { idTelegram: chatId } });
  const resp = match[1]; // the captured "whatever"
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/su (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1]; 
  
  sugestao(resp).then(r =>{
    console.log(r);
    bot.sendMessage(chatId, JSON.stringify(r));
  });

})
bot.onText(/\/si (.+)/, (msg, match) => {

  const chatId = msg.chat.id;

  const resp = match[1]; // the captured "whatever"
  Log.create({consulta:resp, idTelegram:chatId});
  pesquisa(resp).then(r=>bot.sendMessage(chatId, JSON.stringify(r)))
});


bot.on('error', (err) => {
  console.log("error pego:", err);
})