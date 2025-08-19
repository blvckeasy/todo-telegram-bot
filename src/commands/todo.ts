import { CommandContext, Context, InlineKeyboard } from "grammy";
import { PostgresDataSource, Todo, User } from "../database";
import { TodoStatus } from "../shared";

export const command = "tasks";

export async function callback(ctx: CommandContext<Context>) {
    const userRepository = PostgresDataSource.getRepository(User);
    const todoRepository = PostgresDataSource.getRepository(Todo);

    const chat_id = ctx.chat.id;
    const user = await userRepository.findOneBy({ chat_id });

    const todos = await todoRepository.findBy({ user });

    if (!todos.length) {
        ctx.reply("Afsuski sizda hech qanday TODO topilmadi 😐");
        return;
    }

    for (const todo of todos) {
        const keyboard = new InlineKeyboard();

        if (todo.status === TodoStatus.NOT_COMPLATED) {
            keyboard
                .text("Tugallandi", `todo:${TodoStatus.COMPLATED}:${todo.id}`)
                .text("O'chirish", `todo:${TodoStatus.DELETED}:${todo.id}`);
        }

        const dueDate = todo.due_date;
        const formattedDate = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')} ${String(dueDate.getHours()).padStart(2, '0')}:${String(dueDate.getMinutes()).padStart(2, '0')}`;

        ctx.reply(
            `
        📌 <b>${todo.title}</b>

        ⏰ Vaqti: ${formattedDate}
        🔥 Darajasi: ${todo.priority}
        ✅ Holati: ${todo.status}
        `,
            {
                parse_mode: "HTML",
                reply_markup: keyboard,
            }
        );
    }
}
