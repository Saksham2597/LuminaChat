import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Lock, Mail } from 'lucide-react';
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-gray-800 p-8 shadow-xl border border-gray-700 backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 mb-4">
            <LogIn size={24} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-md bg-red-500/10 p-4 border border-red-500/20">
              <div className="text-sm text-red-400">{error}</div>
            </div>
          )}
          
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                className="block w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 pl-10 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                required
                className="block w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 pl-10 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
