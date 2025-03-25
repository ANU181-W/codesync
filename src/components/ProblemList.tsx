import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Problem } from "../types";
import { problemsData } from "../lib/api";

export function ProblemList() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await problemsData.getAll();
        setProblems(data.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "Hard":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }
  console.log("problems:", problems);
  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="grid grid-cols-12 gap-4 p-4 border-b dark:border-gray-700 font-medium text-sm text-gray-500 dark:text-gray-400">
          <div className="col-span-1">Status</div>
          <div className="col-span-5">Title</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-2">Acceptance</div>
        </div>

        {problems.map((problem) => (
          <button
            key={problem._id}
            onClick={() => navigate(`/problems/${problem._id}`)}
            className="w-full grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700 last:border-0"
          >
            <div className="col-span-1">
              <Circle className="w-5 h-5 text-gray-400" />
            </div>
            <div className="col-span-5 text-left font-medium">
              {problem.title}
            </div>
            <div
              className={`col-span-2 ${getDifficultyColor(problem.difficulty)}`}
            >
              {problem.difficulty}
            </div>
            <div className="col-span-2">{problem.acceptance.toFixed(1)}%</div>
          </button>
        ))}
      </div>
    </div>
  );
}
