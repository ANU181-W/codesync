export type Theme = "light" | "dark";

export type Difficulty = "Easy" | "Medium" | "Hard";
declare global {
  interface Window {
    socket: any; // Replace 'any' with your actual socket type if available
  }
}
export interface Problem {
  _id: string;
  title: string;
  difficulty: Difficulty;
  acceptance: number;
  description: string;
  examples: Example[];
  constraints: string[];
  starterCode: string;
  testCases: string[];
  solution: string;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface User {
  id: string;
  name: string;
  solved: number;
  attempted: number;
  submissions: Submission[];
}

export interface Submission {
  id: string;
  problemId: string;
  status: "Accepted" | "Wrong Answer" | "Runtime Error";
  runtime: number;
  memory: number;
  language: string;
  code: string;
  timestamp: Date;
}

export interface Room {
  _id: string;
  problemId: string;
  createdBy: string;
  participants: RoomParticipant[];
  createdAt: Date;
  status: "waiting" | "in-progress" | "completed";
  maxParticipants: number;
}

export interface RoomParticipant {
  id: string;
  name: string;
  role: "host" | "participant";
  joinedAt: Date;
  code: string;
  language: string;
}
export {};
