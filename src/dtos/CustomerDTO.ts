import { IsString, IsNotEmpty } from 'class-validator';

export class CustomerDTO {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    mobileNumber!: string;
}
