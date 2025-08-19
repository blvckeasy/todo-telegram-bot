import dotenv from 'dotenv';
import { join } from 'path';
import { Todo, User } from '../database';

dotenv.config({
    path: join(process.cwd(), 'src', 'environments', `.env.${process.env.NODE_ENV}`),
})

export default {
    bot: {
        token: process.env.TELEGRAM_BOT_TOKEN,
    },
    database: {
        type: process.env.DATABASE_TYPE as "postgres",
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
}
