import { CommandContext, Context } from "grammy";
import { getRedisClient } from "../helpers";
import { UserAddCommandStep } from "../shared";

export const command = "add"; 

export async function callback(ctx: CommandContext<Context>) {
    const redis = await getRedisClient();
    const chat_id = ctx.chat.id;

    await redis.set(`user:${chat_id}:add`, JSON.stringify({
        step: UserAddCommandStep.TITLE,
        time: Date.now(),
        data: {},
    }));

    await ctx.reply("✅ Yangi vazifa qo'shmoqchisiz. Iltimos, vazifa nomini kiriting:");
}
