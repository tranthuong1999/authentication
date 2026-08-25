export type AuthFieldErrors = {
    email?: string;
    password?: string;
};

const EMAIL_REGEX =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(
    email: string
): string | undefined {
    const trimmed = email.trim();

    if (!trimmed) {
        return "Email is required";
    }

    if (!EMAIL_REGEX.test(trimmed)) {
        return "Please enter a valid email address";
    }

    return undefined;
}

export function validateLoginPassword(
    password: string
): string | undefined {
    if (!password) {
        return "Password is required";
    }

    return undefined;
}

export function validateRegisterPassword(
    password: string
): string | undefined {
    if (!password) {
        return "Password is required";
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters";
    }

    if (!/[A-Za-z]/.test(password)) {
        return "Password must contain at least one letter";
    }

    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number";
    }

    return undefined;
}

export function validateLoginForm(
    email: string,
    password: string
): AuthFieldErrors {
    const errors: AuthFieldErrors = {};

    const emailError =
        validateEmail(email);

    const passwordError =
        validateLoginPassword(password);

    if (emailError) {
        errors.email = emailError;
    }

    if (passwordError) {
        errors.password = passwordError;
    }

    return errors;
}

export function validateRegisterForm(
    email: string,
    password: string
): AuthFieldErrors {
    const errors: AuthFieldErrors = {};

    const emailError =
        validateEmail(email);

    const passwordError =
        validateRegisterPassword(password);

    if (emailError) {
        errors.email = emailError;
    }

    if (passwordError) {
        errors.password = passwordError;
    }

    return errors;
}

export function hasFieldErrors(
    errors: AuthFieldErrors
): boolean {
    return Boolean(
        errors.email || errors.password
    );
}

export function getFirstFieldError(
    errors: AuthFieldErrors
): string | undefined {
    return (
        errors.email || errors.password
    );
}
