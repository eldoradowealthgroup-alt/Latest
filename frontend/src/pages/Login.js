import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GovHeader, GovFooter } from '../components/Layout';
import { loginUser, isLoggedIn, getCurrentUser } from '../utils/auth';
import { useEffect } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect
    if (isLoggedIn()) {
      const user = getCurrentUser();
      if (user?.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = loginUser(email, password);
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <div className="border-b-4 border-gov-red" />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gov-blue-dark mb-2">
              Sign In To Your Account
            </h2>
            <p className="text-gov-gray mb-6">
              Access the Electronic Docket Registry
            </p>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gov-blue focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gov-blue focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gov-blue text-white py-3 px-4 font-bold hover:bg-gov-blue-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gov-gray mb-2">Don't have an account?</p>
              <button
                onClick={() => navigate('/register')}
                className="w-full border border-gov-blue text-gov-blue py-3 px-4 font-bold hover:bg-gov-blue hover:text-white transition-colors"
              >
                CREATE NEW ACCOUNT
              </button>
            </div>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  );
}
