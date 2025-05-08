import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from 'bcryptjs'
import { plainToClass, plainToInstance } from "class-transformer";
import { RegisterDTO } from "../dtos/RegisterDTO";
import { validate } from "class-validator";
import { generateToken } from "../utils/generateToken,";
import { LoginDTO } from "../dtos/LoginDTO";
import { sendErrorResponse, sendResponse } from "../utils/responseHandler";


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const registerData = plainToClass(RegisterDTO, req.body);
        const errors = await validate(registerData);
        if (errors.length > 0) {
            return sendErrorResponse(res, errors, "Validation failed", 400)
        }

        const { userName, email, password } = req.body
        const userRepo = AppDataSource.getRepository(User);
        const existingUser = await userRepo.findOne({ where: { email } });
        if (existingUser) {
            return sendErrorResponse(res, {}, 'User already exists', 400);
        }
        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = userRepo.create({ userName, email, password: hashPassword })
        await userRepo.save(newUser)
        return sendResponse(res, {}, 'User registered successfully', 201);

    } catch (error) {
        return sendErrorResponse(res, error, "Something went wrong", 500)

    }

}


export const loginUser = async (req: Request, res: Response) => {
    const loginData = plainToInstance(LoginDTO, req.body);
    const errors = await validate(loginData);

    if (errors.length > 0) {
        return sendErrorResponse(res, errors, "Validation failed", 400)
    }

    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
        return sendErrorResponse(res, {}, 'User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return sendErrorResponse(res, {}, 'Invalid credentials', 401);
    }

    const token = generateToken(user.id);
    return sendResponse(res, { token }, 'Login successful', 200);
};