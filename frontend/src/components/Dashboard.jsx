import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquarePlus, LogOut } from 'lucide-react';
import api from '../lib/api';

export default function Dashboard() {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/rooms', { name: roomName });
      navigate(`/chat/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('storage')); // Trigger App.jsx effect
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4 pt-20">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors border border-gray-700"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <div className="w-full max-w-md space-y-8 rounded-2xl bg-gray-800 p-8 shadow-xl border border-gray-700 backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 mb-4">
            <MessageSquarePlus size={24} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Join a Room</h2>
          <p className="mt-2 text-sm text-gray-400">Create a new room or enter an existing one's ID</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleCreateRoom}>
          {error && (
            <div className="rounded-md bg-red-500/10 p-4 border border-red-500/20">
              <div className="text-sm text-red-400">{error}</div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                required
                className="block w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 px-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Enter Room'}
          </button>
        </form>
      </div>
    </div>
  );
}
