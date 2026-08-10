import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/api';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      setToken(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md space-y-8 p-8 glass-panel rounded-3xl relative z-10"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 text-cyan-400 mb-6 border border-white/5"
          >
            <LogIn size={28} />
          </motion.div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Welcome to <span className="animated-gradient-text">Lumina</span>
          </h2>
          <p className="text-sm text-gray-400 font-medium">Sign in to your account</p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleLogin}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-xl bg-red-500/10 p-4 border border-red-500/20 backdrop-blur-md"
            >
              <div className="text-sm text-red-400 font-medium text-center">{error}</div>
            </motion.div>
          )}
          
          <div className="space-y-4">
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              </div>
              <input
                type="email"
                required
                className="block w-full rounded-xl py-3.5 pl-12 glass-input text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              </div>
              <input
                type="password"
                required
                className="block w-full rounded-xl py-3.5 pl-12 glass-input text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </motion.button>
        </form>
        
        <p className="text-center text-sm text-gray-400 pt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
            Sign up now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
