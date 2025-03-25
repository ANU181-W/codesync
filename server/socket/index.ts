import { Server } from "socket.io";
import { setupLineAuthorHandlers } from "./handlers/lineAuthors";

export const setupSocketServer = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // ... existing socket setup ...

    // Add line author handlers
    setupLineAuthorHandlers(io, socket);

    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);

      // Send initial line authors when user joins
      const lineAuthors = roomLineAuthors.get(roomId) || [];
      socket.emit("initial_line_authors", { roomId, lineAuthors });
    });

    // ... rest of your socket setup ...
  });

  return io;
};
