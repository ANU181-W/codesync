import React, { useState } from 'react';
import { User, Trophy, Target, Clock, GitBranch, Calendar, Code2, Mail, Edit2, Save } from 'lucide-react';
import { User as UserType } from '../types';
import { authAPI } from '../data/api.tsx';

interface UserProfileProps {
  user: UserType;
  onClose: () => void;
}

export function UserProfile({ user, onClose }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    try {
      await authAPI.updateProfile({ name, email });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Profile</h2>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
                  title="Save"
                >
                  <Save className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Edit"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-gray-500" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <div>
                    <label htmlFor="name" className="block text-sm text-gray-500">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm text-gray-500">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <div className="flex items-center text-gray-500">
                    <Mail className="w-4 h-4 mr-1" />
                    <span>{user.email}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Trophy className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Problems Solved</p>
                  <p className="text-xl font-bold">{user.solved}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Attempted</p>
                  <p className="text-xl font-bold">{user.attempted}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <GitBranch className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="text-xl font-bold">
                    {user.attempted > 0 
                      ? ((user.solved / user.attempted) * 100).toFixed(1) + '%'
                      : '0%'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">Recent Submissions</h4>
            {user.submissions && user.submissions.length > 0 ? (
              <div className="space-y-4">
                {user.submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Code2 className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{submission.problemId}</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          submission.status === 'Accepted'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {submission.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{submission.runtime}ms</span>
                      </div>
                      <div>
                        <Calendar className="w-4 h-4 inline mr-1" />
                        <span>
                          {new Date(submission.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No submissions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}