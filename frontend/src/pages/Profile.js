import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GovHeader, GovFooter } from '../components/Layout';
import { getCurrentUser, getProfile, saveProfile } from '../utils/auth';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const existing = getProfile();

  const [name, setName] = useState(existing?.name || '');
  const [address, setAddress] = useState(existing?.address || '');
  const [dob, setDob] = useState(existing?.dob || '');
  const [phone, setPhone] = useState(existing?.phone || '');
  const [email, setEmail] = useState(existing?.email || user?.email || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, []);

  const formatDob = (raw) => {
    // Accept YYYY-MM-DD from <input type="date"> and reformat to MM/DD/YYYY
    if (!raw) return '';
    if (raw.includes('-')) {
      const [y, m, d] = raw.split('-');
      return `${m}/${d}/${y}`;
    }
    return raw;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      saveProfile({ name, address, dob: formatDob(dob), phone, email });
      navigate('/search');
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Convert MM/DD/YYYY → YYYY-MM-DD for the date input value
  const dobInputValue = (() => {
    if (!dob) return '';
    if (dob.includes('-')) return dob;
    const [m, d, y] = dob.split('/');
    if (!y) return '';
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  })();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      <div className="border-b-4 border-[#1a4480]" />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1b1b1b] mb-6 sm:mb-8">
          Electronic Docket Registry
        </h1>

        <div className="bg-white border border-[#dfe1e2] rounded-sm p-4 sm:p-6 shadow-sm">
          <div className="border-b border-[#dfe1e2] pb-3 sm:pb-4 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-bold tracking-wide text-[#1b1b1b]">
              USER PROFILE
            </h2>
          </div>

          <div className="border-l-4 border-[#b38600] pl-3 sm:pl-4 mb-4 sm:mb-6 bg-[#faf3d1] py-2 sm:py-3">
            <p className="text-[#1b1b1b] text-sm sm:text-base">
              <span className="font-bold">Instruction:</span> Complete your profile information to proceed with docket search.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Field
              label="Full Name"
              id="name"
              type="text"
              value={name}
              onChange={setName}
              placeholder="Enter your full name"
              testId="profile-name-input"
              required
            />
            <Field
              label="Address"
              id="address"
              type="text"
              value={address}
              onChange={setAddress}
              placeholder="Enter your address"
              testId="profile-address-input"
              required
            />
            <div className="space-y-2">
              <label htmlFor="dob" className="block text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                value={dobInputValue}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 text-base outline-none"
                max={new Date().toISOString().split('T')[0]}
                required
                data-testid="profile-dob-input"
              />
            </div>
            <Field
              label="Phone Number"
              id="phone"
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder="Enter your phone number"
              testId="profile-phone-input"
              required
            />
            <Field
              label="Email Address"
              id="profile-email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              testId="profile-email-input"
              required
            />

            {error && (
              <div
                className="p-3 sm:p-4 bg-[#FDF0F0] border border-[#E63946] text-[#E63946] text-sm"
                data-testid="profile-error-message"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-sm bg-[#1a4480] hover:bg-[#162e51] text-white py-3 px-6 text-sm font-bold disabled:opacity-50"
              data-testid="profile-save-button"
            >
              {loading ? 'SAVING...' : 'SAVE & CONTINUE'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#dfe1e2]">
            <Link
              to="/"
              className="text-[#1a4480] hover:text-[#162e51] text-sm font-semibold"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>

      <GovFooter />
    </div>
  );
}

function Field({ label, id, type, value, onChange, placeholder, testId, required }) {
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
        required={required}
        data-testid={testId}
      />
    </div>
  );
}
