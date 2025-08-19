import { Bot } from "grammy";
import fs from 'fs';
import { join } from 'path';


export async function applyAllTelegramBotCommands (bot: Bot) {
    const files = fs.readdirSync(__dirname);

    for (const filename of files) {
        if (!filename.startsWith('index')) {
            const { command, callback }  = await import(join(__dirname, filename));
            bot.command(command, callback);
        }
    }
}