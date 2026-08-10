import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Lock, Mail } from 'lucide-react';
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-gray-800 p-8 shadow-xl border border-gray-700 backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
            <UserPlus size={24} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-400">Join LuminaChat today</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
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
                className="block w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 pl-10 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
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
                className="block w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 pl-10 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Sign up'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
