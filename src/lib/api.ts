import axios from "axios";
import { io } from "socket.io-client";

const API_URL = "http://localhost:5000/api";

export const socket = io("http://localhost:5000");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    // If you already have the token at the time of creating the instance
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Add an interceptor to refresh the token on each request
// This ensures the token is always current, even if it changes during the session
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("token", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Auth APIs
export const auth = {
  login: (email: string, password: string) =>
    api.post("/users/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post("/users/register", { name, email, password }),

  sendOTP: (email: string) => api.post("/users/send-otp", { email }),

  verifyOTP: (email: string, otp: string) =>
    api.post("/users/verify-otp", { email, otp }),

  googleAuth: (token: string) => api.post("/users/google-auth", { token }),
};

// Problem APIs
export const problemsData = {
  getAll: () => api.get("/problems"),

  getById: (id: string) => api.get(`/problems/${id}`),

  create: (problemData: any) => api.post("/problems", problemData),

  update: (id: string, problemData: any) =>
    api.put(`/problems/${id}`, problemData),

  delete: (id: string) => api.delete(`/problems/${id}`),
};

// Room APIs
export const rooms = {
  create: (problemId: string, maxParticipants: number) =>
    api.post("/rooms", { problemId, maxParticipants }),

  join: (roomId: string) => api.post(`/rooms/${roomId}/join`),

  getById: (roomId: string) => api.get(`/rooms/${roomId}`),

  updateCode: (roomId: string, code: string, language: string) =>
    api.put(`/rooms/${roomId}/code`, { code, language }),

  // WebSocket events
  onJoin: (roomId: string) => {
    socket.emit("join_room", roomId);
  },

  onCodeChange: (
    roomId: string,
    userId: string,
    code: string,
    language: string
  ) => {
    socket.emit("code_change", { roomId, userId, code, language });
  },

  onCursorMove: (roomId: string, userId: string, position: any) => {
    socket.emit("cursor_move", { roomId, userId, position });
  },

  subscribeToCodeUpdates: (callback: (data: any) => void) => {
    socket.on("code_update", callback);
  },

  subscribeToCursorUpdates: (callback: (data: any) => void) => {
    socket.on("cursor_update", callback);
  },

  unsubscribe: () => {
    socket.off("code_update");
    socket.off("cursor_update");
  },
};

export default api;
