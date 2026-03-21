import express from 'express';
import dotenv from "dotenv";
import cookie from 'cookie-parser'
dotenv.config();

import cors from 'cors';

import authRoutes from "../src/routes/auth.route.js";
import chatRoutes from "../src/routes/chat.routes.js";
import path from 'path';




const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: [ "GET", "POST", "PUT", "DELETE" ],
}))
app.use(express.static("./public"));

app.use(express.json());
app.use(cookie());

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);






app.use(express.static(path.join(__dirname, "../public")));

// For React Router - serve index.html for all non-API routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;
