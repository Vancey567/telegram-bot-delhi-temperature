import dotenv from 'dotenv';
dotenv.config();
import fetch from "node-fetch";
import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';

import ChatService from './Services/ChatService.js';
import dbConnect from './Database/database.js';

const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const URL = process.env.MONGOURI || `mongodb+srv://${USER}:${PASSWORD}@telegrambot.0hwpfpu.mongodb.net/?retryWrites=true&w=majority`

dbConnect(URL);

const token = process.env.TELEGRAM_BOT;
const X_API_KEY = process.env.X_API_KEY;
const bot = new TelegramBot(token, {polling: true});
let chatId;
let hasChatId = false;

const city = "delhi";

const url = 'https://api.api-ninjas.com/v1/weather?city=' + city
const options = {
    headers: {
      'X-Api-Key': X_API_KEY
    },
}

async function sendTemperature() {
    try {
        const res = await fetch(url, options);
        const data = await res.json();

        const temperature = data.temp;
        const message = `The current temperature in Delhi is ${temperature}°C`;
        console.log(message);
        fs.appendFileSync('log.log', message + '\n');

        if(hasChatId) {
            bot.sendMessage(chatId, message);
            hasChatId = false;
        } else {
            const allChatId = await ChatService.getAllChat();
            allChatId && allChatId.forEach((user) => {
                bot.sendMessage(user.chatId, message);
            })
        }
    } catch (error) {
        const errorMessage = 'Error fetching weather data: ' + error;
        console.error(errorMessage);
        fs.appendFileSync('error.log', errorMessage + '\n');
        return bot.sendMessage(chatId, errorMessage);
    }
}

// setInterval(sendTemperature, 20 * 1000); // 1min
setInterval(sendTemperature, 60 * 60 * 1000); // 1hr

bot.on('message', async (msg) => {
    chatId = msg.chat.id;
    hasChatId = true;
    const exists = await ChatService.checkExists(chatId);
    if(!exists) {
        ChatService.saveChatId(chatId);
    }

    if (msg.text.toString().toLowerCase().indexOf('/temperature') === 0) {
      sendTemperature();
    }
});

let message = `Here is a list of commands:
/help - Show all the available commands
/temperature - Gives the temperature update of delhi 
/stop - Opt out of the hourly temperature update
/start - Get the hourly updates
`

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, message);
});

bot.onText(/\/start/, async(msg) => {
    const chatId = msg.chat.id;
    hasChatId = true;
    const exists = await ChatService.checkExists(chatId);
    if(!exists) {
        ChatService.saveChatId(chatId);
    }
    bot.sendMessage(chatId, message);
})

bot.onText(/\/stop/, async (msg) => {
    const chatId = msg.chat.id;
    const removed = await ChatService.removeChatId(chatId);
    if(removed) {
        bot.sendMessage(chatId, "You will no longer receive the temperature updates, Thank You!!");
    } else {
        bot.sendMessage(chatId, "Something Went wrong, Try again!!");
    }
})

bot.on("polling_error", (msg) => console.log(msg));