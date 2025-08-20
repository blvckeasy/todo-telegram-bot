import cron from "node-cron";
import { Equal, Not } from "typeorm";
import { PostgresDataSource, Todo } from "../database";
import { Bot } from "grammy";
import { TodoStatus } from "../shared";


export async function notificationJobForNotComplatedTodos(bot: Bot) {
    // har 1 daqiqada tekshiradi
    cron.schedule("* * * * *", async () => {
        const todoRepository = PostgresDataSource.getRepository(Todo);

        const now = new Date(new Date().setSeconds(0, 0)); // sekund bilan millisekundni 0 ga tushiradi

        const todos = await todoRepository.find({
            where: {
                due_date: Equal(now),
                status: Not(TodoStatus.COMPLATED),
            },
            relations: ["user"]
        });

        for (const todo of todos) {
            await bot.api.sendMessage(
                todo.user.chat_id,
                `⏰ Eslatma: "${todo.title}" vazifasi vaqti keldi!`
            );
            await todoRepository.save(todo);
        }
    });
}
