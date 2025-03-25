import React from "react";

interface TestResult {
  passed: boolean;
  executionTime: string;
  memoryUsed: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
}

interface TestResultsPanelProps {
  results: TestResult[] | null;
  isSubmission?: boolean;
}

export function TestResultsPanel({
  results,
  isSubmission,
}: TestResultsPanelProps) {
  if (!results) return null;

  const allPassed = results.every((r) => r.passed);

  return (
    <div className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {isSubmission ? "Submission Results" : "Test Results"}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            allPassed
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
          }`}
        >
          {allPassed ? "Passed" : "Failed"}
        </span>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="border dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">
                Test Case {index + 1}
              </span>
              <div className="flex space-x-4">
                <span className="text-sm text-gray-500">
                  Runtime: {result.executionTime}
                </span>
                <span className="text-sm text-gray-500">
                  Memory: {result.memoryUsed}
                </span>
              </div>
            </div>

            {!result.passed && (
              <div className="mt-2 space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Input:</span>
                  <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                    {result.input}
                  </pre>
                </div>
                <div>
                  <span className="text-sm text-gray-500">
                    Expected Output:
                  </span>
                  <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                    {result.expectedOutput}
                  </pre>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Your Output:</span>
                  <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                    {result.actualOutput}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
