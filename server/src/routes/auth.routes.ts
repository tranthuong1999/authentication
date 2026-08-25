import { Router } from "express";

import {
    register,
    login,
    refresh,
    logout,
    googleCallback,
    googleLogin,
    googleRegister,
} from "../controllers/auth.controller.js";

const router = Router();

router.post(
    "/register",
    register
);

router.post(
    "/login",
    login
);

router.post(
    "/refresh",
    refresh
);

router.get(
    "/google/callback",
    googleCallback
);

router.get(
    "/google/register",
    googleRegister
);

router.get(
    "/google/login",
    googleLogin
);

router.post(
    "/logout",
    logout
);

export default router;