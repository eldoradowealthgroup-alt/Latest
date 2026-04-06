import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import GovHeader from "../components/GovHeader";
import GovFooter from "../components/GovFooter";

const PaymentMethods = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayHere = () => {
    navigate("/payment-form");
  };

  const handleFederalKiosk = () => {
    navigate("/federal-kiosk");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      
      <div className="border-b-4 border-[#1a4480]" />

      {/* Secondary Nav */}
      <div className="border-b border-[#dfe1e2] px-3 sm:px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-[#1a4480] flex items-center gap-1">
              <span>🌐</span> Select language ▾
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#1a4480]">
            <span>📍</span> Find a Federal Court
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1a4480] text-center mb-8 italic">
          Accepted Payment Methods
        </h1>

        {/* Debit/Credit Cards */}
        <div className="bg-[#f5f5f5] rounded-sm p-6 sm:p-8 mb-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a4480] italic mb-4">
            Debit/Credit Cards
          </h2>
          <ul className="text-[#1b1b1b] space-y-1 mb-4">
            <li>• Visa, MasterCard, Amex</li>
            <li>• Secure & Encrypted</li>
            <li>• No Additional Fees</li>
          </ul>
          <div className="flex justify-center mb-4">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=120&fit=crop" 
              alt="Credit Cards" 
              className="h-16 sm:h-20 w-auto opacity-80"
            />
          </div>
          <Button
            onClick={handlePayHere}
            className="rounded-sm bg-[#1a4480] hover:bg-[#162e51] text-white py-3 px-8 text-base font-bold"
            data-testid="pay-here-btn"
          >
            Pay Here
          </Button>
        </div>

        {/* Federal Bonding Kiosk */}
        <div className="bg-[#f5f5f5] rounded-sm p-6 sm:p-8 mb-6 text-center">
          <div className="flex items-start justify-center gap-4 mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#1a4480] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-current">
                <path d="M12 2L2 8v2h20V8L12 2zm0 2.5L18 8H6l6-3.5zM4 12v8h3v-6h2v6h2v-6h2v6h2v-6h2v6h3v-8H4z"/>
              </svg>
            </div>
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a4480] italic">
                Federal Bonding Kiosk
              </h2>
              <ul className="text-[#1b1b1b] space-y-1 mt-2">
                <li>• Available Nationwide</li>
                <li>• Syncs with Database</li>
                <li>• No Personal Info Required</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=120&fit=crop" 
              alt="Kiosk" 
              className="h-20 sm:h-24 w-auto rounded"
            />
          </div>
          <Button
            onClick={handleFederalKiosk}
            className="rounded-sm bg-[#1a4480] hover:bg-[#162e51] text-white py-3 px-8 text-base font-bold"
          >
            Learn More
          </Button>
        </div>

        {/* Federal Direct Transfer - Disabled */}
        <div className="bg-[#f5f5f5] rounded-sm p-6 sm:p-8 mb-6 text-center opacity-70">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1b1b1b] italic mb-4">
            Federal Direct Transfer
          </h2>
          <ul className="text-[#1b1b1b] space-y-1 mb-4">
            <li>• Secure Government Processing</li>
            <li>• Immediate Account Funding</li>
            <li>• Federally Authorized Transfer</li>
          </ul>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-12 sm:w-24 sm:h-14 rounded-full bg-[#1a4480] flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">FDT</span>
            </div>
          </div>
          <Button
            disabled
            className="rounded-sm bg-gray-400 text-white py-3 px-8 text-base font-bold cursor-not-allowed"
          >
            Coming Soon
          </Button>
        </div>

        {/* Return to top button */}
        <div className="flex justify-center mt-8 mb-4">
          <Button
            onClick={scrollToTop}
            variant="outline"
            className="rounded-full border-[#1a4480] text-[#1a4480] hover:bg-[#1a4480] hover:text-white py-2 px-6 text-sm font-semibold"
          >
            Return to top ↑
          </Button>
        </div>

        <div className="mt-4">
          <Button
            onClick={() => navigate("/courses-of-action")}
            variant="ghost"
            className="text-[#1a4480] hover:text-[#162e51] text-sm font-semibold p-0"
          >
            ← Back to Courses of Action
          </Button>
        </div>
      </div>

      <GovFooter />
    </div>
  );
};

export default PaymentMethods;
