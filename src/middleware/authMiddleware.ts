import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendErrorResponse } from '../utils/responseHandler';

const secretKey = process.env.JWT_SECRET_KEY ?? 'Billing_secret';

declare module 'express-serve-static-core' {
    interface Request {
      user?: string | JwtPayload;
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        sendErrorResponse(res, {}, 'Unauthorized, Token not provided', 401);
        return; // Ensure the function returns void
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach the decoded token to the request object
        next();
    } catch (error) {
        sendErrorResponse(res, error, 'Unauthorized, Token expired or invalid', 401);
        return; // Ensure the function returns void
    }
};