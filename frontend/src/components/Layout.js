import { Scale, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn, logoutUser } from '../utils/auth';

export function GovHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const showLogout = isLoggedIn() && location.pathname !== '/' && location.pathname !== '/register';

  const handleLogout = () => {
    logoutUser();
    navigate('/', { replace: true });
  };

  return (
    <header className="bg-white">
      <div className="bg-[#162e51] text-white text-xs py-1 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-semibold">An official website of the United States government</span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Scale className="w-9 h-9 sm:w-10 sm:h-10 text-[#1a4480]" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#162e51]">U.S. District Lookup</h1>
            <p className="text-xs sm:text-sm text-[#71767a]">Electronic Docket Registry</p>
          </div>
        </div>
        {showLogout && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1a4480] border border-[#1a4480] rounded-sm px-3 py-1.5 hover:bg-[#1a4480] hover:text-white transition-colors"
            data-testid="logout-button"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="uppercase">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}

export function GovFooter() {
  return (
    <footer className="bg-[#162e51] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Scale className="w-7 h-7" />
            <span className="font-semibold text-sm sm:text-base">Administrative Office of the U.S. Courts</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300">
            © {new Date().getFullYear()} U.S. District Court System
          </p>
        </div>
      </div>
    </footer>
  );
}
