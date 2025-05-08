import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { GstConfig } from "./GstConfig";
@Entity()
export class Products {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    salesPrice!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    mrpPrice!: number;

    @Column('int')
    quantity!: number;

    @Column()
    unit!: string;

    @Column()
    barcode!: string;


    @Column('bytea')
    barcodeImagePath!: Buffer;

    @Column()
    gstRate?: number;

} 