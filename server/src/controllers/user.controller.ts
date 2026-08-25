import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware.js";
import { User } from "../models/User.js";

export async function getMe(
    req: AuthRequest,
    res: Response
) {
    const user = await User.findById(
        req.userId
    ).select("_id email createdAt");

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    return res.json({
        user,
    });
}