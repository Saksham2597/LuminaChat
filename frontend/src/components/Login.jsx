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
    <div className="flex min-h-screen items-center justify-center p-4 overflow-hidden relative bg-[#e0e5ec]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md space-y-8 p-10 neu-flat rounded-3xl relative z-10"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full neu-convex text-indigo-500 mb-6"
          >
            <LogIn size={32} strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-700 mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 font-medium">Sign in to your account</p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleLogin}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-2xl p-4 neu-pressed"
            >
              <div className="text-sm text-red-500 font-bold text-center">{error}</div>
            </motion.div>
          )}
          
          <div className="space-y-6">
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="email"
                required
                className="block w-full rounded-2xl py-4 pl-14 neu-pressed neu-pressed-focus text-slate-700 placeholder-slate-400 text-sm font-medium"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="password"
                required
                className="block w-full rounded-2xl py-4 pl-14 neu-pressed neu-pressed-focus text-slate-700 placeholder-slate-400 text-sm font-medium"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-2xl neu-convex neu-active px-4 py-4 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider mt-8"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </motion.button>
        </form>
        
        <p className="text-center text-sm text-slate-500 pt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-500 hover:text-indigo-600 transition-colors">
            Sign up now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
