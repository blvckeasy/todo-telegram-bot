import { Bot } from 'grammy';
import { applyAllTelegramBotCommands } from './commands';
import { PostgresDataSource } from './database';
import { applyAllTelegramBotHandlers } from './handlers';
import { notificationJobForNotComplatedTodos } from './jobs';
import config from './config';


async function main () {

    // postgres databaza initalize qilingan
    await PostgresDataSource.initialize();
    
    const token = config.bot.token;

    const bot = new Bot(token);

    await applyAllTelegramBotCommands(bot);
    await applyAllTelegramBotHandlers(bot);

    // notification yuboradi
    await notificationJobForNotComplatedTodos(bot);

    bot.start();
    console.log("Bot ishga tushdi!");
}

main();