import React, { useState } from 'react';
import { Save } from 'lucide-react';

export function Settings() {
  const [settings, setSettings] = useState({
    maxRoomParticipants: 4,
    allowGuestAccess: false,
    enableEmailNotifications: true,
    maintenanceMode: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    }
  };

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">General Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Maximum Room Participants
              </label>
              <input
                type="number"
                min="2"
                max="10"
                value={settings.maxRoomParticipants}
                onChange={(e) => setSettings({
                  ...settings,
                  maxRoomParticipants: parseInt(e.target.value)
                })}
                className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="guestAccess"
                checked={settings.allowGuestAccess}
                onChange={(e) => setSettings({
                  ...settings,
                  allowGuestAccess: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="guestAccess" className="ml-2 block text-sm">
                Allow Guest Access
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.enableEmailNotifications}
                onChange={(e) => setSettings({
                  ...settings,
                  enableEmailNotifications: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm">
                Enable Email Notifications
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({
                  ...settings,
                  maintenanceMode: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="maintenanceMode" className="ml-2 block text-sm">
                Maintenance Mode
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}