import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GovHeader, GovFooter } from '../components/Layout';
import { getCurrentUser, getProfile, saveProfile } from '../utils/auth';

// MM/DD/YYYY -> YYYY-MM-DD for <input type="date">
function toDateInputValue(dob) {
  if (!dob) return '';
  if (dob.includes('-')) return dob;
  const [m, d, y] = dob.split('/');
  if (!y) return '';
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

// YYYY-MM-DD (from native date input) -> MM/DD/YYYY for storage
function toStoredDob(raw) {
  if (!raw) return '';
  if (!raw.includes('-')) return raw;
  const [y, m, d] = raw.split('-');
  return `${m}/${d}/${y}`;
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

function ProfileForm({ initial, defaultEmail, onSubmit, error, loading }) {
  const [name, setName] = useState(initial?.name || '');
  const [address, setAddress] = useState(initial?.address || '');
  const [dob, setDob] = useState(toDateInputValue(initial?.dob || ''));
  const [phone, setPhone] = useState(initial?.phone || '');
  const [email, setEmail] = useState(initial?.email || defaultEmail || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, address, dob: toStoredDob(dob), phone, email });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <Field label="Full Name" id="name" type="text" value={name} onChange={setName} placeholder="Enter your full name" testId="profile-name-input" required />
      <Field label="Address" id="address" type="text" value={address} onChange={setAddress} placeholder="Enter your address" testId="profile-address-input" required />

      <div className="space-y-2">
        <label htmlFor="dob" className="block text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]">
          Date of Birth
        </label>
        <input
          id="dob"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 text-base outline-none"
          max={new Date().toISOString().split('T')[0]}
          required
          data-testid="profile-dob-input"
        />
      </div>

      <Field label="Phone Number" id="phone" type="tel" value={phone} onChange={setPhone} placeholder="Enter your phone number" testId="profile-phone-input" required />
      <Field label="Email Address" id="profile-email" type="email" value={email} onChange={setEmail} placeholder="Enter your email" testId="profile-email-input" required />

      {error && (
        <div className="p-3 sm:p-4 bg-[#FDF0F0] border border-[#E63946] text-[#E63946] text-sm" data-testid="profile-error-message">
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
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const existing = getProfile();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (data) => {
    setError('');
    setLoading(true);
    try {
      saveProfile(data);
      navigate('/search');
    } catch {
      setError('Failed to save profile. Please try again.');
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

        <div className="bg-white border border-[#dfe1e2] rounded-sm p-4 sm:p-6 shadow-sm">
          <div className="border-b border-[#dfe1e2] pb-3 sm:pb-4 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-bold tracking-wide text-[#1b1b1b]">USER PROFILE</h2>
          </div>

          <div className="border-l-4 border-[#b38600] pl-3 sm:pl-4 mb-4 sm:mb-6 bg-[#faf3d1] py-2 sm:py-3">
            <p className="text-[#1b1b1b] text-sm sm:text-base">
              <span className="font-bold">Instruction:</span> Complete your profile information to proceed with docket search.
            </p>
          </div>

          <ProfileForm
            initial={existing}
            defaultEmail={user?.email || ''}
            onSubmit={handleSubmit}
            error={error}
            loading={loading}
          />

          <div className="mt-6 pt-6 border-t border-[#dfe1e2]">
            <Link to="/" className="text-[#1a4480] hover:text-[#162e51] text-sm font-semibold">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>

      <GovFooter />
    </div>
  );
}
