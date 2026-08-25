import { Response } from "express";

const isProduction =
    process.env.NODE_ENV === "production";

export function setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
) {
    res.cookie(
        "access_token",
        accessToken,
        {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
            path: "/",
        }
    );

    res.cookie(
        "refresh_token",
        refreshToken,
        {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        }
    );
}

export function clearAuthCookies(
    res: Response
) {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
    });

    res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
    });
}