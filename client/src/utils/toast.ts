import { toast } from "sonner";

export function showAuthError(
    message: string
) {
    toast.error(message);
}

export function showAuthSuccess(
    message: string
) {
    toast.success(message);
}
