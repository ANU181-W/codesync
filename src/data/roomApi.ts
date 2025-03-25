import { getSocket } from "../utils/socket";

export const useRoom = (roomId: string) => {
  const socket = getSocket();

  const joinRoom = async () => {
    if (socket) {
      socket.emit("join_room", roomId);
    }
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit("leave_room", roomId);
    }
  };

  const updateCode = async (code: string, language: string) => {
    if (socket) {
      socket.emit("code_update", { roomId, code, language });
    }
  };

  const onCodeChange = (
    callback: (data: { userId: string; code: string; language: string }) => void
  ) => {
    if (socket) {
      socket.on("code_update", callback);
      return () => socket.off("code_update", callback);
    }
    return () => {};
  };

  const onCursorMove = (
    callback: (data: { userId: string; position: any }) => void
  ) => {
    if (socket) {
      socket.on("cursor_move", callback);
      return () => socket.off("cursor_move", callback);
    }
    return () => {};
  };

  const emitCursorMove = (position: any) => {
    if (socket) {
      socket.emit("cursor_move", { roomId, position });
    }
  };

  return {
    joinRoom,
    leaveRoom,
    updateCode,
    onCodeChange,
    onCursorMove,
    emitCursorMove,
  };
};

// Your existing room API methods
export const roomAPI = {
    create: (problemId: string, maxParticipants: number) =>
        api.post("/rooms", { problemId, maxParticipants }),
    
      join: (roomId: string) => api.post(`/rooms/${roomId}/join`),
    
      getById: (roomId: string) => api.get(`/rooms/${roomId}`),
    
      updateCode: (roomId: string, code: string, language: string) =>
        api.put(`/rooms/${roomId}/code`, { code, language }),
    
};

// Your existing problems API methods
export const problemsData = {
  // ... your existing methods
};
