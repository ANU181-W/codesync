import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Code2, User, Menu, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Theme } from '../types';

interface NavbarProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onUserClick: () => void;
  user: any;
  onLogout: () => void;
}

export function Navbar({ theme, onThemeChange, onUserClick, user, onLogout }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <NavLink to="/" className="flex items-center space-x-2">
            <Code2 className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold">Codesync</span>
          </NavLink>
          
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/problems"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              Problems
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              Dashboard
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          {user && (
            <>
              <button
                onClick={onUserClick}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}