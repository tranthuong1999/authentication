import {
    useEffect,
    type ReactNode,
} from "react";

import { useAuthStore } from "../stores/authStore";

interface AuthInitializerProps {
    children: ReactNode;
}

export function AuthInitializer({
    children,
}: AuthInitializerProps) {
    const initialize =
        useAuthStore(
            (state) => state.initialize
        );

    useEffect(() => {
        initialize();
    }, [initialize]);

    return children;
}
