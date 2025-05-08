import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Invoice } from "./invoice";
@Entity()
export class InvoiceItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Invoice, invoice => invoice.items)
    invoice!: Invoice;

    @Column()
    productName!: string;

    @Column()
    quantity!: number;

    @Column()
    unit!: string;

    @Column()
    gstRate!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    salesPrice!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    mrpPrice!: number;

    @Column('decimal', { precision: 12, scale: 2 })
    total!: number;


} 