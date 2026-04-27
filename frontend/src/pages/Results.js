import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GovHeader, GovFooter } from '../components/Layout';
import { getProfile } from '../utils/auth';

export default function ResultsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const profile = getProfile();

  useEffect(() => {
    const stored = sessionStorage.getItem('citation_results');
    if (!stored) {
      navigate('/search', { replace: true });
      return;
    }
    setResults(JSON.parse(stored));
  }, [navigate]);

  const calculateTotal = () => {
    if (!results?.citations) return '$0.00';
    const total = results.citations.reduce((sum, c) => {
      const amount = parseFloat(c.fine.replace(/[$,]/g, ''));
      return sum + amount;
    }, 0);
    return `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (!results) return null;

  if (!results.found) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <GovHeader />
        <div className="border-b-4 border-[#1a4480]" />

        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 flex-1 w-full">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1b1b1b] mb-6 sm:mb-8">
            Electronic Docket Registry
          </h1>

          <div className="bg-white border border-[#dfe1e2] rounded-sm p-4 sm:p-6 shadow-sm text-center py-12 sm:py-16">
            <h2
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1b1b1b] mb-4"
              data-testid="not-found-message"
            >
              CITATIONS NOT FOUND
            </h2>
            <p className="text-[#71767a] max-w-md mx-auto mb-6 sm:mb-8 text-sm sm:text-base px-4">
              {results.message || 'No record found.'}
            </p>
            <button
              onClick={() => navigate('/search')}
              className="rounded-sm bg-[#1a4480] hover:bg-[#162e51] text-white py-3 px-6 text-sm font-bold"
              data-testid="search-again-button"
            >
              SEARCH AGAIN
            </button>
          </div>
        </div>

        <GovFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      <div className="border-b-4 border-[#1a4480]" />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1b1b] mb-2">STATUS</h1>
          <p className="text-[#d83933] font-semibold text-sm sm:text-base">
            Outstanding Financial Obligations
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-[#f0f0f0] border border-[#dfe1e2] rounded-sm p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#71767a] mb-1">Full Name</p>
              <p className="text-base sm:text-lg text-[#1b1b1b] font-semibold" data-testid="results-full-name">
                {profile?.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#71767a] mb-1">Date of Birth</p>
              <p className="text-base sm:text-lg font-mono text-[#1b1b1b]">{profile?.dob || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#71767a] mb-1">Address</p>
              <p className="text-sm sm:text-base text-[#1b1b1b]">{profile?.address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#71767a] mb-1">Phone</p>
              <p className="text-sm sm:text-base font-mono text-[#1b1b1b]">{profile?.phone || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Citations Table */}
        <div className="bg-white border border-[#dfe1e2] rounded-sm shadow-sm overflow-hidden mb-6">
          <div className="p-3 sm:p-4 border-b border-[#dfe1e2] bg-[#1a4480]">
            <h2 className="text-base sm:text-lg font-bold tracking-wide text-white">VIOLATION DETAILS</h2>
          </div>

          <div className="hidden sm:block overflow-x-auto" data-testid="results-table">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f0f0f0] border-b border-[#dfe1e2]">
                  <th className="text-left text-xs font-bold uppercase tracking-wide text-[#1b1b1b] py-3 px-4">Statute</th>
                  <th className="text-left text-xs font-bold uppercase tracking-wide text-[#1b1b1b] py-3 px-4">Violation</th>
                  <th className="text-left text-xs font-bold uppercase tracking-wide text-[#1b1b1b] py-3 px-4">Date</th>
                  <th className="text-right text-xs font-bold uppercase tracking-wide text-[#1b1b1b] py-3 px-4">Fine</th>
                </tr>
              </thead>
              <tbody>
                {results.citations?.map((citation, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#dfe1e2] hover:bg-[#f9f9f9]"
                    data-testid="result-row"
                  >
                    <td className="font-mono text-sm py-3 px-4 text-[#1a4480] font-semibold">{citation.citation_id}</td>
                    <td className="text-sm py-3 px-4">{citation.offense}</td>
                    <td className="font-mono text-sm py-3 px-4">{citation.date}</td>
                    <td className="font-mono text-sm py-3 px-4 text-right text-[#d83933] font-semibold">{citation.fine}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden" data-testid="results-mobile">
            {results.citations?.map((citation, index) => (
              <div
                key={index}
                className="p-4 border-b border-[#dfe1e2] last:border-b-0"
                data-testid="result-row-mobile"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-sm text-[#1a4480] font-bold">{citation.citation_id}</span>
                  <span className="font-mono text-sm text-[#d83933] font-bold">{citation.fine}</span>
                </div>
                <p className="text-sm text-[#1b1b1b] mb-1">{citation.offense}</p>
                <p className="text-xs text-[#71767a] font-mono">{citation.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1a4480] text-white rounded-sm p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-lg font-bold">TOTAL OUTSTANDING</span>
            <span className="text-xl sm:text-2xl font-bold font-mono" data-testid="total-amount">
              {calculateTotal()}
            </span>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4 mb-6">
          <button
            onClick={() => navigate('/courses-of-action')}
            className="w-full sm:w-auto rounded-sm bg-[#2e8540] hover:bg-[#236b34] text-white py-3 px-6 text-sm font-bold"
            data-testid="view-courses-button"
          >
            VIEW COURSES OF ACTION
          </button>
        </div>

        <button
          onClick={() => navigate('/search')}
          className="text-[#1a4480] hover:text-[#162e51] text-sm font-semibold"
        >
          ← Back to Search
        </button>
      </div>

      <GovFooter />
    </div>
  );
}
