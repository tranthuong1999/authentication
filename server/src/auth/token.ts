import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRES = "10m";

const REFRESH_TOKEN_EXPIRES =
    7 * 24 * 60 * 60 * 1000;

export function createAccessToken(
    userId: string
) {
    return jwt.sign(
        {
            sub: userId,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: ACCESS_TOKEN_EXPIRES,
        }
    );
}

export function createRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(
    refreshToken: string
) {
    return crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
}

export function getRefreshTokenExpiration() {
    return new Date(
        Date.now() + REFRESH_TOKEN_EXPIRES
    );
}