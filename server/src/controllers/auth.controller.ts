import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { createAccessToken, hashRefreshToken } from "../auth/token.js";
import { clearAuthCookies, setAuthCookies } from "../auth/cookies.js";
import { Session } from "../models/Session.js";
import { createSession } from "../services/session.service.js";
import { CLIENT_URL, googleClient } from "../auth/google.js";


function redirectWithGoogleError(
    page: "login" | "register",
    error: string,
    res: Response
) {
    const path =
        page === "register"
            ? "/register"
            : "/login";

    return res.redirect(
        `${CLIENT_URL}${path}?error=${error}`
    );
}

function getGoogleAuthUrl(
    intent: "register" | "login"
) {
    return googleClient.generateAuthUrl({
        access_type: "offline",
        scope: [
            "openid",
            "email",
            "profile",
        ],
        prompt: "select_account",
        state: intent,
    });
}

export function googleRegister(
    _req: Request,
    res: Response
) {
    const url = getGoogleAuthUrl("register");

    return res.redirect(url);
}

export function googleLogin(
    _req: Request,
    res: Response
) {
    const url = getGoogleAuthUrl("login");

    return res.redirect(url);
}


export async function googleCallback(
    req: Request,
    res: Response
) {
    const intent =
        req.query.state === "register"
            ? "register"
            : "login";

    try {
        const { code, error } = req.query;

        if (error) {
            return redirectWithGoogleError(
                intent,
                "google_auth_cancelled",
                res
            );
        }

        if (!code || typeof code !== "string") {
            return redirectWithGoogleError(
                intent,
                "google_auth_failed",
                res
            );
        }

        if (
            req.query.state !== "register" &&
            req.query.state !== "login"
        ) {
            return redirectWithGoogleError(
                "login",
                "google_auth_failed",
                res
            );
        }

        const { tokens } =
            await googleClient.getToken(code);

        const idToken = tokens.id_token;

        if (!idToken) {
            return redirectWithGoogleError(
                intent,
                "google_auth_failed",
                res
            );
        }

        const ticket =
            await googleClient.verifyIdToken({
                idToken,
                audience:
                    process.env.GOOGLE_CLIENT_ID,
            });

        const payload =
            ticket.getPayload();

        if (!payload) {
            return redirectWithGoogleError(
                intent,
                "google_auth_failed",
                res
            );
        }

        const {
            sub: googleId,
            email,
            email_verified,
        } = payload;

        if (!email || !email_verified) {
            return redirectWithGoogleError(
                intent,
                "google_email_unverified",
                res
            );
        }

        const user = await User.findOne({ email });

        if (intent === "register") {
            if (user) {
                return redirectWithGoogleError(
                    "register",
                    "google_account_exists",
                    res
                );
            }

            const newUser = await User.create({
                email,
                googleId,
            });

            await createSession(
                newUser._id.toString(),
                res
            );

            return res.redirect(CLIENT_URL);
        }

        if (!user) {
            return redirectWithGoogleError(
                "login",
                "google_account_not_found",
                res
            );
        }

        if (!user.googleId) {
            return redirectWithGoogleError(
                "login",
                "google_password_account",
                res
            );
        }

        if (user.googleId !== googleId) {
            return redirectWithGoogleError(
                "login",
                "google_account_mismatch",
                res
            );
        }

        await createSession(
            user._id.toString(),
            res
        );

        return res.redirect(CLIENT_URL);
    } catch (error) {
        console.error(error);

        return redirectWithGoogleError(
            intent,
            "google_auth_failed",
            res
        );
    }
}


export async function register(
    req: Request,
    res: Response
) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required",
            });
        }

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 12);

        const user = await User.create({
            email,
            password: hashedPassword,
        });

        // Tạo session + token + cookie
        await createSession(
            user._id.toString(),
            res
        );

        return res.status(201).json({
            message: "Register successfully",

            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}



export async function login(
    req: Request,
    res: Response
) {
    try {
        const { email, password } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const passwordMatched =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatched) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        // Tạo session + token + cookie
        await createSession(
            user._id.toString(),
            res
        );

        return res.json({
            message: "Login successfully",

            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


export async function refresh(
    req: Request,
    res: Response
) {
    try {
        const refreshToken =
            req.cookies.refresh_token;

        if (!refreshToken) {
            return res.status(401).json({
                message:
                    "Refresh token not found",
            });
        }

        const refreshTokenHash =
            hashRefreshToken(refreshToken);

        const session =
            await Session.findOne({
                refreshTokenHash,
            });

        if (!session) {
            return res.status(401).json({
                message:
                    "Invalid refresh token",
            });
        }

        if (
            session.expiresAt < new Date()
        ) {
            await Session.deleteOne({
                _id: session._id,
            });

            return res.status(401).json({
                message:
                    "Refresh token expired",
            });
        }

        // Tạo Access Token mới
        const accessToken =
            createAccessToken(
                session.userId.toString()
            );

        /*
         * Trong version đơn giản:
         *
         * RT không thay đổi.
         */

        setAuthCookies(
            res,
            accessToken,
            refreshToken
        );

        return res.json({
            message:
                "Token refreshed successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function logout(
    req: Request,
    res: Response
) {
    try {
        const refreshToken =
            req.cookies.refresh_token;

        if (refreshToken) {
            const refreshTokenHash =
                hashRefreshToken(
                    refreshToken
                );

            await Session.deleteOne({
                refreshTokenHash,
            });
        }

        clearAuthCookies(res);

        return res.json({
            message: "Logout successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}