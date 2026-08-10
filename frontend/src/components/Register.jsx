import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await api.post('/register', { email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

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
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 text-purple-400 mb-6 border border-white/5"
          >
            <UserPlus size={28} />
          </motion.div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Join <span className="animated-gradient-text">Lumina</span>
          </h2>
          <p className="text-sm text-gray-400 font-medium">Create your new account</p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleRegister}>
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
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
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
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
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
            className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Sign up'}
          </motion.button>
        </form>
        
        <p className="text-center text-sm text-gray-400 pt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-purple-400 hover:text-purple-300 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
