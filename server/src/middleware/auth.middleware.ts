import {
    NextFunction,
    Request,
    Response,
} from "express";

import jwt from "jsonwebtoken";

export interface AuthRequest
    extends Request {
    userId?: string;
}

export function requireAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const accessToken =
        req.cookies.access_token;

    if (!accessToken) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    try {
        const payload =
            jwt.verify(
                accessToken,
                process.env
                    .ACCESS_TOKEN_SECRET!
            ) as jwt.JwtPayload;

        if (!payload.sub) {
            return res.status(401).json({
                message: "Invalid token",
            });
        }

        req.userId = payload.sub;

        next();
    } catch {
        return res.status(401).json({
            message:
                "Access token expired or invalid",
        });
    }
}