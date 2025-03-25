import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Play, Award, Send } from 'lucide-react';

const TestResultItem = ({ result, index }) => {
  const { passed, result: output, expected, error } = result;
  
  return (
    <div 
      className={`p-3 rounded-lg flex flex-col space-y-2 mb-2 ${
        passed 
          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
          : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
      }`}
    >
      <div className="flex items-start space-x-2">
        {passed ? (
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
        )}
        <span className={`font-medium ${passed ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
          Test Case {index + 1}: {passed ? "Passed" : "Failed"}
        </span>
      </div>
      
      {!passed && (
        <div className="pl-7 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Expected:</p>
              <pre className="mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-x-auto text-xs">
                {expected}
              </pre>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Your Output:</p>
              <pre className="mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-x-auto text-xs">
                {output || "No output"}
              </pre>
            </div>
          </div>
          
          {error && (
            <div className="mt-2">
              <p className="font-medium text-red-600 dark:text-red-400">Error:</p>
              <pre className="mt-1 bg-red-100 dark:bg-red-900/30 p-2 rounded-md overflow-x-auto text-xs text-red-800 dark:text-red-200">
                {error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TestResults = ({ results, onClose }) => {
  if (!results || results.length === 0) return null;
  
  const passCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const allPassed = passCount === totalCount;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 max-h-[50vh] overflow-hidden flex flex-col">
      <div className={`p-4 flex justify-between items-center border-b dark:border-gray-700 ${
        allPassed ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
      }`}>
        <div className="flex items-center space-x-2">
          {allPassed ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          )}
          <span className={`font-medium ${
            allPassed ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
          }`}>
            {allPassed 
              ? "All test cases passed!" 
              : `${passCount}/${totalCount} test cases passed`}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto">
        {results.map((result, index) => (
          <TestResultItem 
            key={`test-${index}`} 
            result={result} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
};

const SubmissionResults = ({ result, onClose }) => {
  if (!result) return null;
  
  const { success, message, executionTime, memoryUsage, status } = result;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 overflow-hidden">
      <div className={`p-4 flex justify-between items-center border-b dark:border-gray-700 ${
        success ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
      }`}>
        <div className="flex items-center space-x-2">
          {success ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          )}
          <span className={`font-medium ${
            success ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
          }`}>
            {message}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className={`font-medium mt-1 ${
              status === 'Accepted' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {status}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Runtime</p>
            <p className="font-medium mt-1">{executionTime}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Memory</p>
            <p className="font-medium mt-1">{memoryUsage}</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Award className="w-5 h-5 text-green-500" />
              <span className="font-medium text-green-700 dark:text-green-300">Solution accepted!</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Your solution was submitted successfully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TestPanel = ({ 
  code, 
  language, 
  problem,
  testResults,
  setTestResults,
  isTesting,
  setIsTesting,
  submissionResult,
  setSubmissionResult,
  isSubmitting,
  setIsSubmitting,
  runTests,
  submitSolution
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={runTests}
          disabled={isTesting || isSubmitting}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          <span>{isTesting ? "Running Tests..." : "Run Tests"}</span>
        </button>
        
        <button
          onClick={submitSolution}
          disabled={isTesting || isSubmitting}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:bg-green-300 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? "Submitting..." : "Submit Solution"}</span>
        </button>
      </div>
      
      {testResults && testResults.results && testResults.results.length > 0 && (
        <TestResults 
          results={testResults.results} 
          onClose={() => setTestResults(null)} 
        />
      )}
      
      {submissionResult && (
        <SubmissionResults 
          result={submissionResult} 
          onClose={() => setSubmissionResult(null)} 
        />
      )}
    </div>
  );
};

export default TestPanel;