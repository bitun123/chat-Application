import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import cookie from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from "url";
import path from 'path';
import authRoutes from "../src/routes/auth.route.js";
import chatRoutes from "../src/routes/chat.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for specific origins and allow credentials
app.use(cors({
    origin: ["http://localhost:5173", "https://chat-application-1-0mdx.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(cookie());

app.use(express.static(path.join(__dirname, "../public")))

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);





app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});


export default app;