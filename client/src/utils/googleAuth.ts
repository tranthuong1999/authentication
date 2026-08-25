export const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

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

export function consumeGoogleAuthError(): string {
    const params = new URLSearchParams(
        window.location.search
    );

    const error = params.get("error");

    if (!error) {
        return "";
    }

    const page = params.get("page");
    const nextUrl = page
        ? `/?page=${page}`
        : "/";

    window.history.replaceState(
        {},
        document.title,
        nextUrl
    );

    return (
        GOOGLE_ERROR_MESSAGES[error] ||
        "Google sign-in failed."
    );
}

export function getInitialAuthPage(): "login" | "register" {
    const page = new URLSearchParams(
        window.location.search
    ).get("page");

    return page === "register"
        ? "register"
        : "login";
}
