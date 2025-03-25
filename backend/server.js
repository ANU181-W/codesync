import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv to look for .env in the backend folder
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const httpServer = createServer(app);

// Configure CORS before initializing socket.io
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// Connect to MongoDB with error handling
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Middleware
    app.use(express.json());

    // Request logging middleware
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });

    // Routes
    app.use("/api/users", userRoutes);
    app.use("/api/problems", problemRoutes);
    app.use("/api/rooms", roomRoutes);
    app.use("/api/admin", adminRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error("Error:", err);
      res.status(err.status || 500).json({
        message: err.message || "Something went wrong!",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    });

    // WebSocket handling
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      socket.on("code_change", (data) => {
        socket.to(data.roomId).emit("code_update", {
          userId: data.userId,
          code: data.code,
          language: data.language,
        });
      });

      socket.on("cursor_move", (data) => {
        socket.to(data.roomId).emit("cursor_update", {
          userId: data.userId,
          position: data.position,
        });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    const PORT = process.env.PORT || 5000;

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
