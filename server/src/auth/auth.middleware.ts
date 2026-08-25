import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: string;
}

export function requireAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        ) as jwt.JwtPayload;

        req.userId = payload.sub;

        next();
    } catch {
        return res.status(401).json({
            message: "Access token expired or invalid",
        });
    }
}