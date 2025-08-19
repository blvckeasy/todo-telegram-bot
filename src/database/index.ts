import { DataSource } from "typeorm"
import config from "../config";
import { Todo, User } from "./models";


export const PostgresDataSource = new DataSource({
    ...config.database,
    entities: [User, Todo],
    synchronize: true,
});

export * from './models';