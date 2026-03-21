import express from 'express';
import dotenv from "dotenv";
import cookie from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from "../src/routes/auth.route.js";
import chatRoutes from "../src/routes/chat.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(cookie());

// ✅ FIXED PATH (IMPORTANT)
const publicPath = path.join(__dirname, "../../public");

// ✅ Serve static files
app.use(express.static(publicPath));

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

// ✅ React Router support
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

export default app;