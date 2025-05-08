import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class InvoiceDTO {
    @IsNotEmpty()
    @IsString()
    name!: string;
    
    @IsEmail()
    email!: string;
    
    // Add other properties and validation decorators as needed
}
