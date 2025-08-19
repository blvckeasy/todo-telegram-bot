import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PostgresDataSource } from "../index";
import { Todo } from "./todo";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: true })
    first_name?: string;

    @Column({ nullable: true })
    last_name: string;

    @Column("bigint")
    chat_id: number;

    @OneToMany(() => Todo, (todo) => todo.user)
    todos: Todo[];
}