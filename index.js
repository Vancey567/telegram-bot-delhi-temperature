import dotenv from 'dotenv';
dotenv.config();
import fetch from "node-fetch";

import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';

const token = process.env.TELEGRAM_BOT;
const X_API_KEY = process.env.X_API_KEY;
const chatId = process.env.CHAT_ID;
const bot = new TelegramBot(token, {polling: true});

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
        const message = `The current temperature in New Delhi is ${temperature}°C`;
        console.log(message);
        fs.appendFileSync('log.log', message + '\n');
        bot.sendMessage(chatId, message);
    } catch (error) {
        const errorMessage = 'Error fetching weather data: ' + error;
        console.error(errorMessage);
        fs.appendFileSync('error.log', errorMessage + '\n');
        return bot.sendMessage(chatId, errorMessage);
    }
}

setInterval(sendTemperature, 60 * 60 * 1000);

bot.on('message', (msg) => {
    if (msg.text.toString().toLowerCase().indexOf('/temperature') === 0) {
      sendTemperature();
    }
});

bot.on("polling_error", (msg) => console.log(msg));