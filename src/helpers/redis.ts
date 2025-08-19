import { createClient } from 'redis';

export async function getRedisClient () {
    const client = createClient();

    await client.connect();

    return client;
}