import { IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class ProductDTO {
    @IsNotEmpty()
    name!: string;

    @IsNumber({}, { message: 'Sales Price must be a number' })
    @Min(0)
    salesPrice!: number;

    
    @IsNumber({}, { message: 'MRP Price must be a number' })
    @Min(0)
    mrpPrice!: number;

    @IsNumber()
    @Min(0, { message: 'Quantity must be a positive number' })
    quantity!: number;

    @IsOptional()
    description?: string;

    @IsOptional()
    unit?: string;

    @IsNumber()
    gstRate!: number;
}
