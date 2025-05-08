import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDTO {
    @IsNotEmpty()
    userName!: string;

    @IsEmail()
    email!: string;

    @MinLength(6, { message: "Password must be at least 6 characters long" })
    password!: string;
}