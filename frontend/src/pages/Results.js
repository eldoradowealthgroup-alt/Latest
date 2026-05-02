import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GovHeader, GovFooter } from '../components/Layout';
import { getProfile } from '../utils/auth';

function calculateTotal(citations) {
  if (!citations?.length) return '$0.00';
  const total = citations.reduce((sum, c) => sum + parseFloat(c.fine.replace(/[$,]/g, '')), 0);
  return `$${total.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function NotFoundView({ message, onSearchAgain }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      <div className="border-b-4 border-[#1a4480]" />

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 flex-1 w-full">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1b1b1b] mb-6 sm:mb-8">
          Electronic Docket Registry
        </h1>

        <div className="bg-white border border-[#dfe1e2] rounded-sm p-4 sm:p-6 shadow-sm text-center py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1b1b1b] mb-4" data-testid="not-found-message">
            CITATIONS NOT FOUND
          </h2>
          <p className="text-[#71767a] max-w-md mx-auto mb-6 sm:mb-8 text-sm sm:text-base px-4">
            {message || 'No record found.'}
          </p>
          <button
            onClick={onSearchAgain}
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

function UserInfoCard({ profile }) {
  const cells = [
    { label: 'Full Name', value: profile?.name || 'N/A', testId: 'results-full-name', cls: 'text-base sm:text-lg text-[#1b1b1b] font-semibold' },
    { label: 'Date of Birth', value: profile?.dob || 'N/A', cls: 'text-base sm:text-lg font-mono text-[#1b1b1b]' },
    { label: 'Address', value: profile?.address || 'N/A', cls: 'text-sm sm:text-base text-[#1b1b1b]' },
    { label: 'Phone', value: profile?.phone || 'N/A', cls: 'text-sm sm:text-base font-mono text-[#1b1b1b]' },
  ];

  return (
    <div className="bg-[#f0f0f0] border border-[#dfe1e2] rounded-sm p-4 sm:p-6 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cells.map((c) => (
          <div key={c.label}>
            <p className="text-xs font-bold uppercase tracking-wide text-[#71767a] mb-1">{c.label}</p>
            <p className={c.cls} data-testid={c.testId}>
              {c.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CitationsTable({ citations }) {
  return (
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
            {citations.map((citation, index) => (
              <tr key={index} className="border-b border-[#dfe1e2] hover:bg-[#f9f9f9]" data-testid="result-row">
                <td className="font-mono text-sm py-3 px-4 text-[#1a4480] font-semibold">{citation.citation_id}</td>
                <td className="text-sm py-3 px-4">{citation.offense}</td>
                <td className="font-mono text-sm py-3 px-4">{citation.date}</td>
                <td className="font-mono text-sm py-3 px-4 text-right text-[#d83933] font-semibold">{citation.fine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden" data-testid="results-mobile">
        {citations.map((citation, index) => (
          <div key={index} className="p-4 border-b border-[#dfe1e2] last:border-b-0" data-testid="result-row-mobile">
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
  );
}

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

  if (!results) return null;

  if (!results.found) {
    return <NotFoundView message={results.message} onSearchAgain={() => navigate('/search')} />;
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

        <UserInfoCard profile={profile} />
        <CitationsTable citations={results.citations || []} />

        <div className="bg-[#1a4480] text-white rounded-sm p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-lg font-bold">TOTAL OUTSTANDING</span>
            <span className="text-xl sm:text-2xl font-bold font-mono" data-testid="total-amount">
              {calculateTotal(results.citations)}
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
