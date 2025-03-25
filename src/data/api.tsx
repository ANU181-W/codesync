import axios from "axios";
import { io, Socket } from "socket.io-client";
import { Problem, Room, User, Submission } from "../types";

const API_URL = "http://localhost:5000/api";
let socket: Socket | null = null;

// Initialize socket connection
export const initializeSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }
  return socket;
};

// Get current socket instance
export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth APIs
const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post<{ token: string; user: User }>(
        "/users/login",
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      return { user: response.data.user };
    } catch (error: any) {
      throw new Error(error.message || "Failed to login");
    }
  },
  googleAuth: async (token: string) => {
    try {
      const response = await api.post<{ token: string; user: User }>(
        "/users/google-auth",
        { token }
      );
      localStorage.setItem("token", response.data.token);
      return { user: response.data.user };
    } catch (error: any) {
      throw new Error(error.message || "Failed to authenticate with Google");
    }
  },
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await api.post<{ token: string; user: User }>(
        "/users/register",
        { name, email, password }
      );
      localStorage.setItem("token", response.data.token);
      return { user: response.data.user };
    } catch (error: any) {
      throw new Error(error.message || "Failed to register");
    }
  },

  sendOTP: async (email: string) => {
    try {
      await api.post("/users/send-otp", { email });
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to send OTP");
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    try {
      const response = await api.post<{ token: string; user: User }>(
        "/users/verify-otp",
        { email, otp }
      );
      localStorage.setItem("token", response.data.token);
      return { user: response.data.user };
    } catch (error: any) {
      throw new Error(error.message || "Failed to verify OTP");
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get<User>("/users/profile");
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to get user profile");
    }
  },

  updateProfile: async (userData: {
    name?: string;
    email?: string;
    password?: string;
  }) => {
    try {
      const response = await api.put<User>("/users/profile", userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update profile");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },
};

// Problem APIs
const problemAPI = {
  getAll: async () => {
    try {
      const response = await api.get<Problem[]>("/problems");
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch problems");
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get<Problem>(`/problems/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch problem");
    }
  },

  submit: async (problemId: string, code: string, language: string) => {
    try {
      const response = await api.post<Submission>(
        `/problems/${problemId}/submit`,
        {
          code,
          language,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to submit solution");
    }
  },
};

// Room APIs
const roomAPI = {
  create: async (problemId: string, maxParticipants: number) => {
    try {
      const response = await api.post<Room>("/rooms", {
        problemId,
        maxParticipants,
      });
      const currentSocket = getSocket();
      if (currentSocket) {
        currentSocket.emit("join_room", response.data._id);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to create room");
    }
  },

  join: async (roomId: string) => {
    try {
      const response = await api.post<Room>(`/rooms/${roomId}/join`);
      const currentSocket = getSocket();
      if (currentSocket) {
        currentSocket.emit("join_room", roomId);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to join room");
    }
  },

  getById: async (roomId: string) => {
    try {
      const response = await api.get<Room>(`/rooms/${roomId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch room");
    }
  },

  updateCode: async (roomId: string, code: string, language: string) => {
    try {
      const response = await api.put<Room>(`/rooms/${roomId}/code`, {
        code,
        language,
      });
      const currentSocket = getSocket();
      if (currentSocket) {
        currentSocket.emit("code_change", {
          roomId,
          code,
          language,
        });
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update code");
    }
  },

  leaveRoom: (roomId: string) => {
    const currentSocket = getSocket();
    if (currentSocket) {
      currentSocket.emit("leave_room", roomId);
    }
  },
};

// Custom hook for room management
const useRoom = (roomId: string) => {
  const currentSocket = getSocket();

  const joinRoom = async () => {
    try {
      return await roomAPI.join(roomId);
    } catch (error) {
      console.error("Error joining room:", error);
      throw error;
    }
  };

  const leaveRoom = () => {
    roomAPI.leaveRoom(roomId);
  };

  const updateCode = async (code: string, language: string) => {
    try {
      return await roomAPI.updateCode(roomId, code, language);
    } catch (error) {
      console.error("Error updating code:", error);
      throw error;
    }
  };

  const onCodeChange = (
    callback: (data: { userId: string; code: string; language: string }) => void
  ) => {
    if (currentSocket) {
      // Remove any existing listeners to prevent duplicates
      currentSocket.off("code_update");
      currentSocket.on("code_update", callback);
    }
  };

  const onCursorMove = (
    callback: (data: { userId: string; position: any }) => void
  ) => {
    if (currentSocket) {
      // Remove any existing listeners to prevent duplicates
      currentSocket.off("cursor_update");
      currentSocket.on("cursor_update", callback);
    }
  };

  const emitCursorMove = (position: any) => {
    if (currentSocket) {
      currentSocket.emit("cursor_move", {
        roomId,
        position,
      });
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

export { authAPI, problemAPI, roomAPI, useRoom };

export default api;
