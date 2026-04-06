import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import GovHeader from "../components/GovHeader";
import GovFooter from "../components/GovFooter";

const CitationSearch = ({ setSearchData, userProfile }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(userProfile?.name || "");
  const [citationNumber, setCitationNumber] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchData({
      name,
      citation_number: citationNumber,
      zip_code: zipCode
    });
    navigate("/loading");
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
              <Label htmlFor="search-name" className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]">
                Search Registry
              </Label>
              <Input
                id="search-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 text-base"
                placeholder="Start typing name..."
                required
                data-testid="search-name-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="citation-number" className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]">
                Citation Number
              </Label>
              <Input
                id="citation-number"
                type="text"
                value={citationNumber}
                onChange={(e) => setCitationNumber(e.target.value)}
                className="rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 font-mono text-base"
                placeholder="Enter citation number"
                required
                data-testid="search-citation-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip-code" className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]">
                Zip Code
              </Label>
              <Input
                id="zip-code"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 text-base"
                placeholder="Enter zip code"
                required
                maxLength={10}
                data-testid="search-zip-input"
              />
            </div>

            <Button
              type="submit"
              className="w-full sm:w-auto rounded-sm bg-[#1a4480] hover:bg-[#162e51] text-white py-3 px-6 text-sm font-bold mt-2 sm:mt-4"
              data-testid="search-submit-button"
            >
              SEARCH RECORDS
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#dfe1e2]">
            <Link to="/profile">
              <Button
                type="button"
                variant="ghost"
                className="text-[#1a4480] hover:text-[#162e51] text-sm font-semibold p-0"
              >
                ← Back to Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <GovFooter />
    </div>
  );
};

export default CitationSearch;
