import { OAuth2Client } from "google-auth-library";

const GOOGLE_CALLBACK_URL =
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:4000/auth/google/callback";

export const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL
);

export const CLIENT_URL =
    process.env.CLIENT_URL || "http://localhost:5173";