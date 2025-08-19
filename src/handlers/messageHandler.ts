import { InlineKeyboard } from "grammy";
import { getRedisClient } from "../helpers";
import { UserAddCommandStep } from "../shared";

export const messageHandlerCommand = "message";

export async function messageHandlerCallback(ctx: any) {
    const redis = await getRedisClient();
    const message = ctx.message.text;
    const chat_id = ctx.chat.id;

    const data = (await redis.get(`user:${chat_id}:add`)) as string | undefined;
    const userAddStatuses = JSON.parse(data || "null");

    // Agar Add button ishlavotgan bo'lsa ishlidi
    if (userAddStatuses) {
        const steps = {
            [UserAddCommandStep.TITLE]: {
                next: UserAddCommandStep.DUE_DATE,
                reply: "Vaqtni kiriting (FORMAT YYYY-MM-DD hh:mm): ",
                merge: (msg: string) => ({ title: msg }),
            },
            [UserAddCommandStep.DUE_DATE]: {
                next: UserAddCommandStep.PRIORITY,
                reply: "Darajasi kiriting:",
                merge: (msg: string) => {
                    const [year, month, day, hour, minute] = msg.match(/\d+/g)!.map(Number);
                    const dueDate = new Date(year, month - 1, day, hour, minute);
                    return { due_date: dueDate };
                },
                keyboard: new InlineKeyboard()
                    .text("Low", "priority_low")
                    .text("Medium", "priority_medium")
                    .text("High", "priority_high"),
            },
            [UserAddCommandStep.PRIORITY]: {
                next: UserAddCommandStep.ENDED,
                reply: "Jarayon tugadi ✅",
                merge: (msg: string) => ({ priority: msg }),
            },
        };
    
        const currentStep = steps[userAddStatuses.step];
        if (!currentStep) return;
    
        await redis.set(
            `user:${chat_id}:add`,
            JSON.stringify({
                step: currentStep.next,
                data: {
                    ...userAddStatuses.data,
                    ...currentStep.merge(message)
                },
            })
        );
    
        await ctx.reply(currentStep.reply, {
            reply_markup: currentStep.keyboard,
        });
    }

}
