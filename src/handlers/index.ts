import { Bot } from "grammy";
import { messageHandlerCommand, messageHandlerCallback } from "./messageHandler";
import { addTodoPriorityCallbackQuery, updateTodoStatusCallbackQuery } from "./callbackQueryHandler";


export async function applyAllTelegramBotHandlers (bot: Bot) {
    bot.on(messageHandlerCommand, messageHandlerCallback);

    bot.callbackQuery(/^priority_.+$/, addTodoPriorityCallbackQuery);
    bot.callbackQuery(/^todo:.+$/, updateTodoStatusCallbackQuery);
}