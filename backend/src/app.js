import express from 'express';
import dotenv from "dotenv";
import cookie from 'cookie-parser';
import cors from 'cors';

dotenv.config();



import authRoutes from "../src/routes/auth.route.js";
import chatRoutes from "../src/routes/chat.routes.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173" ,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(cookie());

app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);



export default app;