import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GovHeader, GovFooter } from '../components/Layout';
import { registerUser, isLoggedIn } from '../utils/auth';

const MIN_PASSWORD_LENGTH = 6;

function AuthInput({ id, label, type, value, onChange, placeholder, testId, minLength }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 text-base outline-none"
        placeholder={placeholder}
        required
        minLength={minLength}
        data-testid={testId}
      />
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) navigate('/profile', { replace: true });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    setLoading(true);
    try {
      registerUser(email, password);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      <div className="border-b-4 border-[#1a4480]" />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1b1b1b] mb-6 sm:mb-8">
          Electronic Docket Registry
        </h1>

        <div className="bg-white border border-[#dfe1e2] rounded-sm p-4 sm:p-6 shadow-sm max-w-md">
          <div className="border-b border-[#dfe1e2] pb-3 sm:pb-4 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-bold tracking-wide text-[#1b1b1b]">
              CREATE NEW ACCOUNT
            </h2>
          </div>

          <div className="border-l-4 border-[#b38600] pl-3 sm:pl-4 mb-4 sm:mb-6 bg-[#faf3d1] py-2 sm:py-3">
            <p className="text-[#1b1b1b] text-sm sm:text-base">
              <span className="font-bold">Instruction:</span> Create your secure account to access the docket registry system.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              testId="register-email-input"
            />
            <AuthInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder={`Create a password (min. ${MIN_PASSWORD_LENGTH} chars)`}
              minLength={MIN_PASSWORD_LENGTH}
              testId="register-password-input"
            />

            {error && (
              <div
                className="p-3 sm:p-4 bg-[#FDF0F0] border border-[#E63946] text-[#E63946] text-sm"
                data-testid="register-error-message"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-sm bg-[#1a4480] hover:bg-[#162e51] text-white py-3 px-6 text-sm font-bold disabled:opacity-50"
              data-testid="register-submit-button"
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#dfe1e2]">
            <p className="text-sm text-[#1b1b1b] mb-3">Already have an account?</p>
            <Link
              to="/"
              className="inline-block w-full sm:w-auto text-center rounded-sm border border-[#1a4480] text-[#1a4480] hover:bg-[#1a4480] hover:text-white py-3 px-6 text-sm font-bold transition-colors"
            >
              ← BACK TO SIGN IN
            </Link>
          </div>
        </div>
      </div>

      <GovFooter />
    </div>
  );
}
