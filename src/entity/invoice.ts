import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from "typeorm";
import { Customer } from "./Customer";
import { InvoiceItem } from "./billgenerate";
@Entity()
export class Invoice {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Customer, (customer) => customer.invoices)
    customer!: Customer;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    grossAmount!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    finalAmount!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    discount!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    cgstAmount!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    sgstAmount!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    igstAmount!: number;

    @Column()
    totalQuantity!: number;

    @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
    items!: InvoiceItem[];

    @CreateDateColumn()
    createdAt!: Date;
}