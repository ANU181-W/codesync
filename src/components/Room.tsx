import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, Copy, Crown, Clock, X } from "lucide-react";
import { toast } from "react-toastify";
import { Editor } from "./Editor";
import { Room as RoomType, User } from "../types";
import { roomAPI, getSocket, useRoom, problemAPI } from "../data/api.tsx";

interface RoomProps {
  user: User;
}

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  acceptance: number;
  description: string;
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
    _id: string;
  }>;
  solution: string;
  starterCode: string;
  testCases: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type ProblemIdType = string | { _id: string } | unknown;

export function Room({ user }: RoomProps) {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [inviteUrl, setInviteUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [problemLoading, setProblemLoading] = useState(false);
  const roomJoinedRef = useRef(false);
  const hasLoadedRef = useRef(false);

  const validRoomId = roomId || "";

  // Destructure all values directly from useRoom
  const {
    joinRoom,
    leaveRoom,
    updateCode,
    onCodeChange,
    onCursorMove,
    emitCursorMove,
  } = useRoom(validRoomId);

  // Memoize the functions to ensure stability in useEffect dependencies
  const roomActions = useMemo(
    () => ({
      joinRoom,
      leaveRoom,
      updateCode,
      onCodeChange,
      onCursorMove,
      emitCursorMove,
    }),
    [
      joinRoom,
      leaveRoom,
      updateCode,
      onCodeChange,
      onCursorMove,
      emitCursorMove,
    ]
  );

  useEffect(() => {
    if (room && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [room]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleJoinRoom = async () => {
    try {
      if (room?.participants.some((p) => p.id === user.id)) {
        console.log("User already in room, skipping join");
        return;
      }

      console.log("Joining room:", validRoomId);
      await joinRoom(); // Use joinRoom directly

      setRoom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          participants: [
            ...prev.participants,
            {
              id: user.id,
              name: user.name,
              role: "participant",
              language: "javascript",
              code: "",
              user: user,
            },
          ],
        };
      });

      roomJoinedRef.current = true;
      toast.success("Successfully joined the room!");
    } catch (err: any) {
      console.error("Join room error:", err);
      throw new Error(err.message || "Failed to join room");
    }
  };

  useEffect(() => {
    if (!roomId) {
      console.error("No roomId provided");
      setError("Invalid room ID.");
      navigate("/problems");
      return;
    }

    if (hasLoadedRef.current) {
      console.log("Initial load already completed, skipping effect");
      return;
    }

    let isMounted = true;

    const connectSocket = () => {
      return new Promise((resolve, reject) => {
        const socket = getSocket();
        if (socket.connected) {
          console.log("Socket already connected");
          resolve(socket);
          return;
        }

        const timeout = setTimeout(() => {
          reject(new Error("Socket connection timed out"));
        }, 5000);

        const onConnect = () => {
          clearTimeout(timeout);
          console.log("Socket connected successfully");
          resolve(socket);
        };

        const onConnectError = (err: any) => {
          clearTimeout(timeout);
          console.error("Socket connection error:", err);
          reject(err);
        };

        socket.on("connect", onConnect);
        socket.on("connect_error", onConnectError);

        console.log("Attempting to connect socket");
        socket.connect();

        // Cleanup listeners to prevent duplicates
        return () => {
          socket.off("connect", onConnect);
          socket.off("connect_error", onConnectError);
        };
      });
    };

    const loadRoom = async () => {
      console.log("skipping:", roomJoinedRef);
      if (roomJoinedRef.current) {
        console.log("Room already joined, skipping load");
        return;
      }
      setLoading(true);
      console.log("Loading room with ID:", roomId);

      try {
        const cleanupSocketListeners = await connectSocket();
        console.log("Fetching room data for ID:", roomId);
        const roomData = await roomAPI.getById(roomId);
        if (!roomData) {
          throw new Error("Room not found.");
        }
        if (isMounted) {
          console.log("Setting room data:", roomData);
          setRoom(roomData);
          setInviteUrl(`${window.location.origin}/room/${roomId}/join`);
        }
        await handleJoinRoom();
      } catch (err: any) {
        console.error("Error in loadRoom:", err);
        let errorMessage = "Failed to load room.";
        if (err.message === "Room not found") {
          errorMessage = "The requested room does not exist.";
        } else if (err.message.includes("Room is full")) {
          errorMessage = "The room is full.";
        } else if (err.message.includes("already in this room")) {
          errorMessage = "You are already a participant in this room.";
        } else if (err.message.includes("Socket connection")) {
          errorMessage = "Failed to connect to the server.";
        }
        if (isMounted) {
          setError(errorMessage);
          setTimeout(() => navigate("/problems"), 3000);
        }
      } finally {
        if (isMounted) {
          console.log("Setting loading to false");
          setLoading(false);
          hasLoadedRef.current = true;
        }
      }
    };

    loadRoom();

    return () => {
      isMounted = false;
      if (roomJoinedRef.current) {
        console.log("Leaving room on cleanup");
        leaveRoom(); // Use leaveRoom directly
      }
    };
  }, [roomId, navigate, user.id]); // Removed roomActions from dependencies

  const extractProblemId = (problemId: ProblemIdType): string => {
    if (!problemId) return "";

    if (typeof problemId === "string") {
      return problemId;
    }

    if (typeof problemId === "object" && problemId !== null) {
      const problemObj = problemId as { _id?: string };
      if (problemObj._id) {
        return problemObj._id;
      }
    }

    try {
      return String(problemId);
    } catch {
      return "";
    }
  };

  useEffect(() => {
    if (!room?.problemId || problemLoading || problem) {
      return;
    }

    let isMounted = true;

    const fetchProblem = async () => {
      try {
        setProblemLoading(true);
        const problemId = extractProblemId(room.problemId);
        if (!problemId) {
          throw new Error("Invalid problem ID");
        }

        console.log("Fetching problem with ID:", problemId);
        const response = await problemAPI.getById(problemId);
        if (!response) {
          throw new Error("Invalid problem data received");
        }
        if (isMounted) {
          console.log("Setting problem data:", response);
          setProblem(response);
        }
      } catch (err: any) {
        console.error("Error fetching problem:", err);
        if (isMounted) {
          setError(err.message || "Failed to fetch problem data");
        }
      } finally {
        if (isMounted) {
          setProblemLoading(false);
        }
      }
    };

    fetchProblem();

    return () => {
      isMounted = false;
    };
  }, [room?.problemId, problem]); // Removed problemLoading from dependencies

  useEffect(() => {
    if (!validRoomId || !room) return;

    const handleCodeUpdate = ({
      userId,
      code,
      language,
    }: {
      userId: string;
      code: string;
      language: string;
    }) => {
      setRoom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          participants: prev.participants.map((p) =>
            p.id === userId ? { ...p, code, language } : p
          ),
        };
      });
    };

    const handleCursorUpdate = ({
      userId,
      position,
    }: {
      userId: string;
      position: any;
    }) => {
      console.log(`User ${userId} moved cursor to:`, position);
    };

    const codeUnsubscribe = roomActions.onCodeChange(handleCodeUpdate);
    const cursorUnsubscribe = roomActions.onCursorMove(handleCursorUpdate);

    return () => {
      if (typeof codeUnsubscribe === "function") codeUnsubscribe();
      if (typeof cursorUnsubscribe === "function") cursorUnsubscribe();
    };
  }, [validRoomId, room, roomActions]);

  const copyInviteUrl = () => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success("Invite link copied to clipboard!");
  };

  if (loading) {
    console.log("Rendering loading state");
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log("Rendering error state:", error);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <p className="mt-2">Redirecting to problems page...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    console.log("No room data, rendering null");
    return null;
  }

  if (problemLoading) {
    console.log("Rendering problem loading state");
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading problem data...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    console.log("No problem data");
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-500">
          <p>Problem not found</p>
          <button
            onClick={() => navigate("/problems")}
            className="mt-4 px-4 py-2 bg-blue-5 00 text-white rounded-lg"
          >
            Return to Problems
          </button>
        </div>
      </div>
    );
  }

  const currentParticipant = room.participants.find((p) => p.id === user.id);
  if (!currentParticipant) {
    console.log("User not a participant");
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-500">
          <p>You are not a participant in this room</p>
          <button
            onClick={() => navigate("/problems")}
            className="mt-4 px-4 py-2 bg-blue-5 00 text-white rounded-lg"
          >
            Return to Problems
          </button>
        </div>
      </div>
    );
  }

  const handleCodeChange = async (content: string) => {
    try {
      await roomActions.updateCode(content, currentParticipant.language);
      setRoom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          participants: prev.participants.map((p) =>
            p.id === user.id ? { ...p, code: content } : p
          ),
        };
      });
    } catch (error) {
      console.error("Error updating code:", error);
      toast.error("Failed to update code.");
    }
  };

  const handleLanguageChange = async (language: string) => {
    if (!currentParticipant?.code) return;

    try {
      await roomActions.updateCode(currentParticipant.code, language);
      setRoom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          participants: prev.participants.map((p) =>
            p.id === user.id ? { ...p, language } : p
          ),
        };
      });
    } catch (error) {
      console.error("Error updating language:", error);
      toast.error("Failed to update language.");
    }
  };

  const handleRunTest = async () => {
    if (!problem?._id || !currentParticipant) return;

    try {
      const results = await problemAPI.runTestCase(
        problem._id,
        currentParticipant.code,
        currentParticipant.language
      );
      const socket = getSocket();
      if (socket) {
        socket.emit("test_run", {
          roomId: room._id,
          userId: user.id,
          results,
        });
      }
      return results;
    } catch (error) {
      console.error("Error running tests:", error);
      toast.error("Failed to run tests.");
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!problem?._id || !currentParticipant) return;

    try {
      const result = await problemAPI.submitSolution(
        problem._id,
        currentParticipant.code,
        currentParticipant.language
      );
      const socket = getSocket();
      if (socket) {
        socket.emit("submission", {
          roomId: room._id,
          userId: user.id,
          result,
        });
      }
      return result;
    } catch (error) {
      console.error("Error submitting solution:", error);
      toast.error("Failed to submit solution.");
      throw error;
    }
  };

  console.log("Rendering room, participants:", room.participants);
  return (
    <div className="flex h-full">
      <div className="w-[45%] p-6 border-r dark:border-gray-700 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-500">
                {room.participants.length}/{room.maxParticipants}
              </span>
            </div>
            <button
              onClick={copyInviteUrl}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Invite Link</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="font-semibold">Participants</h2>
            </div>
            <div className="divide-y dark:divide-gray-700">
              {room.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {participant.role === "host" && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                    <span
                      className={
                        participant.id === user.id ? "font-semibold" : ""
                      }
                    >
                      {participant.name}{" "}
                      {participant.id === user.id
                        ? `(${participant.user.name})`
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {participant.language
                        ? participant.language.charAt(0).toUpperCase() +
                          participant.language.slice(1)
                        : "No language"}
                    </span>
                    {participant.role === "host" && (
                      <span className="text-sm text-gray-500">Host</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
          <div className="flex items-center space-x-4 mb-4">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                problem.difficulty === "Easy"
                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                  : problem.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
              }`}
            >
              {problem.difficulty}
            </span>
            <span className="text-sm text-gray-500">
              Acceptance: {problem.acceptance}%
            </span>
          </div>

          <p className="mb-4">{problem.description}</p>

          {problem.constraints && problem.constraints.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-6 mb-2">Constraints:</h3>
              <ul className="list-disc pl-5 mb-4">
                {problem.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </>
          )}

          <h3 className="text-lg font-semibold mt-6 mb-2">Examples:</h3>
          {problem.examples.map((example, index) => (
            <div
              key={index}
              className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
            >
              <p>
                <strong>Input:</strong> {example.input}
              </p>
              <p>
                <strong>Output:</strong> {example.output}
              </p>
              {example.explanation && (
                <p>
                  <strong>Explanation:</strong> {example.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                Session Time: {formatTime(sessionTime)}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              roomActions.leaveRoom();
              navigate("/problems");
            }}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            aria-label="Leave room"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1">
          <Editor
            currentFile={{
              language: currentParticipant?.language || "javascript",
              content: currentParticipant?.code || problem.starterCode || "",
            }}
            onContentChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
            participants={room.participants}
            currentUserId={user.id}
            onRunTest={handleRunTest}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
