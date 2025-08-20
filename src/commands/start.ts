import { CommandContext, Context } from "grammy";
import { PostgresDataSource } from "../database";
import { User } from "../database/models";

export const command = "start"; 

export async function callback (ctx: CommandContext<Context>) {
    const { id, first_name, last_name } = ctx.chat;
    const userRepository = PostgresDataSource.getRepository(User);

    const foundedUser = await userRepository.findOneBy({ chat_id: id });

    if (!foundedUser) {
        const newUser = userRepository.create({
            chat_id: id,
            first_name,
            last_name,
        })

        await userRepository.save(newUser);

        await ctx.reply("Tizimga kiritildingiz!");
        return;
    }

    await ctx.reply(
        `✅ <b>Loyihadan foydalanishingiz mumkin!</b>

        📝 /add - Yangi TODO qo'shish
        📋 /tasks - Umumiy Tasklarni ko'rish (Tugatish va O'chirish ichida)

        ⏰ Notifikatsiya rejimi ham mavjud!`,
        { parse_mode: "HTML" }
    );
}
