import type {
    InputHTMLAttributes,
    ReactNode,
} from "react";

interface AuthFieldProps
    extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    error?: string;
    hint?: ReactNode;
}

export function AuthField({
    id,
    label,
    error,
    hint,
    className,
    ...inputProps
}: AuthFieldProps) {
    const fieldClassName = [
        "auth-field",
        error ? "auth-field--error" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={fieldClassName}>
            <label htmlFor={id}>
                {label}
            </label>

            <input
                id={id}
                aria-invalid={Boolean(error)}
                aria-describedby={
                    error
                        ? `${id}-error`
                        : hint
                          ? `${id}-hint`
                          : undefined
                }
                {...inputProps}
            />

            {hint && !error && (
                <p
                    id={`${id}-hint`}
                    className="auth-field__hint"
                >
                    {hint}
                </p>
            )}

            {error && (
                <p
                    id={`${id}-error`}
                    className="auth-field__error"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
}
