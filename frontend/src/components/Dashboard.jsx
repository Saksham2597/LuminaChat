import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquarePlus, LogOut, Sparkles } from 'lucide-react';
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
    <div className="flex min-h-screen flex-col items-center p-4 pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDelay: '3s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 z-20"
      >
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full glass-panel px-5 py-2.5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all shadow-lg"
        >
          <LogOut size={16} className="text-purple-400" />
          Logout
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg space-y-8 p-10 glass-panel rounded-[2rem] relative z-10 mt-10"
      >
        <div className="text-center">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 text-cyan-400 mb-6 border border-white/10 shadow-inner"
          >
            <Sparkles size={32} />
          </motion.div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white mb-3">
            Join a <span className="animated-gradient-text">Space</span>
          </h2>
          <p className="text-gray-400 font-medium">Create a new room or enter an existing one.</p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleCreateRoom}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-xl bg-red-500/10 p-4 border border-red-500/20 backdrop-blur-md"
            >
              <div className="text-sm text-red-400 font-medium text-center">{error}</div>
            </motion.div>
          )}
          
          <div className="relative group">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <MessageSquarePlus className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              </div>
            <input
              type="text"
              required
              className="block w-full rounded-xl py-4 pl-12 glass-input text-base font-medium"
              placeholder="Enter room name..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-4 text-base font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Preparing space...' : 'Enter Space'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
