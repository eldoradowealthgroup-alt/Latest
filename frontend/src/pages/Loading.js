import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GovHeader, GovFooter } from '../components/Layout';
import { searchCitation } from '../utils/citations';

export default function LoadingPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const searchData = JSON.parse(sessionStorage.getItem('citation_search') || '{}');

  useEffect(() => {
    if (!searchData?.citation_number) {
      navigate('/search', { replace: true });
      return;
    }

    const duration = 5000;
    const interval = 50;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    const fetchTimer = setTimeout(() => {
      const result = searchCitation(searchData.citation_number);
      sessionStorage.setItem('citation_results', JSON.stringify(result));
      navigate('/results');
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(fetchTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      <div className="border-b-4 border-[#1a4480]" />

      <div
        className="flex flex-col items-center justify-center p-4 sm:p-8 mt-8 sm:mt-16 flex-1"
        data-testid="loading-overlay"
      >
        <div className="w-full max-w-md text-center px-4">
          <p
            className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1b1b1b] mb-6 sm:mb-8"
            data-testid="loading-text"
          >
            {Math.round(progress)}%
          </p>

          <div className="w-full h-2 bg-[#dfe1e2] mb-6 sm:mb-8 rounded-sm overflow-hidden">
            <div
              className="h-full bg-[#1a4480] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#71767a]">
            SEARCHING RECORDS
          </p>

          <p className="mt-3 sm:mt-4 font-mono text-xs sm:text-sm text-[#71767a]">
            Citation: {searchData?.citation_number}
          </p>
        </div>
      </div>

      <GovFooter />
    </div>
  );
}
