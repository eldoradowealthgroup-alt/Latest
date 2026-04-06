import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GovHeader from "../components/GovHeader";
import GovFooter from "../components/GovFooter";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SearchLoading = ({ searchData, setSearchResults }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation - 5 seconds total
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

    // Fetch results after 5 seconds
    const fetchTimer = setTimeout(async () => {
      try {
        const response = await axios.post(`${API}/citations/search`, searchData);
        setSearchResults(response.data);
        navigate("/results");
      } catch (err) {
        setSearchResults({
          found: false,
          message: "An error occurred while searching. Please try again."
        });
        navigate("/results");
      }
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(fetchTimer);
    };
  }, [searchData, setSearchResults, navigate]);

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
};

export default SearchLoading;
