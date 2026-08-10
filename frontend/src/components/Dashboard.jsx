import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquarePlus, LogOut, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
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
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4 pt-20 relative bg-[#e0e5ec]">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 z-20"
      >
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-2xl neu-convex neu-active px-5 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all"
        >
          <LogOut size={18} strokeWidth={2.5} className="text-indigo-400" />
          Logout
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg space-y-8 p-12 neu-flat rounded-[2.5rem] relative z-10 mt-10"
      >
        <div className="text-center">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] neu-convex text-indigo-500 mb-8"
          >
            <LayoutGrid size={40} strokeWidth={2} />
          </motion.div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-700 mb-3">
            Join a Space
          </h2>
          <p className="text-slate-500 font-medium">Create a new room or enter an existing one.</p>
        </div>

        <form className="mt-12 space-y-8" onSubmit={handleCreateRoom}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-2xl p-4 neu-pressed"
            >
              <div className="text-sm text-red-500 font-bold text-center">{error}</div>
            </motion.div>
          )}
          
          <div className="relative group">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                <MessageSquarePlus className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
            <input
              type="text"
              required
              className="block w-full rounded-2xl py-5 pl-16 neu-pressed neu-pressed-focus text-slate-700 placeholder-slate-400 text-lg font-medium"
              placeholder="Enter room name..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-2xl neu-convex neu-active px-4 py-5 text-base font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Preparing space...' : 'Enter Space'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
