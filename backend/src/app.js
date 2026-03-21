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
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(cookie());

// ✅ Static files
app.use(express.static(path.join(__dirname, "../public")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

// ✅ React Router support
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;