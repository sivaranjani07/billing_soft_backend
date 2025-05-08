import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Invoice } from "./invoice";

@Entity()

export class Customer {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    mobileNumber!: string;

    @OneToMany(() => Invoice, (invoice) => invoice.customer)
    invoices!: Invoice[];

    @CreateDateColumn()
    createdAt!: Date;
}