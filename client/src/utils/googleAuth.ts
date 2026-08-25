export { API_URL } from "../config/env";

export const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
    google_auth_cancelled:
        "Google sign-in was cancelled.",
    google_auth_failed:
        "Google sign-in failed. Please try again.",
    google_email_unverified:
        "Your Google email is not verified.",
    google_account_mismatch:
        "This email is linked to a different Google account.",
    google_account_exists:
        "This email is already registered. Please sign in instead.",
    google_account_not_found:
        "No account found. Please register with Google first.",
    google_password_account:
        "This email was registered with a password. Please sign in with email and password.",
};
