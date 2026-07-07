import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import socketHandler from "./socket/socketHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= MIDDLEWARE ================= */
app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json());

/* ================= SERVER (ONLY ONE) ================= */
const server = http.createServer(app);

/* ================= SOCKET (ONLY ONE) ================= */
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

/* ================= SOCKET HANDLER ================= */
app.set("io", io);

socketHandler(io);
/* ================= ROUTES ================= */
app.get("/", (req, res) => {
    res.json({ status: "Server running" });
});

/* ================= START ================= */
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});