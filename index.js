const TelegramBot = require('node-telegram-bot-api');
const moment = require("moment");
require("dotenv").config({ debug: true });
const { pesquisa, sugestao } = require('./src/lib/signo');
const fs = require('fs');
const express = require('express');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const { Log } = require('./src/db/model');
bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id, "Welcome");

});
bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  bot.sendMessage(chatId, resp);
});
bot.onText(/\/su (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1];

  sugestao(resp).then(r => {
    const resposta = r.map((value) => (value.snippet.search(/(born|nascimento)/ig)>0?[`/si ${value.title}`]:undefined))
    console.log(resposta)
    bot.sendMessage(chatId, "sugestao", {
      reply_markup: {
        keyboard: resposta
      }
    });
  });

})
bot.onText(/\/si (.+)/, (msg, match) => {

  const chatId = msg.chat.id;

  const resp = match[1]; // the captured "whatever"

  pesquisa(resp).then(r => {
    if (r.signo) {
      Log.create({ consulta: resp, idTelegram: chatId, resposta: JSON.stringify(r) });
      console.log(r)
      const birthDate = moment(r.info.birthDate.date).format("MMM, D YYYY");
      //bot.sendPhoto(chatId, r.imagem);
      bot.sendMessage(chatId, `<b>${r.info.name}</b>\nBirthday ${birthDate} \nAge  ${r.info.birthDate.age}\nSign ${r.signo.signo}\n<a href='${r.url}'>more info</a>`, { parse_mode: 'HTML' });
    }
    else {
      bot.sendMessage(chatId, `not found \u{1F631}`, { parse_mode: 'HTML' });

    }
  })
});

bot.on("text", (msg) => {
  const chatId = msg.chat.id;

  sugestao(msg.text).then(r => {
    console.log(r);
    r.forEach(( value) => { 
      if(value.snippet.search(/born/ig)>0)
        bot.sendMessage(chatId, `/si ${value.title}`)})
  })
});

bot.on('error', (err) => {
  console.log("error pego:", err);
})