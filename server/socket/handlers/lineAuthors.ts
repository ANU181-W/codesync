import { Server, Socket } from "socket.io";
import { LineAuthor, LineAuthorsUpdate } from "../../../src/types";

// Store line authors for each room
const roomLineAuthors: Map<string, LineAuthor[]> = new Map();

export const setupLineAuthorHandlers = (io: Server, socket: Socket) => {
  // Handle line author updates
  socket.on("line_authors_update", (data: LineAuthorsUpdate) => {
    const { roomId, lineAuthors } = data;

    // Store the updated line authors
    roomLineAuthors.set(roomId, lineAuthors);

    // Broadcast to all other users in the room
    socket.to(roomId).emit("line_authors_update", { lineAuthors });
  });

  // Handle requests for initial line authors
  socket.on("request_line_authors", (roomId: string) => {
    const lineAuthors = roomLineAuthors.get(roomId) || [];
    socket.emit("initial_line_authors", { roomId, lineAuthors });
  });

  // Clean up when room is closed
  socket.on("disconnect", () => {
    // Find and remove any rooms this socket was managing
    for (const [roomId, authors] of roomLineAuthors.entries()) {
      if (authors.some((author) => author.userId === socket.id)) {
        roomLineAuthors.delete(roomId);
      }
    }
  });
};
