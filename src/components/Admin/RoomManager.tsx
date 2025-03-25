import React, { useState, useEffect } from 'react';
import { Search, Users, Clock, X } from 'lucide-react';
import { Room } from '../../types';
import {rooms} from '../../lib/api';
export function RoomManager() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRoom = async (id: string) => {
    if (!confirm('Are you sure you want to close this room?')) return;

    try {
      await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
      setRooms(rooms.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error closing room:', error);
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Room #{room.id}</h3>
                <button
                  onClick={() => handleCloseRoom(room.id)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  <span>
                    {room.participants.length} / {room.maxParticipants} participants
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    Created {new Date(room.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <h4 className="text-sm font-medium mb-2">Participants:</h4>
                <div className="space-y-2">
                  {room.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{participant.name}</span>
                      <span className="text-xs text-gray-500">
                        {participant.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}