import React, { useState, useEffect } from 'react';
import { Users, BookOpen, LayoutGrid, Settings } from 'lucide-react';
import { UserList } from './UserList';
import { ProblemManager } from './ProblemManager';
import { RoomManager } from './RoomManager';
import { Settings as AdminSettings } from './Settings';

type Tab = 'users' | 'problems' | 'rooms' | 'settings';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProblems: 0,
    activeRooms: 0
  });

  useEffect(() => {
    // Fetch admin dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchStats();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserList />;
      case 'problems':
        return <ProblemManager />;
      case 'rooms':
        return <RoomManager />;
      case 'settings':
        return <AdminSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center px-6 py-3 text-sm ${
              activeTab === 'users'
                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border-r-4 border-blue-600'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={`w-full flex items-center px-6 py-3 text-sm ${
              activeTab === 'problems'
                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border-r-4 border-blue-600'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <BookOpen className="w-5 h-5 mr-3" />
            Problems
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`w-full flex items-center px-6 py-3 text-sm ${
              activeTab === 'rooms'
                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border-r-4 border-blue-600'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <LayoutGrid className="w-5 h-5 mr-3" />
            Rooms
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center px-6 py-3 text-sm ${
              activeTab === 'settings'
                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border-r-4 border-blue-600'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Problems</p>
                  <p className="text-2xl font-bold">{stats.totalProblems}</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Rooms</p>
                  <p className="text-2xl font-bold">{stats.activeRooms}</p>
                </div>
                <LayoutGrid className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}