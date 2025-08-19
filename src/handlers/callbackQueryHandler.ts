import { PostgresDataSource, User } from "../database";
import { Todo } from "../database";
import { getRedisClient } from "../helpers";


export async function addTodoPriorityCallbackQuery (ctx: any) {
    const userRepository = PostgresDataSource.getRepository(User);
    const todoRepository = PostgresDataSource.getRepository(Todo);
    
    const redis = await getRedisClient();

    const chat_id = ctx.chat.id;
    const user = await userRepository.findOneBy({ chat_id });
    
    const priority = ctx.callbackQuery.data.replace("priority_", "");

    const data = await redis.get(`user:${chat_id}:add`) as string | undefined;
    const userAddStatuses = JSON.parse(data || "null");

    if (userAddStatuses) {
        const newTodo = {
            ...userAddStatuses.data,
            priority,
            user: user.id,
        };

        await todoRepository.save(newTodo);
        await redis.del(`user:${chat_id}:add`);
    }

    await ctx.reply(`✅ Todo Yaratilindi!`);
    await ctx.answerCallbackQuery();
}

export async function updateTodoStatusCallbackQuery (ctx: any) {
    const [_, status, todo_id] = ctx.callbackQuery.data.split(":");

    const todoRepository = PostgresDataSource.getRepository(Todo);

    const foundedTodo = await todoRepository.findOneBy({ id: todo_id });

    if (!foundedTodo) {
        ctx.reply("Todo Topilmadi!");
        return;
    }

    foundedTodo.status = status;

    await todoRepository.save(foundedTodo);

    await ctx.editMessageText(`
        <b>${
            foundedTodo.title
        }</b>\n\nVaqti: ${
            foundedTodo.due_date.toISOString().split("T").join(" ")
        }\nDarajasi: ${
            foundedTodo.priority
        }\nHolati: ${foundedTodo.status}
    `,
        {
            parse_mode: "HTML",
            reply_markup: null,
        }
    );

    await ctx.reply(`✅ Todo ${status} bo'ldi!`);
    await ctx.answerCallbackQuery();
}