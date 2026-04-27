import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GovHeader, GovFooter } from '../components/Layout';
import { getProfile } from '../utils/auth';

export default function SearchPage() {
  const navigate = useNavigate();
  const profile = getProfile();
  const [name, setName] = useState(profile?.name || '');
  const [citationNumber, setCitationNumber] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem(
      'citation_search',
      JSON.stringify({ name, citation_number: citationNumber, zip_code: zipCode })
    );
    navigate('/loading');
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
            <h2 className="text-base sm:text-lg font-bold tracking-wide text-[#1b1b1b]">
              PHASE I • DOCKET SEARCH
            </h2>
          </div>

          <div className="border-l-4 border-[#b38600] pl-3 sm:pl-4 mb-4 sm:mb-6 bg-[#faf3d1] py-2 sm:py-3">
            <p className="text-[#1b1b1b] text-sm sm:text-base">
              <span className="font-bold">Instruction:</span> Locate your digital case file to proceed. Search by Last Name below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label htmlFor="search-name" className="block text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]">
                Search Registry
              </label>
              <input
                id="search-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 text-base outline-none"
                placeholder="Start typing name..."
                required
                data-testid="search-name-input"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="citation-number" className="block text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]">
                Citation Number
              </label>
              <input
                id="citation-number"
                type="text"
                value={citationNumber}
                onChange={(e) => setCitationNumber(e.target.value)}
                className="w-full rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 font-mono text-base outline-none"
                placeholder="Enter citation number"
                required
                data-testid="search-citation-input"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="zip-code" className="block text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]">
                Zip Code
              </label>
              <input
                id="zip-code"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 text-base outline-none"
                placeholder="Enter zip code"
                required
                maxLength={10}
                data-testid="search-zip-input"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto rounded-sm bg-[#1a4480] hover:bg-[#162e51] text-white py-3 px-6 text-sm font-bold"
              data-testid="search-submit-button"
            >
              SEARCH RECORDS
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#dfe1e2]">
            <Link to="/profile" className="text-[#1a4480] hover:text-[#162e51] text-sm font-semibold">
              ← Back to Profile
            </Link>
          </div>
        </div>
      </div>

      <GovFooter />
    </div>
  );
}
