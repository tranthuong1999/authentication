// services/session.service.ts

import {
    createAccessToken,
    createRefreshToken,
    getRefreshTokenExpiration,
    hashRefreshToken,
} from "../auth/token.js";

import { setAuthCookies } from "../auth/cookies.js";
import { Session } from "../models/Session.js";
import type { Response } from "express";

export async function createSession(
    userId: string,
    res: Response
) {
    // 1. Access Token
    const accessToken =
        createAccessToken(userId);

    // 2. Refresh Token
    const refreshToken =
        createRefreshToken();

    // 3. Hash Refresh Token
    const refreshTokenHash =
        hashRefreshToken(refreshToken);

    // 4. Lưu session
    await Session.create({
        userId,
        refreshTokenHash,
        expiresAt:
            getRefreshTokenExpiration(),
    });

    // 5. Set Cookie
    setAuthCookies(
        res,
        accessToken,
        refreshToken
    );

    return {
        accessToken,
        refreshToken,
    };
}