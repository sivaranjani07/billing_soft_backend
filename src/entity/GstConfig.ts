import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { GstRateEnum } from "../utils/constants";

@Entity()
export class GstConfig {

    @PrimaryGeneratedColumn()
    id!: number;


    @Column({ type: "enum", enum: GstRateEnum, default: GstRateEnum.GST_0 })
    ratePercentage!: GstRateEnum

    @Column({nullable: true})
    description?: string;

    @CreateDateColumn()
    createdAt!: Date;

}
