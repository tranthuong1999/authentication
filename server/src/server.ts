import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db/connect.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());


app.use(
    "/auth",
    authRoutes
);

app.use(
    "/api",
    userRoutes
);

async function bootstrap() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(
            `Server running on http://localhost:${PORT}`
        );
    });
}

bootstrap();