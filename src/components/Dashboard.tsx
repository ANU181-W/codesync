import React from 'react';
import { User, Submission } from '../types';
import { Trophy, Target, Clock, Zap } from 'lucide-react';

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Solved Problems</p>
              <p className="text-2xl font-bold">{user.solved}</p>
            </div>
            <Trophy className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Attempted</p>
              <p className="text-2xl font-bold">{user.attempted}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Acceptance Rate</p>
              <p className="text-2xl font-bold">
                {((user.solved / user.attempted) * 100).toFixed(1)}%
              </p>
            </div>
            <Zap className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Submissions</p>
              <p className="text-2xl font-bold">{user.submissions.length}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold">Recent Submissions</h2>
        </div>
        <div className="divide-y dark:divide-gray-700">
          {user.submissions.slice(0, 10).map((submission) => (
            <div key={submission.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{submission.problemId}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(submission.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium
                    ${submission.status === 'Accepted'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                    {submission.status}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {submission.runtime}ms
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {submission.memory}MB
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}