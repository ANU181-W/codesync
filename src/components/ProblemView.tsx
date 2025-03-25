import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from './Editor';
import { CreateRoom } from './CreateRoom';
import { Problem } from '../types';
import { Play, RotateCcw, ChevronDown, Clock, HardDrive, Users, AlertCircle } from 'lucide-react';
import { problemAPI } from '../data/api.tsx';

export function ProblemView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'testcases' | 'result'>('testcases');
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) return;
      try {
        const data = await problemAPI.getById(id);
        setProblem(data);
        setCode(data.starterCode);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch problem');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error || 'Problem not found'}</span>
        </div>
      </div>
    );
  }

  const runCode = async () => {
    setIsRunning(true);
    try {
      const submission = await problemAPI.submit(problem._id, code, 'javascript');
      setOutput(JSON.stringify(submission, null, 2));
      setActiveTab('result');
    } catch (err: any) {
      setOutput(err.message || 'Error running code');
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(problem.starterCode);
    setOutput('');
  };

  return (
    <div className="flex h-full">
      <div className="w-[45%] p-6 border-r dark:border-gray-700 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <button
            onClick={() => setShowCreateRoom(true)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            <Users className="w-4 h-4" />
            <span>Create Room</span>
          </button>
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <span className={`inline-block px-2 py-1 rounded text-sm font-medium
            ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
              'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
            {problem.difficulty}
          </span>
          <span className="text-sm text-gray-500">Acceptance: {problem.acceptance.toFixed(1)}%</span>
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4">{problem.description}</p>
          
          <h3 className="text-lg font-semibold mt-6 mb-2">Examples:</h3>
          {problem.examples.map((example, index) => (
            <div key={index} className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p><strong>Input:</strong> {example.input}</p>
              <p><strong>Output:</strong> {example.output}</p>
              {example.explanation && (
                <p><strong>Explanation:</strong> {example.explanation}</p>
              )}
            </div>
          ))}

          <h3 className="text-lg font-semibold mt-6 mb-2">Constraints:</h3>
          <ul className="list-disc pl-6">
            {problem.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>Run</span>
            </button>
            <button
              onClick={resetCode}
              className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Time Limit: 1000ms</span>
            </div>
            <div className="flex items-center space-x-1">
              <HardDrive className="w-4 h-4" />
              <span>Memory Limit: 32MB</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <Editor
            currentFile={{
              language: 'javascript',
              content: code
            }}
            onContentChange={setCode}
          />
        </div>

        <div className="h-64 border-t dark:border-gray-700">
          <div className="flex items-center border-b dark:border-gray-700">
            <button
              onClick={() => setActiveTab('testcases')}
              className={`px-4 py-2 text-sm font-medium border-r dark:border-gray-700 ${
                activeTab === 'testcases'
                  ? 'bg-white dark:bg-gray-800 text-blue-500'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Testcases
            </button>
            <button
              onClick={() => setActiveTab('result')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'result'
                  ? 'bg-white dark:bg-gray-800 text-blue-500'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Result
            </button>
          </div>
          <div className="p-4 h-[calc(100%-41px)] bg-white dark:bg-gray-800 font-mono text-sm overflow-auto">
            {activeTab === 'testcases' ? (
              <div className="space-y-4">
                {problem.testCases.map((testCase, index) => (
                  <div key={index} className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
                    <div className="text-xs text-gray-500 mb-1">Test Case {index + 1}:</div>
                    <code>{testCase}</code>
                  </div>
                ))}
              </div>
            ) : (
              <pre>{output}</pre>
            )}
          </div>
        </div>
      </div>

      {showCreateRoom && (
        <CreateRoom
          problem={problem}
          onClose={() => setShowCreateRoom(false)}
        />
      )}
    </div>
  );
}