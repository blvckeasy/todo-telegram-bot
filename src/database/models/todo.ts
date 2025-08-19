import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";
import { TodoPriority, TodoStatus } from "../../shared";

@Entity({ name: "todos" })
export class Todo {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    title: string;

    @Column({ type: "timestamp" })
    due_date: Date; 

    @Column({
        type: "enum",
        enum: TodoPriority,
        default: TodoPriority.LOW,
    })
    priority: TodoPriority;

    @Column({
        type: "enum",
        enum: TodoStatus,
        default: TodoStatus.NOT_COMPLATED,
    })
    status: TodoStatus;

    @ManyToOne(() => User, (user) => user.todos, { onDelete: "CASCADE" })
    user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
